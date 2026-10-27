import React from "react";
// CSS Module: le classi di Score.module.css valgono SOLO qui (Vite le rinomina con un hash unico)
import styles from "../style/Score.module.css";
import "../index.css";

function Score({
  score = 0,
  confidence = null,
  verdict = "",
  benchmark = "Analisi AI",
}) {
  // Limita il punteggio all'intervallo consentito.
  const normalizedScore = Math.max(
    0,
    Math.min(100, Number(score) || 0),
  );

  // Calcola la porzione di anello da mostrare.
  const circumference = 2 * Math.PI * 50;
  const dashOffset =
    circumference * (1 - normalizedScore / 100);

  return (
    <section
      className={styles["business-score-card"]}
      aria-labelledby="business-score-title"
    >
      <div className={styles["business-score-header"]}>
        <h2
          id="business-score-title"
          className={styles["business-score-title"]}
        >
          Business Success Score
        </h2>


      </div>

      <div className={styles["business-score-content"]}>
        <div
          className={styles["business-score-gauge"]}
          role="img"
          aria-label={`Punteggio di successo: ${normalizedScore} su 100`}
        >
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle
              className={styles["business-score-gauge-track"]}
              cx="60"
              cy="60"
              r="50"
            />

            <circle
              className={styles["business-score-gauge-progress"]}
              cx="60"
              cy="60"
              r="50"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <div className={styles["business-score-gauge-value"]}>
            <span className={styles["business-score-number"]}>
              {normalizedScore}
            </span>

            <span className={styles["business-score-scale"]}>
              / 100
            </span>
          </div>
        </div>

        <div className={styles["business-score-verdict"]}>
          <h3 className={styles["business-score-verdict-title"]}>
            Valutazione AI
          </h3>

          <p className={styles["business-score-verdict-text"]}>
            {verdict}
          </p>
        </div>
      </div>

      <div className={styles["business-score-footer"]}>
  {confidence != null && (
    <span className={styles["business-score-confidence"]}>
      Confidenza statistica:{" "}
      {Number(confidence).toLocaleString("it-IT", {
        maximumFractionDigits: 1,
      })}
      %
    </span>
  )}

  <span className={styles["business-score-benchmark"]}>
    {benchmark}
  </span>
</div>
    </section>
  );
}

export default Score;
