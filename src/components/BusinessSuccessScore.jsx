import React from "react";
import "./style/BusinessSuccessScore.module.css";

function BusinessSuccessScore({
  score = 0,
  confidence = null,
  verdict = "",
  benchmark = "Analisi AI",
}) {
  // Limita il punteggio all'intervallo consentito.
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Calcola la porzione di anello da mostrare.
  const circumference = 2 * Math.PI * 50;
  const dashOffset = circumference * (1 - normalizedScore / 100);

  return (
    <section
      className="business-score-card"
      aria-labelledby="business-score-title"
    >
      <div className="business-score-header">
        <h2 id="business-score-title" className="business-score-title">
          Business Success Score
        </h2>
      </div>

      <div className="business-score-content">
        <div
          className="business-score-gauge"
          role="img"
          aria-label={`Punteggio di successo: ${normalizedScore} su 100`}
        >
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle
              className="business-score-gauge-track"
              cx="60"
              cy="60"
              r="50"
            />

            <circle
              className="business-score-gauge-progress"
              cx="60"
              cy="60"
              r="50"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <div className="business-score-gauge-value">
            <span className="business-score-number">{normalizedScore}</span>

            <span className="business-score-scale">/ 100</span>
          </div>
        </div>

        <div className="business-score-verdict">
          <h3 className="business-score-verdict-title">Valutazione AI</h3>

          <p className="business-score-verdict-text">{verdict}</p>
        </div>
      </div>

      <div className="business-score-footer">
        {confidence != null && (
          <span className="business-score-confidence">
            Confidenza statistica:{" "}
            {Number(confidence).toLocaleString("it-IT", {
              maximumFractionDigits: 1,
            })}
            %
          </span>
        )}

        <span className="business-score-benchmark">{benchmark}</span>
      </div>
    </section>
  );
}

export default BusinessSuccessScore;
