// Fase 1: Gestione del tema iniziale
export const getInitialTheme = () => {
  // Leggere il localStorage
  const savedTheme = localStorage.getItem('theme');

  // Verificare il tema salvato
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  // Interrogare il sistema operativo
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Restituire il valore di fallback
  return systemPrefersDark ? 'dark' : 'light';
};

// Fase 2: Applicazione del tema
export const applyTheme = (theme) => {
  // Controllare il parametro della stringa e gestire la classe dark
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // Salvare la scelta nel browser
  localStorage.setItem('theme', theme);
};