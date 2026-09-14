import { useState } from "react";
import { Header } from "./components/Header";
import { EntryList } from "./components/EntryList";
import { sampleEntries } from "./data/sampleEntries";
import type { DiaryEntry } from "./types/entry";
import styles from "./App.module.css";

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(sampleEntries);

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
        <EntryList entries={entries} onToggleGoal={toggleGoal} />
      </main>
    </>
  );
}
