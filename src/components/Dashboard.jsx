import React, { useState } from "react";
import { supabaseClient } from "../supabaseClient";
import Loader from "./Loader";
import DownloadPDFButton from "./DownloadPDFButton";
import Score from "../../cassetto-degli-attrezzi/Score";
// CSS Module: le classi di Dashboard.module.css valgono SOLO qui (Vite le rinomina con un hash unico)
import styles from "./Dashboard.module.css"; // Stili delle nuove sezioni (metriche, competitor, GO/NO GO, suggerimenti)

// Classe di colore di una metrica in base al valore (verde / ambra / rosso)
function livelloMetrica(valore) {
  if (valore >= 70) return "metric--alto";
  if (valore >= 40) return "metric--medio";
  return "metric--basso";
}

function Dashboard({ session }) {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Blocca il refresh nativo della pagina del browser
    setError(""); // Ripulisce eventuali errori lasciati da tentativi passati
    setResult(null); // Resetta i risultati precedenti
    setLoading(true); // Attiva lo stato di caricamento

    try {
      // 1. CREAZIONE DELLA SOLA COSTANTE PER IL TIMER (Parte all'inizio del caricamento)
      const timerMinimo = new Promise((resolve) => setTimeout(resolve, 5000));

      // La TUA funzione originale invariata, esattamente come l'hai scritta tu
      const { data, error: funcError } = await supabaseClient.functions.invoke(
        "evaluate-idea",
        {
          body: { idea },
        },
      );

      // Se la Edge Function risponde con un errore, passa direttamente al catch
      if (funcError) throw funcError;

      // 2. ATTESA DEL TIMER: Se la chiamata è stata più veloce di 5 secondi, blocca qui il flusso finché non scadono
      await timerMinimo;

      setResult(data);
    } catch (err) {
      let messaggio = err.message;
      if (err.context) {
        try {
          const body = await err.context.json();
          messaggio = body.error || messaggio;
        } catch {}
      }
      console.error("Errore evaluate-idea:", messaggio);
      setError(messaggio);
    } finally {
      setLoading(false); // Sblocca l'interfaccia
    }
  };

  // Etichetta del livello di potenziale in base al Business Success Score (media delle 8 metriche)
  const livelloPotenziale = !result
    ? ""
    : result.business_success_score >= 70
      ? "ALTO POTENZIALE"
      : result.business_success_score >= 40
        ? "POTENZIALE MODERATO"
        : "DA APPROFONDIRE";

  // true se l'esito finale è GO (usato per il colore verde/rosso)
  const isGo = result?.valutazione_finale?.esito === "GO";

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-header"]}>
        <h2>Assistente Aziendale</h2>
        <p>
          Pronto per valutare la tua idea,{" "}
          <strong>{session?.user?.email}</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit} className={styles["idea-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="idea-input">La tua idea imprenditoriale</label>
          <textarea
            id="idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={loading}
            placeholder="Descrivi dettagliatamente il tuo progetto, il mercato di riferimento e il target di clienti..."
            required
            minLength={30}
            className={styles["idea-textarea"]}
          />
        </div>

        {error && <p className={styles["error-message"]}>{error}</p>}

        <button type="submit" disabled={loading} className={styles["btn-evaluate"]}>
          {loading
            ? "Analisi in corso con OpenAI..."
            : "Valuta Idea Imprenditoriale"}
        </button>
      </form>

      {/*BLOCCO DEL LOADER COME MODULO SEPARATO*/}
      {loading && <Loader />}

      {/* SEZIONE RISULTATI REALI: Mostrata solo se result contiene i dati di OpenAI */}
      {result && (
        <>
          {/* SINTESI DELL'IDEA: rielaborazione sintetica dell'input dell'utente */}
          <section className={styles["results-block"]}>
            <h3 className={styles["results-block-title"]}>Sintesi dell'idea</h3>
            <p className={styles["idea-summary"]}>{result.sintesi_idea}</p>
          </section>

          {/* BUSINESS SUCCESS SCORE: media delle 8 metriche, calcolata dalla Edge Function */}
          <Score
            score={result.business_success_score}
            verdict={`Media delle 8 metriche di valutazione. Livello: ${livelloPotenziale}.`}
            status={livelloPotenziale}
            benchmark="Analisi AI"
          />

          <div className={styles["results-section"]}>
            {/* Box con il voto numerico reale estratto dal JSON */}
            {/* <div className={styles["results-score-box"]}>
              <h3>Punteggio Generale: {result.punteggio_generale}/100</h3>
            </div> */}

            {/* Paragrafo descrittivo con la sintesi motivata dell'AI
            <p className={styles["results-summary"]}>{result.sintesi}</p> */}

            {/* OTTO METRICHE: titolo, valore e breve motivazione */}
            <section className={styles["results-block"]}>
              <h3 className={styles["results-block-title"]}>Metriche di valutazione</h3>
              <div className={styles["metrics-grid"]}>
                {result.metriche?.map((metrica) => (
                  <article
                    key={metrica.chiave}
                    className={`${styles["metric-card"]} ${styles[livelloMetrica(metrica.valore)]}`}
                  >
                    <div className={styles["metric-card-header"]}>
                      <h4 className={styles["metric-title"]}>{metrica.titolo}</h4>
                      <span className={styles["metric-value"]}>
                        {metrica.valore}
                        <span className={styles["metric-scale"]}>/100</span>
                      </span>
                    </div>

                    {/* Barra di avanzamento proporzionale al valore */}
                    <div
                      className={styles["metric-bar"]}
                      role="progressbar"
                      aria-valuenow={metrica.valore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={metrica.titolo}
                    >
                      <div
                        className={styles["metric-bar-fill"]}
                        style={{ width: `${metrica.valore}%` }}
                      />
                    </div>

                    <p className={styles["metric-reason"]}>{metrica.motivazione}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Griglia SWOT organizzata nei 4 quadranti accademici */}
            <div className={styles["swot-grid"]}>
              <div className={`${styles["swot-card"]} ${styles["strength"]}`}>
                <h4>Punti di Forza</h4>
                <ul>
                  {result.swot?.punti_forza?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={`${styles["swot-card"]} ${styles["weakness"]}`}>
                <h4>Debolezze</h4>
                <ul>
                  {result.swot?.debolezze?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={`${styles["swot-card"]} ${styles["opportunity"]}`}>
                <h4>Opportunità</h4>
                <ul>
                  {result.swot?.opportunita?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Il quadrante "Rischi" ora si chiama "Minacce" come da specifiche; la classe CSS resta "risk" */}
              <div className={`${styles["swot-card"]} ${styles["risk"]}`}>
                <h4>Minacce</h4>
                <ul>
                  {result.swot?.minacce?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* TABELLA COMPETITOR: fino a 3, sempre presentati come "da verificare" */}
            <section className={styles["results-block"]}>
              <h3 className={styles["results-block-title"]}>Possibili competitor</h3>
              <p className={styles["competitor-note"]}>
                Suggeriti dall'AI senza una ricerca aggiornata: verifica che
                esistano e che le informazioni siano corrette prima di usarle.
              </p>

              {result.competitor?.length > 0 ? (
                // Il wrapper permette lo scroll orizzontale della tabella su schermi stretti
                <div className={styles["competitor-table-wrapper"]}>
                  <table className={styles["competitor-table"]}>
                    <thead>
                      <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Attività principale</th>
                        <th scope="col">Possibile punto debole</th>
                        <th scope="col">Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.competitor.map((c, index) => (
                        <tr key={index}>
                          <td className={styles["competitor-name"]}>{c.nome}</td>
                          <td>{c.attivita}</td>
                          <td>{c.punto_debole}</td>
                          <td>
                            {/* Badge distintivo per le informazioni non verificate */}
                            <span
                              className={
                                c.verificato
                                  ? styles["badge-verified"]
                                  : styles["badge-unverified"]
                              }
                            >
                              {c.verificato ? "Verificato" : "Da verificare"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles["competitor-empty"]}>
                  L'AI non ha individuato competitor pertinenti: prova a cercare
                  alternative esistenti con una ricerca di mercato.
                </p>
              )}
            </section>

            {/* VALUTAZIONE CONCLUSIVA GO / NO GO: colore verde/rosso sempre accompagnato da testo e icona */}
            <section
              className={`${styles["final-verdict"]} ${isGo ? styles["final-verdict--go"] : styles["final-verdict--nogo"]}`}
              aria-labelledby="final-verdict-title"
            >
              <div className={styles["final-verdict-badge"]}>
                <span className={styles["final-verdict-icon"]} aria-hidden="true">
                  {isGo ? "✓" : "✕"}
                </span>
                <span id="final-verdict-title" className={styles["final-verdict-label"]}>
                  {isGo ? "GO" : "NO GO"}
                </span>
              </div>
              <p className={styles["final-verdict-text"]}>
                {result.valutazione_finale?.spiegazione}
              </p>
            </section>

            {/* TRE SUGGERIMENTI OPERATIVI per validare o migliorare l'idea */}
            <section className={styles["results-block"]}>
              <h3 className={styles["results-block-title"]}>
                Prossimi passi consigliati
              </h3>
              <ol className={styles["suggestions-list"]}>
                {result.suggerimenti?.map((suggerimento, index) => (
                  <li key={index}>{suggerimento}</li>
                ))}
              </ol>
            </section>

            {/* Disclaimer obbligatorio richiesto dalle specifiche tecniche */}
            <p className={styles["disclaimer-text"]}>
              La valutazione AI è una stima motivata, non una previsione
              scientifica del successo commerciale.
            </p>
          </div>
          <DownloadPDFButton result={result} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
