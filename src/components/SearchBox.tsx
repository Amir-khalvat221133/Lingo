import styles from "./SearchBox.module.css";

export type SearchOverride = "words" | "sentence";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  override: SearchOverride | undefined;
  onOverrideChange: (override: SearchOverride | undefined) => void;
}

export function SearchBox({
  value,
  onChange,
  override,
  onOverrideChange,
}: SearchBoxProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <div className={styles.toggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${
              override === "words" ? styles.toggleBtnActive : ""
            }`}
            onClick={() => onOverrideChange(override === "words" ? undefined : "words")}
          >
            کلمات
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${
              override === "sentence" ? styles.toggleBtnActive : ""
            }`}
            onClick={() => onOverrideChange(override === "sentence" ? undefined : "sentence")}
          >
            جمله
          </button>
        </div>
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="سرچ کن"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}