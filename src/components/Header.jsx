// Importiamo la TUA istanza personalizzata usando il percorso relativo corretto
import { supabaseClient } from "../supabaseClient";
import styles from "./style/Header.module.css";

//Creare la Funzione Asincrona:

function Header({ theme, toggleTheme, session }) {
  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.error("Errore durante il logout:", error.message);
    }
  };

  return (
    <header className={styles["main-header"]}>
      <div className={styles["header-inner"]}>
        {/* Sezione Logo / Brand */}
        <div className={styles["header-logo"]}>
          <div className={styles["header-logo-icon"]}>
            <span className={styles["icon"]}>terminal</span>
          </div>
          <span className={styles["header-logo-name"]}>Business Assistant</span>
        </div>

        {/* Sezione Azioni (Pulsanti) */}
        <div className={styles["header-actions"]}>
          {/* Pulsante per il cambio tema (Light/Dark Mode) */}
          <button
            onClick={toggleTheme}
            className={styles["btn-theme"]}
            aria-label={
              theme === "light"
                ? "Passa alla modalità scura"
                : "Passa alla modalità chiara"
            }
          >
            <span className={styles["icon"]}>
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
          {/*         rendering condizionale e corrisponde a un'operazione logica che significa: "SE la sessione esiste, ALLORA mostra questo pulsante".
           */}{" "}
          {session && (
            <button onClick={handleLogout} className={styles["btn-logout"]}>
              <span>Logout</span>
              <span className={styles["icon"]}>logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
