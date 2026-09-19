import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { getErrorMessage } from "../api/client";
import type { EntryRequest } from "../types/entry";
import { ErrorMessage } from "./ErrorMessage";
import styles from "./NewEntryForm.module.css";

const today = () => new Date().toISOString().slice(0, 10);

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ".jpg,.jpeg,.png,.webp,.gif";

interface FormError {
  title: string;
  message: string;
}

interface NewEntryFormProps {
  onAdd: (
    entry: EntryRequest,
    photo: File | null,
  ) => Promise<{ photoError: string | null }>;
}

export function NewEntryForm({ onAdd }: NewEntryFormProps) {
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [trainingGoal, setTrainingGoal] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  function selectPhoto(file: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > MAX_PHOTO_BYTES) {
      event.target.value = "";
      selectPhoto(null);
      setFormError({
        title: "The photo is too large",
        message: "Choose a photo that is at most 5 MB.",
      });
      return;
    }

    setFormError(null);
    selectPhoto(file);
  }

  function reset() {
    setTitle("");
    setStory("");
    setTrainingGoal("");
    setDate(today());
    selectPhoto(null);
    if (photoInput.current) photoInput.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const { photoError } = await onAdd(
        {
          date,
          title: title.trim(),
          story: story.trim(),
          trainingGoal: trainingGoal.trim(),
          goalCompleted: false,
        },
        photo,
      );
      reset();

      if (photoError) {
        setFormError({
          title: "The entry was saved without its photo",
          message: photoError,
        });
      }
    } catch (error) {
      setFormError({
        title: "Could not save the entry",
        message: getErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>New entry</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="date">
          Date
        </label>
        <input
          className={styles.input}
          id="date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Title
        </label>
        <input
          className={styles.input}
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="First swim of the autumn"
          maxLength={80}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="story">
          What happened today?
        </label>
        <textarea
          className={styles.textarea}
          id="story"
          value={story}
          onChange={(event) => setStory(event.target.value)}
          placeholder="Stood in the shallows for ten minutes before deciding the water was fine."
          maxLength={1000}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="goal">
          Training goal
        </label>
        <input
          className={styles.input}
          id="goal"
          type="text"
          value={trainingGoal}
          onChange={(event) => setTrainingGoal(event.target.value)}
          placeholder="Come back on recall near water"
          maxLength={120}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="photo">
          Photo
        </label>
        {previewUrl && (
          <img className={styles.preview} src={previewUrl} alt="" />
        )}
        <input
          ref={photoInput}
          className={styles.file}
          id="photo"
          type="file"
          accept={PHOTO_TYPES}
          onChange={handlePhotoChange}
        />
      </div>

      {formError && (
        <ErrorMessage title={formError.title} message={formError.message} />
      )}

      <button className={styles.submit} type="submit" disabled={isSaving}>
        {isSaving ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
