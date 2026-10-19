import React, { useState, useEffect } from 'react'; // Importa React e gli Hook principali per stato ed effetti colaterali
import { useAuth } from './Hooks/useAuth'; // Importa il Custom Hook per accedere allo stato di autenticazione dell'utente
import { getInitialTheme, applyTheme } from './utils/themeHelper'; // Importa le funzioni helper per leggere e applicare il tema (Light/Dark)
import Header from './components/Header'; // Importa il componente della barra di intestazione superiore
import Auth from './components/Auth'; // Importa il componente per Login e Registrazione
import Dashboard from './components/Dashboard'; // Importa il componente della Dashboard principale dell'app


function App() {
  // Inizializza lo stato 'theme' recuperando la preferenza salvata (o quella di sistema) tramite getInitialTheme
  const [theme, setTheme] = useState(getInitialTheme);

  // Esegue applyTheme(theme) ogni volta che lo stato 'theme' cambia, per aggiornare le classi/stili nell'HTML
  useEffect(() => { applyTheme(theme) }, [theme]);

  // Funzione per alternare il tema: se è "light" diventa "dark", altrimenti "light"
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Richiede i dati della sessione e lo stato di caricamento dell'autenticazione dal Custom Hook
  const { session, loading } = useAuth();

  
  // Se l'app sta ancora verificando se l'utente è loggato, mostra una schermata temporanea di caricamento
  if (loading) {
    return (<div> <p>Caricamento in corso...</p></div>);
  }

  return (
    <>
      {/* Intestazione dell'app a cui passiamo il tema attuale, la funzione per cambiarlo e i dati della sessione */}
      <Header theme={theme} toggleTheme={toggleTheme} session={session}>         
      </Header>
       
      <main>
        {/* Operatore ternario: se NON c'è una sessione attiva mostra <Auth/>, altrimenti mostra <Dashboard/> */}
        {!session ? (<Auth/>) : (<Dashboard session={session} />)}  
      </main>

    </>
  )
}

export default App // Esporta il componente App per farlo renderizzare da React