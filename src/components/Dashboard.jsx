import React, { useState } from "react";
import { supabaseClient } from "../supabaseClient";
import Loader from "./Loader";
import DownloadPDFButton from "./DownloadPDFButton";

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Assistente Aziendale</h2>
        <p>
          Pronto per valutare la tua idea,{" "}
          <strong>{session?.user?.email}</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="idea-form">
        <div className="form-group">
          <label htmlFor="idea-input">La tua idea imprenditoriale</label>
          <textarea
            id="idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={loading}
            placeholder="Descrivi dettagliatamente il tuo progetto, il mercato di riferimento e il target di clienti..."
            required
            minLength={30}
            className="idea-textarea"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading} className="btn-evaluate">
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
          <DownloadPDFButton result={result} />
          <div className="results-section">
            {/* Box con il voto numerico reale estratto dal JSON */}
            <div className="results-score-box">
              <h3>Punteggio Generale: {result.punteggio_generale}/100</h3>
            </div>

            {/* Paragrafo descrittivo con la sintesi motivata dell'AI */}
            <p className="results-summary">{result.sintesi}</p>

            {/* Griglia SWOT organizzata nei 4 quadranti accademici */}
            <div className="swot-grid">
              <div className="swot-card strength">
                <h4>Punti di Forza</h4>
                <ul>
                  {result.punti_forza?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="swot-card weakness">
                <h4>Punti Deboli</h4>
                <ul>
                  {result.punti_deboli?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="swot-card opportunity">
                <h4>Opportunità</h4>
                <ul>
                  {result.opportunita?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="swot-card risk">
                <h4>Rischi</h4>
                <ul>
                  {result.rischi?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer obbligatorio richiesto dalle specifiche tecniche */}
            <p className="disclaimer-text">
              La valutazione AI è una stima motivata, non una previsione
              scientifica del successo commerciale.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
