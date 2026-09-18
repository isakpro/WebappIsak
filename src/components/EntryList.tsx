import type { DiaryEntry } from "../types/entry";
import { EntryCard } from "./EntryCard";
import styles from "./EntryList.module.css";

interface EntryListProps {
  entries: DiaryEntry[];
  onToggleGoal: (id: number) => void;
}

export function EntryList({ entries, onToggleGoal }: EntryListProps) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>The diary</h2>
        <span className={styles.count}>
          {entries.length} {entries.length === 1 ? "day" : "days"}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>
          No entries yet. Write down what your dog got up to today.
        </p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id}>
              <EntryCard entry={entry} onToggleGoal={onToggleGoal} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
