
🚀 Guida all'Installazione e Configurazione Locale

Benvenuto in Business Assistant! Segui questa guida passo-passo per scaricare il progetto sul tuo computer, configurare il database e l'autenticazione con Supabase, e agganciare l'Intelligenza Artificiale tramite Groq.

📦 1. Clonazione del Progetto e Installazione

Apri il tuo terminale (Bash, PowerShell o Prompt dei Comandi), posizionati nella cartella in cui desideri salvare il progetto ed esegui i seguenti comandi:
bash
# 1. Clona il repository da GitHub (sostituisci con il link reale del tuo repository)
git clone https://github.com

# 2. Entra nella cartella del progetto
cd business-assistant

# 3. Installa tutte le dipendenze necessarie (React, Vite, Supabase SDK, jsPDF, ecc.)
npm install
Usa il codice con cautela.

🗄️ 2. Collegamento e Inizializzazione di Supabase

Per far funzionare l'autenticazione e la valutazione delle idee, devi collegare il progetto locale al tuo account Supabase Cloud.
1. Vai su Supabase ed effettua l'accesso.
2. Crea un nuovo progetto (New Project), scegli un nome (es. BusinessAssistant) e imposta una password sicura per il database.
3. Attendi un minuto che il database venga creato. Una volta pronto, copia il codice identificativo del progetto (Project ID / Project Ref). Lo trovi nella Dashboard web sotto Project Settings -> General.
Ora torna nel tuo terminale ed esegui i comandi per agganciare la CLI di Supabase:
bash
# 1. Effettua il login via terminale (aprirà una finestra del browser per darti il pass)
npx supabase login

# 2. Collega la tua cartella locale al progetto remoto (sostituisci "il-tuo-id-progetto" con l'ID reale)
npx supabase link --project-ref il-tuo-id-progetto
Usa il codice con cautela.

🔑 3. Configurazione delle Variabili del Frontend (.env)

Nella cartella principale (root) del progetto, crea un nuovo file e nominalo esattamente .env. Al suo interno devi incollare le chiavi pubbliche di Supabase che permettono all'app React di comunicare con il database:
env
VITE_SUPABASE_URL=https://supabase.co
VITE_SUPABASE_ANON_KEY=la-tua-chiave-anon-pubblica-che-trovi-su-supabase
Usa il codice con cautela.
(Puoi trovare queste due chiavi nella dashboard web di Supabase sotto Project Settings -> API).

🤖 4. Creazione Chiave Groq e Configurazione dei Secrets

Per agganciare l'Intelligenza Artificiale senza esporre la tua chiave segreta nel frontend, sfrutteremo le Edge Functions di Supabase collegate a Groq.
1. Vai su Groq Console e crea un account gratuito.
2. Vai nella sezione API Keys e clicca su Create API Key.
3. Scegli un nome e copia la chiave segreta generata (inizierà con gsk_).
Prima di configurare i server, torna sul tuo terminale ed esegui questa chiamata di test per assicurarti che la chiave funzioni correttamente e risponda con l'elenco dei modelli disponibili:
bash
# Sostituisci "la-tua-chiave-gsk" con la stringa reale copiata da Groq
curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer la-tua-chiave-gsk"
Usa il codice con cautela.
Se il comando risponde stampando a schermo un oggetto JSON con la lista dei modelli, la chiave è attiva. Ora puoi salvarla nei server blindati di Supabase (Secrets), in modo che la funzione di backend possa leggerla in totale sicurezza:
bash
# 1. Salva la chiave API di Groq nel cloud
npx supabase secrets set AI_API_KEY=la_tua_chiave_gsk_qui

# 2. Configura l'indirizzo endpoint ufficiale compatibile di Groq
npx supabase secrets set AI_BASE_URL=https://api.groq.com/openai/v1

# 3. Imposta il modello open-source ad alte prestazioni da utilizzare
npx supabase secrets set AI_MODEL=openai/gpt-oss-120b

# 4. Imposta il token speculare atteso dallo script del codice di backend
npx supabase secrets set GITHUB_TOKEN=la_tua_chiave_gsk_qui

# 5. (Opzionale) Controlla la lista per verificare che i 4 secret siano salvati correttamente
npx supabase secrets list
Usa il codice con cautela.

🚀 5. Deploy Finale della Edge Function

Ora che il server cloud possiede tutte le chiavi dell'AI, invia online il codice del tuo backend serverless (index.js) con questo comando:
bash
npx supabase functions deploy evaluate-idea --no-verify-jwt
Usa il codice con cautela.
Questo comando compila ed esegue il caricamento della funzione evaluate-idea nel cloud di Supabase. Al termine, l'endpoint sarà attivo globalmente.

🏁 6. Avvio dell'Applicazione in Locale

Tutti gli ingranaggi sono al loro posto! Ora puoi finalmente lanciare l'applicazione sul tuo computer:
bash
npm run dev
Usa il codice con cautela.
1. Apri l'indirizzo locale fornito da Vite nel browser (di solito http://localhost:5173).
2. Nella schermata iniziale, clicca su "Non hai un account? Registrati" per creare un nuovo profilo utente reale su Supabase Auth.
3. Controlla la tua casella email (anche nello spam) e clicca sul link di conferma per attivare l'account.
4. Effettua l'accesso inserendo Email e Password.
5. Verrai reindirizzato alla Dashboard. Scrivi un'idea imprenditoriale di almeno 30 caratteri, premi invio e guarda l'AI generare il punteggio e la matrice SWOT, con la possibilità di scaricare l'intero report testuale in formato PDF modificabile.
