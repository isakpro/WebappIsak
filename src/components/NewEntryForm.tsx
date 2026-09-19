import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../api/client";
import type { EntryRequest } from "../types/entry";
import { ErrorMessage } from "./ErrorMessage";
import styles from "./NewEntryForm.module.css";

const today = () => new Date().toISOString().slice(0, 10);

interface NewEntryFormProps {
  onAdd: (entry: EntryRequest) => Promise<void>;
}

export function NewEntryForm({ onAdd }: NewEntryFormProps) {
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [trainingGoal, setTrainingGoal] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function reset() {
    setTitle("");
    setStory("");
    setTrainingGoal("");
    setPhotoUrl(null);
    setDate(today());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await onAdd({
        date,
        title: title.trim(),
        story: story.trim(),
        trainingGoal: trainingGoal.trim(),
        goalCompleted: false,
      });
      reset();
    } catch (error) {
      setSaveError(getErrorMessage(error));
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
        {photoUrl && <img className={styles.preview} src={photoUrl} alt="" />}
        <input
          className={styles.file}
          id="photo"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPhotoUrl(file ? URL.createObjectURL(file) : null);
          }}
        />
      </div>

      {saveError && (
        <ErrorMessage title="Could not save the entry" message={saveError} />
      )}

      <button className={styles.submit} type="submit" disabled={isSaving}>
        {isSaving ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
