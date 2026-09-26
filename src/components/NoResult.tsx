import styles from "./NoResult.module.css";

interface NoResultProps {
  variant?: "noResult" | "error";
  onRetry?: () => void;
}

export function NoResult({ variant = "noResult", onRetry }: NoResultProps) {
  const message =
    variant === "error"
      ? "مشکلی توی دریافت نتیجه پیش اومد."
      : "دنبال چیزی که نیست میگردی؟";

  return (
    <div className={styles.wrapper}>
      <div className={styles.text}>{message}</div>
      {variant === "error" && onRetry && (
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          دوباره امتحان کن
        </button>
      )}
    </div>
  );
}