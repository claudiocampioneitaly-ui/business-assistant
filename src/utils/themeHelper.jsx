export const getInitialTheme = () => { 
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme ==="dark" || savedTheme ==="light")
        return savedTheme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';   
 };
 
export const applyTheme = (theme) => { 
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    localStorage.setItem('theme', theme);
};
    

    
    
  