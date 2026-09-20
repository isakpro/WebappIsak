import { useState } from "react";
import { getErrorMessage } from "../api/client";
import type { DiaryEntry } from "../types/entry";
import { ErrorMessage } from "./ErrorMessage";
import styles from "./EntryCard.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

interface EntryCardProps {
  entry: DiaryEntry;
  onToggleGoal: (id: number) => Promise<void>;
}

export function EntryCard({ entry, onToggleGoal }: EntryCardProps) {
  const { id, date, title, story, trainingGoal, goalCompleted, photoUrl } =
    entry;
  const [isSaving, setIsSaving] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  async function handleToggle() {
    setIsSaving(true);
    setToggleError(null);

    try {
      await onToggleGoal(id);
    } catch (error) {
      setToggleError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function toggleLabel() {
    if (isSaving) return "Saving…";
    return goalCompleted ? "Done" : "Mark as done";
  }

  return (
    <article className={styles.card}>
      {photoUrl ? (
        <img className={styles.photo} src={photoUrl} alt={title} />
      ) : (
        <div className={styles.photoFallback} aria-hidden="true">
          🐾
        </div>
      )}

      <div className={styles.body}>
        <time className={styles.date} dateTime={date}>
          {dateFormat.format(new Date(date))}
        </time>
        <h3 className={styles.title}>{title}</h3>
        {story && <p className={styles.story}>{story}</p>}

        {trainingGoal && (
          <div className={styles.goal}>
            <p className={styles.goalText}>
              <span className={styles.goalLabel}>Training goal</span>
              <span className={goalCompleted ? styles.goalDone : undefined}>
                {trainingGoal}
              </span>
            </p>
            <button
              type="button"
              className={`${styles.toggle} ${goalCompleted ? styles.toggleDone : ""}`}
              aria-pressed={goalCompleted}
              onClick={handleToggle}
              disabled={isSaving}
            >
              {toggleLabel()}
            </button>
          </div>
        )}

        {toggleError && (
          <ErrorMessage
            title="Could not update the training goal"
            message={toggleError}
          />
        )}
      </div>
    </article>
  );
}
