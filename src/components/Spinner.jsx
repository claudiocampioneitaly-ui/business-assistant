// CSS Module: le classi di Spinner.module.css valgono SOLO qui (Vite le rinomina con un hash unico)
import styles from "../style/Spinner.module.css";
import "../index.css";

function Spinner() {
  return (
    <main className={styles["main"]}>
      {/* CARICAMENTO */}
      <section className={`${styles["card"]} ${styles["loading"]}`} id="state-loading" aria-live="polite">
        {/* Spinner: da qui */}
        <div className={styles["spinner"]}>
          <div className={styles["glow"]}></div>
          <div className={styles["ring-outer"]}></div>
          <div className={styles["ring-inner"]}></div>
          <div className={styles["core"]}>
            <span className={styles["ping"]}></span>
            <span className="material-symbols-outlined">memory</span>
          </div>
          <div className={styles["orbit"]}>
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

        <div className={styles["progress-panel"]}>
          <div className={styles["log"]}>
            {/* Riga di log: da qui */}
            <div className={styles["running"]}>
              <span className={`material-symbols-outlined ${styles["icon-sm"]}`}>sync</span>
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
