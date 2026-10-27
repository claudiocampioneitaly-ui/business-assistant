// 1. Importa la funzione ufficiale di Supabase necessaria a inizializzare il collegamento
import { createClient } from '@supabase/supabase-js';

// 2. Recupera l'URL unico del tuo backend Supabase dalle variabili d'ambiente (configurate nel file .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// 3. Recupera la chiave pubblica di sicurezza (Anon Key) sempre dal file .env per autenticare le richieste
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 4. Inizializza il client di Supabase unendo l'URL e la Chiave del tuo progetto specifico.
// Usando 'export const', rendi questa istanza (chiamata supabaseClient) disponibile
// per essere importata e usata in qualsiasi altro file dell'app (es. Header.jsx, Auth.jsx).
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
