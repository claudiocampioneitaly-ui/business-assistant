import React, { useState } from "react";
import { supabaseClient } from "../supabaseClient";

function Dashboard({ session }) {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Blocca il refresh nativo della pagina del browser
    setError(""); // Ripulisce eventuali errori lasciati da tentativi passati
    setResult(null); // Resetta i risultati precedenti per dare spazio alla nuova analisi
    setLoading(true); // Attiva lo stato di caricamento e congela l'interfaccia

    try {
      // const { data, error: funcError } = await supabaseClient.functions.invoke('evaluate-idea', { body: { idea } });

      // Invia il testo scritto nella casella all'URL sicuro del tuo backend serverless, che a sua volta interrogherà OpenAI in modalità protetta.
      const { data, error: funcError } = await supabaseClient.functions.invoke(
        "evaluate-idea",
        {
          body: { idea },
        },
      );

      // Se la Edge Function risponde con un codice di errore o fallisce la connessione, questo controllo blocca l'esecuzione e devia il flusso direttamente nel blocco catch per mostrare l'avviso a schermo
      if (funcError) throw funcError;
      setResult(data);
      console.log("Idea inviata correttamente:", idea);

      // Feedback provvisorio prima dell'integrazione Edge Function
      setResult({ simulazione: true });
    } catch (err) {
      setError(
        "Si è verificato un errore durante l'invio o l'analisi dell'idea.",
      );
    } finally {
      setLoading(false); // Sblocca l'interfaccia e riattiva pulsanti e textarea
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

      {/* SEZIONE RISULTATI REALI: Mostrata solo se result contiene i dati di OpenAI */}
      {result && (
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
      )}
    </div>
  );
}

export default Dashboard;
