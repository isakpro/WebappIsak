import { Header } from "./components/Header";
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>{/* The diary feed goes here. */}</main>
    </>
  );
}
