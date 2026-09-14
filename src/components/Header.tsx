import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img className={styles.mark} src="/favicon.svg" alt="" />
        <div>
          <h1 className={styles.title}>Pawlog</h1>
          <p className={styles.tagline}>
            One photo, one story, one thing they learned today.
          </p>
        </div>
      </div>
    </header>
  );
}
