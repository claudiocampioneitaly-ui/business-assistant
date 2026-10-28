import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./Hooks/useAuth";
import { getInitialTheme, applyTheme } from "./utils/themeHelper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import NotFound from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import DocumentationPage from "./pages/DocumentationPage";
import ProtectedRoute from "./components/ProtectedRoute";

// HOME: Gestisce la schermata iniziale in base allo stato di autenticazione
function HomeRoute({ session }) {
  // Se l'utente è già autenticato, lo reindirizziamo alla Dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se la sessione è null, l'utente visualizza il modulo di login/registrazione
  return <Auth />;
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

  // 3. Routing con React Router
  return (
    <>
      {/* L'header globale riceve lo stato del tema e della sessione per regolare i pulsanti */}
      <Header theme={theme} toggleTheme={toggleTheme} session={session} />

      <main>
        <Routes>
          {/* Home: login/registrazione oppure reindirizzamento alla Dashboard */}
          <Route path="/" element={<HomeRoute session={session} />} />

          {/* Rotte protette: accessibili soltanto con una sessione valida.
              Per proteggere una nuova pagina basta aggiungerla qui dentro. */}
          <Route element={<ProtectedRoute session={session} />}>
            <Route path="/dashboard" element={<Dashboard session={session} />} />
          </Route>

          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/documentazione" element={<DocumentationPage theme={theme} />} />
          {/* Rotta jolly: intercetta tutti gli URL non definiti e mostra la pagina 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer/>

      
    </>
  );
}

export default App;
