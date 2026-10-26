import { Link, useLocation } from "react-router";
// CSS Module: le classi di NotFoundPage.module.css valgono SOLO qui (Vite le rinomina con un hash unico)
import styles from "./style/NotFoundPage.module.css";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  // data-page="not-found" sul <main>: index.css lo usa per dare al body lo sfondo uniforme solo sulla 404
  return (
    <main className={styles["nf-main-container"]} data-page="not-found">
      {/* SPOSTATO QUI: Ora fa da sfondo globale solo al tag main e non può superarlo */}
      <div className={styles["nf-backdrop"]} aria-hidden="true">
        <div className={styles["nf-glow--top"]} />
        <div className={styles["nf-grid"]} />
      </div>

      <div className={styles["nf-page"]}>
        <div className={styles["nf-viewport-content"]}>
          <div className={styles["nf-shell"]}>
            
            <div className={styles["nf-status"]}>
              <span className={styles["nf-dot"]}>
                <span className={styles["nf-dot-ping"]} />
                <span className={styles["nf-dot-core"]} />
              </span>
              <span className={styles["nf-status-text"]}>ERR_HTTP_404 • ROTTA NON VALIDA</span>
            </div>

            <div className={styles["nf-hero"]}>
              <h1 className={styles["nf-code"]}>404</h1>
              <h2 className={styles["nf-title"]}>Pagina non trovata</h2>
              <p className={styles["nf-desc"]}>
                La risorsa richiesta o la rotta di navigazione non esiste o è
                stata spostata nell'architettura cloud.
              </p>
            </div>

            <div className={styles["nf-card"]}>
              <div className={styles["nf-card-head"]}>
                <div className={styles["nf-card-title"]}>Traccia Diagnostica</div>
                <div className={styles["nf-card-sub"]}>EDGE_ROUTER_FAILOVER</div>
              </div>

              <div className={styles["nf-terminal"]}>
                <div className={styles["nf-terminal-row"]}>
                  <span>Codice Errore:</span>
                  <span className={styles["nf-accent"]}>0x404_ROUTE_NOT_FOUND</span>
                </div>
                <hr className={styles["nf-sep"]} />
                <div className={`${styles["nf-terminal-row"]} ${styles["nf-terminal-row--start"]}`}>
                  <span>Path:</span>
                  <code>{pathname}</code>
                </div>
              </div>
            </div>

            <div className={styles["nf-actions"]}>
              <Link to="/" className={`${styles["nf-btn"]} ${styles["nf-btn--primary"]}`}>
                Torna alla Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
