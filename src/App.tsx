import { Header } from "./components/Header";
import { EntryList } from "./components/EntryList";
import { NewEntryForm } from "./components/NewEntryForm";
import { useEntries } from "./hooks/useEntries";
import styles from "./App.module.css";

export default function App() {
  const { entries, addEntry, toggleGoal } = useEntries();

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
