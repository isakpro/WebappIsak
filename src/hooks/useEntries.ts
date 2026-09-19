import { useEffect, useState } from "react";
import { getErrorMessage } from "../api/client";
import { getEntries } from "../api/entries";
import type { DiaryEntry, NewDiaryEntry } from "../types/entry";

export function useEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const loaded = await getEntries();
        if (!ignore) setEntries(loaded);
      } catch (error) {
        if (!ignore) setLoadError(getErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [loadAttempt]);

  function reload() {
    setIsLoading(true);
    setLoadError(null);
    setLoadAttempt((current) => current + 1);
  }

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

  return { entries, isLoading, loadError, reload, addEntry, toggleGoal };
}
