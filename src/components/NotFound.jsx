import React from 'react';

function NotFound({ onGoBack }) {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        {/* Codice di errore visivo principale */}
        <h1 className="not-found-title">404</h1>
        
        {/* Sottotitolo descrittivo */}
        <h2 className="not-found-subtitle">Pagina Non Trovata</h2>
        
        {/* Messaggio informativo in lingua italiana per l'utente */}
        <p className="not-found-text">
          La risorsa o la pagina che stai cercando non esiste, è stata rimossa o l'indirizzo inserito non è corretto.
        </p>
        
        {/* Pulsante di rientro condizionale: appare solo se viene passata la funzione onGoBack */}
        {onGoBack && (
          <button 
            type="button" 
            onClick={onGoBack} 
            className="btn-not-found-back"
          >
            Torna alla Pagina Principale
          </button>
        )}
      </div>
    </div>
  );
}

export default NotFound;