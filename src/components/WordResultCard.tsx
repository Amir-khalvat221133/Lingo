import { useState } from "react";
import type { WordResult } from "../types/word";
import styles from "./WordResultCard.module.css";

interface WordResultCardProps {
  data: WordResult;
  onAcceptSuggestion?: (word: string) => void;
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 4l14 8-14 8V4z" fill="currentColor" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function WordResultCard({ data, onAcceptSuggestion }: WordResultCardProps) {
  const [toast, setToast] = useState(false);

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 1500);
  }

  function handleCopy() {
    navigator.clipboard.writeText(data.word).then(showToast);
  }

  function handlePlay() {
    if (data.audioUrl) {
      new Audio(data.audioUrl).play();
    }
  }

  return (
    <>
      <div className={styles.card}>
        {data.didYouMean && data.didYouMean.confidence >= 0.7 && onAcceptSuggestion && (
        <div className={styles.suggestion}>
          منظورت{" "}
          <button
            type="button"
            className={styles.suggestionBtn}
            onClick={() => onAcceptSuggestion(data.didYouMean!.suggestion)}
          >
            <span className="ltr-content">{data.didYouMean.suggestion}</span>
          </button>{" "}
          بود؟
        </div>
      )}

      <div className={styles.header}>
        <span className={`${styles.word} ltr-content`}>{data.word}</span>
        <button type="button" className={styles.copyBtn} aria-label="کپی کلمه" onClick={handleCopy}>
          <CopyIcon />
        </button>
      </div>

      {data.ipa && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>تلفظ</div>
          <div className={styles.ipaRow}>
            <span className={`${styles.sectionText} ltr-content`}>{data.ipa}</span>
            {data.audioUrl && (
              <button
                type="button"
                className={styles.playBtn}
                aria-label="پخش تلفظ"
                onClick={handlePlay}
              >
                <PlayIcon />
              </button>
            )}
          </div>
        </div>
      )}

      {data.partOfSpeech && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>نقش دستوری</div>
          <div className={`${styles.sectionText} ltr-content`}>{data.partOfSpeech}</div>
        </div>
      )}

      {data.meaningFa && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>معنی</div>
          <div className={styles.sectionText}>{data.meaningFa}</div>
        </div>
      )}

      {data.meaningEn && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>معنی انگلیسی</div>
          <div className={`${styles.sectionText} ltr-content`}>{data.meaningEn}</div>
        </div>
      )}

      {data.synonyms && data.synonyms.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>مترادف‌ها</div>
          <div className={styles.chipRow}>
            {data.synonyms.map((s) => (
              <span key={s} className={`${styles.chip} ltr-content`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.usageDifference && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>تفاوت کاربرد</div>
          <div className={styles.sectionText}>{data.usageDifference}</div>
        </div>
      )}

      {data.antonyms && data.antonyms.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>متضادها</div>
          <div className={styles.chipRow}>
            {data.antonyms.map((a) => (
              <span key={a} className={`${styles.chip} ltr-content`}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.wordForms && data.wordForms.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>شکل‌های کلمه</div>
          <div className={styles.chipRow}>
            {data.wordForms.map((wf) => (
              <div key={wf.form + wf.label} className={styles.wordFormRow}>
                <span className={`${styles.chip} ltr-content`}>{wf.form}</span>
                {wf.label && <span className={styles.wordFormLabel}>{wf.label}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.example && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>مثال</div>
          <div className={`${styles.sectionText} ltr-content`}>{data.example}</div>
        </div>
      )}

      {data.commonPhrases && data.commonPhrases.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>عبارت‌های رایج</div>
          <div className={styles.chipRow}>
            {data.commonPhrases.map((p) => (
              <span key={p} className={`${styles.chip} ltr-content`}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.collocations && data.collocations.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>ترکیب‌های رایج</div>
          <div className={styles.chipRow}>
            {data.collocations.map((c) => (
              <span key={c} className={`${styles.chip} ltr-content`}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.idioms && data.idioms.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>اصطلاحات</div>
          <div className={styles.chipRow}>
            {data.idioms.map((i) => (
              <span key={i} className={`${styles.chip} ltr-content`}>
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      </div>
      {toast && <div className={styles.toast}>کپی شد</div>}
    </>
  );
}