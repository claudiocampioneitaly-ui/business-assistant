// Legge il tema salvato; se non c'è, usa la preferenza del sistema operativo
export const getInitialTheme = () => {
  // NUOVO: try/catch perché localStorage può essere bloccato (privacy, modalità privata) e lanciare un errore
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  } catch {
    // storage non disponibile: proseguiamo con la preferenza di sistema
  }
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemPrefersDark ? "dark" : "light";
};

// Applica il tema al documento e lo salva nel browser
export const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  // NUOVO: se il salvataggio fallisce, il tema funziona comunque per questa sessione
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignoriamo: non è un errore da mostrare all'utente
  }
};