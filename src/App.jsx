import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { getInitialTheme, applyTheme } from "./utils/themeHelper";
import Header from "./components/Header";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";

function App() {
  // 1. Gestione Modulo Tema
  const [theme, setTheme] = useState(getInitialTheme);

  // Sincronizza lo stato con il DOM ad ogni cambio tema
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Funzione per invertire il tema (Light <-> Dark)
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 2. Gestione Modulo Autenticazione (Custom Hook)
  const { session, loading } = useAuth();

  const [authVisualLoading, setAuthVisualLoading] = useState(false);

  // STATO DI NAVIGAZIONE INTERNA: Se diventa 'true', l'app mostrerà la pagina 404
  const [isPageNotFound, setIsPageNotFound] = useState(false);

  useEffect(() => {
    if (session) {
      setAuthVisualLoading(true);

      const timer = setTimeout(() => {
        setAuthVisualLoading(false);
      }, 1000); // 1000 millisecondi tassativi

      return () => clearTimeout(timer);
    }
  }, [session]);

  // Schermata di blocco durante il controllo iniziale del token o del refresh
  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  // NUOVO BLOCCO CONDIZIONALE: Mostra lo spinner ed impedisce l'accesso immediato alla Dashboard
  if (authVisualLoading) {
    return (
      <div className="app-loader-wrapper" style={{ padding: "4rem 2rem" }}>
        <Loader />
      </div>
    );
  }

  // NUOVO CONTROLLO: SE LO STATO NOT FOUND È ATTIVO
  // Intercetta la pagina e stampa il modulo 404 a schermo intero
  if (isPageNotFound) {
    return (
      <>
        <Header theme={theme} toggleTheme={toggleTheme} session={session} />
        <main>
          {/* Passiamo la funzione onGoBack per azzerare lo stato e tornare alla schermata corretta */}
          <NotFound onGoBack={() => setIsPageNotFound(false)} />
        </main>
      </>
    );
  }

  // 3. Routing Condizionale e Render
  return (
    <>
      {/* L'header globale riceve lo stato del tema e della sessione per regolare i pulsanti */}
      <Header theme={theme} toggleTheme={toggleTheme} session={session} />

      <main>
        {!session ? (
          // Se la sessione è null, l'utente visualizza SOLO il modulo di login/registrazione
          <Auth />
        ) : (
          // Se la sessione è valida, l'utente accede alla dashboard protetta
          <Dashboard session={session} />
        )}
      </main>
    </>
  );
}

export default App;
