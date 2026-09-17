import type { WordResult } from "../types/word";
import { WordResultCard } from "./WordResultCard";
import styles from "./MultiWordResults.module.css";

interface MultiWordResultsProps {
  results: (WordResult | null)[];
}

export function MultiWordResults({ results }: MultiWordResultsProps) {
  const found = results.filter((r): r is WordResult => r !== null);

  return (
    <div className={styles.wrapper}>
      {found.map((r) => (
        <WordResultCard key={r.word} data={r} />
      ))}
    </div>
  );
}