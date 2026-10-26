import React, { useState } from "react";
// Importiamo l'istanza personalizzata che fa da ponte con il nostro backend Supabase
import { supabaseClient } from "../supabaseClient";
// Stile della schermata di accesso/registrazione: tutte le classi hanno il prefisso "auth-"
// così non entrano in conflitto con quelle della Dashboard (.form-group, .error-message, ...)
// CSS Module: le classi di Auth.module.css valgono SOLO qui (Vite le rinomina con un hash unico)
import styles from "./style/Auth.module.css";

function Auth() {
  // 1. DICHIARAZIONE DEGLI STATI (La memoria a breve termine del componente)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  // true = la password si vede in chiaro, false = è nascosta con i pallini
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // 2. LOGICA DI INVIO DEI DATI A SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Blocca il comportamento nativo del browser
    setError(""); // Resetta i vecchi errori
    setSuccessMessage(""); // Resetta i vecchi messaggi di successo
    setLoadingSubmit(true); // Congela l'interfaccia

    try {
      if (isRegistering) {
        // --- CASO REGISTRAZIONE ---
        const { error: authError } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
        });
        if (authError) throw authError;
        setSuccessMessage(
          "Registrazione completata! Controlla la tua email per confermare l'account.",
        );
      } else {
        // --- CASO LOGIN ---
        const { error: authError } =
          await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
          });
        if (authError) throw authError;
      }
    } catch (err) {
      // --- GESTIONE DEGLI ERRORI ---
      setError(
        err.message || "Si è verificato un errore durante l'autenticazione.",
      );
    } finally {
      // --- RIPRISTINO INTERFACCIA ---
      setLoadingSubmit(false);
    }
  };

  // Cambia vista tra login e registrazione: la usano sia i due bottoni in alto sia il link in fondo.
  // Ripulisce anche i messaggi, così un errore del login non resta visibile nella registrazione.
  const cambiaVista = (registrazione) => {
    setIsRegistering(registrazione);
    setError("");
    setSuccessMessage("");
  };

  // Password visibility toggle
  // In React non si modifica il DOM a mano (input.type, icon.innerText):
  // si cambia lo stato e il JSX sotto sceglie type e icona in base al suo valore.
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((visibile) => !visibile);
  };

  // 3. INTERFACCIA GRAFICA (Cosa vede l'utente)
  return (
    <div className={styles["auth-container"]}>
      <form onSubmit={handleSubmit} className={styles["auth-form"]}>
        {/* SELETTORE LOGIN / REGISTRAZIONE: la pillola verde scorre sotto il bottone attivo */}
        <div
          className={`${styles["auth-tabs"]} ${isRegistering ? styles["auth-tabs--register"] : ""}`}
          role="group"
          aria-label="Scegli tra accesso e registrazione"
        >
          <button
            type="button"
            onClick={() => cambiaVista(false)}
            disabled={loadingSubmit}
            aria-pressed={!isRegistering}
            className={`${styles["auth-tab"]} ${!isRegistering ? styles["auth-tab--active"] : ""}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => cambiaVista(true)}
            disabled={loadingSubmit}
            aria-pressed={isRegistering}
            className={`${styles["auth-tab"]} ${isRegistering ? styles["auth-tab--active"] : ""}`}
          >
            Registrazione
          </button>
        </div>

        {/* key: cambiando tra login e registrazione il titolo viene rimontato e l'animazione riparte */}
        <h2
          key={isRegistering ? "registrazione" : "login"}
          className={styles["auth-title"]}
        >
          {isRegistering ? "Crea un account" : "Accedi a Business Assistant"}
        </h2>

        <div className={styles["auth-form-group"]}>
          {/* htmlFor + id collegano la label all'input: cliccando la label si attiva il campo */}
          <label htmlFor="auth-email" className={styles["auth-label"]}>
            Email
          </label>
          {/* Stesso contenitore del campo password: l'icona è posizionata sopra l'input */}
          <div className={styles["auth-input-wrapper"]}>
            {/* aria-hidden: l'icona è solo decorativa, lo screen reader la salta */}
            <span
              className={`material-symbols-outlined ${styles["auth-input-icon"]}`}
              aria-hidden="true"
            >
              mail
            </span>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.it"
              disabled={loadingSubmit}
              required
              className={`${styles["auth-input"]} ${styles["auth-input--with-icon-left"]}`}
            />
          </div>
        </div>

        <div className={styles["auth-form-group"]}>
          <label htmlFor="auth-password" className={styles["auth-label"]}>
            Password
          </label>
          {/* Contenitore relativo: lucchetto e bottone "occhio" sono posizionati sopra l'input */}
          <div className={styles["auth-input-wrapper"]}>
            {/* aria-hidden: l'icona è solo decorativa, lo screen reader la salta */}
            <span
              className={`material-symbols-outlined ${styles["auth-input-icon"]}`}
              aria-hidden="true"
            >
              lock
            </span>
            <input
              id="auth-password"
              // Il type dipende dallo stato: "text" mostra la password, "password" la nasconde
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loadingSubmit}
              required
              className={`${styles["auth-input"]} ${styles["auth-input--with-icons"]}`}
            />
            {/* type="button": senza, il click invierebbe il form */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={loadingSubmit}
              aria-label={
                isPasswordVisible
                  ? "Nascondi la password"
                  : "Mostra la password"
              }
              className={styles["auth-password-toggle"]}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {isPasswordVisible ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* key: un errore diverso rimonta il messaggio e fa ripartire l'animazione "shake" */}
        {/* role="alert" / "status": gli screen reader leggono il messaggio appena compare */}
        {error && (
          <p key={error} className={styles["auth-error-message"]} role="alert">
            {error}
          </p>
        )}
        {successMessage && (
          <p className={styles["auth-success-message"]} role="status">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loadingSubmit}
          className={styles["auth-btn-submit"]}
        >
          {loadingSubmit
            ? "Attendere..."
            : isRegistering
              ? "Registrati"
              : "Accedi"}
        </button>

        <button
          type="button"
          onClick={() => cambiaVista(!isRegistering)}
          disabled={loadingSubmit}
          className={styles["auth-btn-toggle"]}
        >
          {isRegistering
            ? "Hai già un account? Accedi"
            : "Non hai un account? Registrati"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
