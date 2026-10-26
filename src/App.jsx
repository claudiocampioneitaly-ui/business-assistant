import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import { useAuth } from "./hooks/useAuth";
import { getInitialTheme, applyTheme } from "./utils/themeHelper";

import Header from "./components/Header";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Loader from "./components/Loader";
import NotFound from "./components/NotFoundPage";

// HOME: Gestisce la schermata iniziale in base allo stato di autenticazione
function HomeRoute({ session }) {
  // Se l'utente è già autenticato, lo reindirizziamo alla Dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se la sessione è null, l'utente visualizza il modulo di login/registrazione
  return <Auth />;
}

// ROTTA PROTETTA: Impedisce l'accesso alla Dashboard agli utenti non autenticati
function ProtectedRoute({ session }) {
  // Se la sessione è assente, reindirizziamo l'utente alla Home
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Se la sessione è valida, l'utente accede alla Dashboard protetta
  return <Dashboard session={session} />;
}

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

  // Gestione del caricamento visivo dopo l'autenticazione
  // Gestione del caricamento visivo dopo l'autenticazione
  // Dipende dall'id dell'utente e non dall'oggetto session: Supabase crea una nuova session
  // a ogni rinnovo del token, e senza questo accorgimento il Loader ripartirebbe
  // smontando la Dashboard (con perdita del risultato dell'analisi)
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      setAuthVisualLoading(true);

      const timer = setTimeout(() => {
        setAuthVisualLoading(false);
      }, 1000);

      // 1000 millisecondi tassativi
      return () => clearTimeout(timer);
    }

    // Se non c'è una sessione, disattiviamo il caricamento visivo
    setAuthVisualLoading(false);
  }, [userId]);

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

  // Mostra lo spinner e impedisce l'accesso immediato alla Dashboard
  if (authVisualLoading) {
    return (
      <div className="app-loader-wrapper" style={{ padding: "4rem 2rem" }}>
        <Loader />
      </div>
    );
  }

  // 3. Routing con React Router
  return (
    <>
      {/* L'header globale riceve lo stato del tema e della sessione per regolare i pulsanti */}
      <Header theme={theme} toggleTheme={toggleTheme} session={session} />

      <main>
        <Routes>
          {/* Home: login/registrazione oppure reindirizzamento alla Dashboard */}
          <Route path="/" element={<HomeRoute session={session} />} />

          {/* Dashboard: accessibile soltanto con una sessione valida */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute session={session} />}
          />

          {/* Rotta jolly: intercetta tutti gli URL non definiti e mostra la pagina 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
