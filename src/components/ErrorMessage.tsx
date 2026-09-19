import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  return (
    <div className={styles.error} role="alert">
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
