// Importiamo la TUA istanza personalizzata usando il percorso relativo corretto
import { supabaseClient } from "../supabaseClient";

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
    <header className="main-header">
      {/* Sezione Logo / Brand */}
      <div className="header-logo">
        <span>💼 Business Assistant</span>
      </div>

      {/* Sezione Azioni (Pulsanti) */}
      <div className="header-actions">
        {/* Pulsante per il cambio tema (Light/Dark Mode) */}
        <button onClick={toggleTheme} className="btn-theme">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
        {/*         rendering condizionale e corrisponde a un'operazione logica che significa: "SE la sessione esiste, ALLORA mostra questo pulsante".
         */}{" "}
        {session && (
          <button onClick={handleLogout} className="btn-logout">
            Disconnetti
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
