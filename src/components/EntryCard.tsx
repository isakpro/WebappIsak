import type { DiaryEntry } from "../types/entry";
import styles from "./EntryCard.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

interface EntryCardProps {
  entry: DiaryEntry;
  onToggleGoal: (id: number) => void;
}

export function EntryCard({ entry, onToggleGoal }: EntryCardProps) {
  const { id, date, title, story, trainingGoal, goalCompleted, photoUrl } =
    entry;

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
        <p className={styles.story}>{story}</p>

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
            onClick={() => onToggleGoal(id)}
          >
            {goalCompleted ? "Done" : "Mark as done"}
          </button>
        </div>
      </div>
    </article>
  );
}
