import { useRef } from "react"; // NUOVO
// Importiamo la TUA istanza personalizzata usando il percorso relativo corretto
import { supabaseClient } from "../lib/supabaseClient";
import styles from "../style/Header.module.css";

//Creare la Funzione Asincrona:

function Header({ theme, toggleTheme, session }) {
  // useRef crea un "contenitore" (.current) che sopravvive ai re-render
  // e, quando cambia, NON provoca un nuovo render (a differenza di useState).
  // Qui funziona da semaforo: true = logout già in corso.
  const logoutInCorsoRef = useRef(false);

  const handleLogout = async () => {
    // Se un logout è già partito, esci subito: ignora i click successivi
    if (logoutInCorsoRef.current) return;
    // Abbassa il semaforo: da ora i nuovi click vengono bloccati
    logoutInCorsoRef.current = true;
    try {
      // Chiede a Supabase di chiudere la sessione (cancella il token salvato)
      await supabaseClient.auth.signOut();
    } catch (error) {
      // import.meta.env.DEV è true solo con "npm run dev" (sviluppo), false nella build:
      // così il dettaglio tecnico dell'errore non compare nella console in produzione
      if (import.meta.env.DEV)
        console.error("Errore durante il logout:", error);
    } finally {
      // Eseguito sempre, con successo o errore: riapre il semaforo
      // così, se il logout è fallito, l'utente può riprovare
      logoutInCorsoRef.current = false;
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
