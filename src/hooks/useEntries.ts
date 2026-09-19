import { useState } from "react";
import { sampleEntries } from "../data/sampleEntries";
import type { DiaryEntry, NewDiaryEntry } from "../types/entry";

export function useEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>(sampleEntries);

  function addEntry(entry: NewDiaryEntry) {
    const newEntry: DiaryEntry = {
      ...entry,
      id: Date.now(),
      goalCompleted: false,
    };
    setEntries((current) => [newEntry, ...current]);
  }

  function toggleGoal(id: number) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, goalCompleted: !entry.goalCompleted }
          : entry,
      ),
    );
  }

  return { entries, addEntry, toggleGoal };
}
