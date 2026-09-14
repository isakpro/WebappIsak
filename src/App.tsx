import { useState } from "react";
import { Header } from "./components/Header";
import { EntryList } from "./components/EntryList";
import { NewEntryForm } from "./components/NewEntryForm";
import { sampleEntries } from "./data/sampleEntries";
import type { DiaryEntry, NewDiaryEntry } from "./types/entry";
import styles from "./App.module.css";

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(sampleEntries);

  function addEntry(entry: NewDiaryEntry) {
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      goalCompleted: false,
    };
    setEntries((current) => [newEntry, ...current]);
  }

  function toggleGoal(id: string) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, goalCompleted: !entry.goalCompleted }
          : entry,
      ),
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <NewEntryForm onAdd={addEntry} />
        </div>
        <EntryList entries={entries} onToggleGoal={toggleGoal} />
      </main>
    </>
  );
}
