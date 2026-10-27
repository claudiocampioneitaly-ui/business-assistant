import { useRef } from "react"; // NUOVO
// Importiamo la TUA istanza personalizzata usando il percorso relativo corretto
import { supabaseClient } from "../lib/supabaseClient";
import styles from "../style/Header.module.css";

//Creare la Funzione Asincrona:

function Header({ theme, toggleTheme, session }) {
  // NUOVO: evita doppi click sul logout
  const logoutInCorsoRef = useRef(false);

  const handleLogout = async () => {
    if (logoutInCorsoRef.current) return; // NUOVO
    logoutInCorsoRef.current = true; // NUOVO
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      // NUOVO: il dettaglio tecnico solo in sviluppo, mai in produzione
      if (import.meta.env.DEV)
        console.error("Errore durante il logout:", error);
    } finally {
      logoutInCorsoRef.current = false; // NUOVO
    }
  };

  return (
    <header className={styles["main-header"]}>
      <div className={styles["header-inner"]}>
        {/* Sezione Logo / Brand */}
        <div className={styles["header-logo"]}>
        <div className={styles["header-logo-icon"]}>
            <a href="/" style={{textDecoration:"none"}}>
            <span className={styles["icon"]}>terminal</span>
          </a>
          </div>
          <a href="/" style={{textDecoration:"none"}}> <span className={styles["header-logo-name"]}>Business Assistant</span>
          </a>
        </div>

        {/* Sezione Azioni (Pulsanti) */}
        <div className={styles["header-actions"]}>
          {/* Pulsante per il cambio tema (Light/Dark Mode) */}
          {/* Pulsante per il cambio tema (Light/Dark Mode) */}
          {/* NUOVO: testo visibile (non solo icona); è anche il nome letto dallo screen reader */}
          <button
            type="button"
            onClick={toggleTheme}
            className={styles["btn-theme"]}
          >
            {/* NUOVO: aria-hidden, l'icona è decorativa (altrimenti verrebbe letto "dark_mode") */}
            <span className={styles["icon"]} aria-hidden="true">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
            <span>
              {theme === "light" ? "Attiva tema scuro" : "Attiva tema chiaro"}
            </span>
          </button>
          {/*         rendering condizionale e corrisponde a un'operazione logica che significa: "SE la sessione esiste, ALLORA mostra questo pulsante".
           */}{" "}
          {session && (
            <button onClick={handleLogout} className={styles["btn-logout"]}>
              <span>Logout</span>
              <span className={styles["icon"]} aria-hidden="true">
                logout
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
