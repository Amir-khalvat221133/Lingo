import type { RecentSearch } from "../lib/storage";
import styles from "./RecentSearches.module.css";

interface RecentSearchesProps {
  items: RecentSearch[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function RecentSearches({ items, onSelect, onClear }: RecentSearchesProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>جستجوهای اخیر</span>
        <button type="button" className={styles.clearBtn} onClick={onClear}>
          پاک کردن
        </button>
      </div>
      <div className={styles.list}>
        {items.map((r) => (
          <button
            key={r.query}
            type="button"
            className={styles.chip}
            onClick={() => onSelect(r.query)}
          >
            {r.query}
          </button>
        ))}
      </div>
    </div>
  );
}