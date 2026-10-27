import { useState, useEffect } from 'react';
// Importiamo l'istanza personalizzata che hai configurato in src/supabaseClient.js
import { supabaseClient } from '../lib/supabaseClient';

export function useAuth() {
  // Stato per memorizzare i dati dell'utente autenticato (o null se disconnesso)
  const [session, setSession] = useState(null);

  // Stato di caricamento per bloccare l'interfaccia durante il controllo iniziale del token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Recupera la sessione attiva al caricamento (gestisce il refresh della pagina)
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Ascolta i cambiamenti di stato in tempo reale (Login, Logout, Scadenza Sessione)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

// 3. Funzione di pulizia (cleanup) per distruggere il listener quando l'hook non serve più
    return () => {
      subscription.unsubscribe(); // distruggere il listener quando l'hook non serve più
      //questa funzione è definita 'cleanup' ed è fondamentale per evitare memory leak
      //in pratica, impedisce al listener di continuare ad ascoltare eventi anche dopo che il componente è stato rimosso dalla pagina
      
    };
  }, []);

  return { session, loading };// Esportiamo l'oggetto con i dati aggiornati per poterli usare in App.jsx. Session è un oggetto che contiene i dati dell'utente autenticato o null se disconnesso, mentre loading è un valore booleano che indica se l'hook sta caricando i dati

}

    
