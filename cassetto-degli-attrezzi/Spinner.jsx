import "./Spinner.css";
import "../src/index.css";

function Spinner() {
  return (
    <main className="main">
      {/* CARICAMENTO */}
      <section className="card loading" id="state-loading" aria-live="polite">
        {/* Spinner: da qui */}
        <div className="spinner">
          <div className="glow"></div>
          <div className="ring-outer"></div>
          <div className="ring-inner"></div>
          <div className="core">
            <span className="ping"></span>
            <span className="material-symbols-outlined">memory</span>
          </div>
          <div className="orbit">
            <i></i>
          </div>
        </div>
        {/* a qui */}

        {/* Testo: da qui */}
        <div style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Stiamo analizzando la tua idea…</h2>
          <p>
            Elaborazione dei parametri di mercato e proiezioni finanziarie in
            corso...
          </p>
        </div>
        {/* a qui */}

        <div className="progress-panel">
          <div className="log">
            {/* Riga di log: da qui */}
            <div className="running">
              <span className="material-symbols-outlined icon-sm">sync</span>
              <span>Connessione ai modelli predittivi...</span>
            </div>
            {/* a qui */}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Spinner;
