import { Link, useLocation } from "react-router";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <main className="nf-main-container">
      {/* SPOSTATO QUI: Ora fa da sfondo globale solo al tag main e non può superarlo */}
      <div className="nf-backdrop" aria-hidden="true">
        <div className=" nf-glow--top" />
        <div className="nf-grid" />
      </div>

      <div className="nf-page">
        <div className="nf-viewport-content">
          <div className="nf-shell">
            
            <div className="nf-status">
              <span className="nf-dot">
                <span className="nf-dot-ping" />
                <span className="nf-dot-core" />
              </span>
              <span className="nf-status-text">ERR_HTTP_404 • ROTTA NON VALIDA</span>
            </div>

            <div className="nf-hero">
              <h1 className="nf-code">404</h1>
              <h2 className="nf-title">Pagina non trovata</h2>
              <p className="nf-desc">
                La risorsa richiesta o la rotta di navigazione non esiste o è
                stata spostata nell'architettura cloud.
              </p>
            </div>

            <div className="nf-card">
              <div className="nf-card-head">
                <div className="nf-card-title">Traccia Diagnostica</div>
                <div className="nf-card-sub">EDGE_ROUTER_FAILOVER</div>
              </div>

              <div className="nf-terminal">
                <div className="nf-terminal-row">
                  <span>Codice Errore:</span>
                  <span className="nf-accent">0x404_ROUTE_NOT_FOUND</span>
                </div>
                <hr className="nf-sep" />
                <div className="nf-terminal-row nf-terminal-row--start">
                  <span>Path:</span>
                  <code>{pathname}</code>
                </div>
              </div>
            </div>

            <div className="nf-actions">
              <Link to="/" className="nf-btn nf-btn--primary">
                Torna alla Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
