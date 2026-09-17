import type { SentenceResult as SentenceResultType } from "../types/word";
import styles from "./SentenceResult.module.css";

interface SentenceResultProps {
  data: SentenceResultType;
}

export function SentenceResult({ data }: SentenceResultProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>ترجمه</div>
      <div className={styles.text}>{data.translation}</div>
    </div>
  );
}