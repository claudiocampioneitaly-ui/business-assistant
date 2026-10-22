import React, { useState } from 'react';
// Importiamo l'istanza personalizzata che fa da ponte con il nostro backend Supabase
import { supabaseClient } from '../supabaseClient';

function Auth() {
  // 1. DICHIARAZIONE DEGLI STATI (La memoria a breve termine del componente)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // 2. LOGICA DI INVIO DEI DATI A SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Blocca il comportamento nativo del browser
    setError(''); // Resetta i vecchi errori
    setSuccessMessage(''); // Resetta i vecchi messaggi di successo
    setLoadingSubmit(true); // Congela l'interfaccia

    try {
      if (isRegistering) {
        // --- CASO REGISTRAZIONE ---
        const { error: authError } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
        });
        if (authError) throw authError;
        setSuccessMessage('Registrazione completata! Controlla la tua email per confermare l\'account.');
      } else {
        // --- CASO LOGIN ---
        const { error: authError } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (authError) throw authError;
      }
    } catch (err) {
      // --- GESTIONE DEGLI ERRORI ---
      setError(err.message || 'Si è verificato un errore durante l\'autenticazione.');
    } finally {
      // --- RIPRISTINO INTERFACCIA ---
      setLoadingSubmit(false);
    }
  };

  // 3. INTERFACCIA GRAFICA (Cosa vede l'utente)
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isRegistering ? 'Crea un account' : 'Accedi a Business Assistant'}</h2>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loadingSubmit}
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loadingSubmit}
            required 
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" disabled={loadingSubmit} className="btn-submit">
          {loadingSubmit ? 'Attendere...' : (isRegistering ? 'Registrati' : 'Accedi')}
        </button>

        <button 
          type="button" 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="btn-toggle-view"
        >
          {isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </button>
      </form>
    </div>
  );
}

export default Auth;