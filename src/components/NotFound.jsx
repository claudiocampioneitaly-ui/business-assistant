import { useNavigate } from 'react-router';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-title">404</h1>

        <h2 className="not-found-subtitle">
          Pagina Non Trovata
        </h2>

        <p className="not-found-text">
          La risorsa o la pagina che stai cercando non esiste,
          è stata rimossa o l'indirizzo inserito non è corretto.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-not-found-back"
        >
          Torna alla Pagina Principale
        </button>
      </div>
    </div>
  );
}

export default NotFound;