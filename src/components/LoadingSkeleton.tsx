import styles from "./LoadingSkeleton.module.css";

export function LoadingSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>یه کوچولو منتظر باش...</div>
      <div className={styles.card}>
        <div className={`${styles.line} ${styles.lineWide}`} />
        <div className={`${styles.line} ${styles.lineMedium}`} />
        <div className={`${styles.line} ${styles.lineNarrow}`} />
        <div className={`${styles.line} ${styles.lineMedium}`} />
      </div>
    </div>
  );
}