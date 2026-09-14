import { useState, type FormEvent } from "react";
import type { NewDiaryEntry } from "../types/entry";
import styles from "./NewEntryForm.module.css";

const today = () => new Date().toISOString().slice(0, 10);

interface NewEntryFormProps {
  onAdd: (entry: NewDiaryEntry) => void;
}

export function NewEntryForm({ onAdd }: NewEntryFormProps) {
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [trainingGoal, setTrainingGoal] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd({
      date,
      title: title.trim(),
      story: story.trim(),
      trainingGoal: trainingGoal.trim(),
      photoUrl,
    });
    setTitle("");
    setStory("");
    setTrainingGoal("");
    setPhotoUrl(null);
    setDate(today());
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

      <button className={styles.submit} type="submit">
        Save entry
      </button>
    </form>
  );
}
