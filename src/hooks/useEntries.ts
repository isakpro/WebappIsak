import { useEffect, useState } from "react";
import { getErrorMessage } from "../api/client";
import { createEntry, getEntries } from "../api/entries";
import type { DiaryEntry, EntryRequest } from "../types/entry";

function sortNewestFirst(entries: DiaryEntry[]) {
  return entries.toSorted(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  );
}

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

  async function addEntry(entry: EntryRequest) {
    const created = await createEntry(entry);
    setEntries((current) => sortNewestFirst([created, ...current]));
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
