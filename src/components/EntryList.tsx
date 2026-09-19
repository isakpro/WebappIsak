import type { DiaryEntry } from "../types/entry";
import { EntryCard } from "./EntryCard";
import { ErrorMessage } from "./ErrorMessage";
import styles from "./EntryList.module.css";

interface EntryListProps {
  entries: DiaryEntry[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleGoal: (id: number) => void;
}

export function EntryList({
  entries,
  isLoading,
  error,
  onRetry,
  onToggleGoal,
}: EntryListProps) {
  function renderContent() {
    if (isLoading) {
      return (
        <p className={styles.loading} role="status">
          Fetching the diary…
        </p>
      );
    }

    if (error) {
      return (
        <ErrorMessage
          title="Could not load the diary"
          message={error}
          onRetry={onRetry}
        />
      );
    }

    if (entries.length === 0) {
      return (
        <p className={styles.empty}>
          No entries yet. Write down what your dog got up to today.
        </p>
      );
    }

    return (
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <EntryCard entry={entry} onToggleGoal={onToggleGoal} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>The diary</h2>
        {!isLoading && !error && (
          <span className={styles.count}>
            {entries.length} {entries.length === 1 ? "day" : "days"}
          </span>
        )}
      </div>

      {renderContent()}
    </section>
  );
}
