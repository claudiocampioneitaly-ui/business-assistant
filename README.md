# 🚀 Guida all'Installazione e Configurazione Locale

Benvenuto in **Business Assistant**! Segui questa guida passo-passo per scaricare il progetto sul tuo computer, configurare il database e l'autenticazione con **Supabase**, e agganciare l'Intelligenza Artificiale tramite **Groq**.

---

### 📦 Installazione Locale

Apri il tuo terminale (Bash, PowerShell o Prompt dei Comandi), posizionati nella cartella in cui desideri salvare il progetto ed esegui i seguenti comandi:

```bash
git clone https://github.com
cd business-assistant
npm install
```

---

### 🗄️ Inizializzazione di Supabase

Per far funzionare l'autenticazione e la valutazione delle idee, devi collegare il progetto locale al tuo account Supabase Cloud.

1. Vai su [Supabase](https://supabase.com) ed effettua l'accesso.
2. Crea un **nuovo progetto** (New Project), scegli un nome (es. *BusinessAssistant*) e imposta una password sicura per il database.
3. Attendi un minuto che il database venga creato. Una volta pronto, copia il codice identificativo del progetto (**Project ID / Project Ref**). Lo trovi nella Dashboard web sotto *Project Settings -> General*.

Ora torna nel tuo terminale ed esegui i comandi per agganciare la CLI di Supabase:

```bash
npx supabase login
npx supabase link --project-ref il-tuo-id-progetto
```

---

### 🔑 Configurazione delle Variabili del Frontend (.env)

Nella cartella principale (root) del progetto, crea un nuovo file e nominalo esattamente **`.env`**. Al suo interno devi incollare le chiavi pubbliche di Supabase che permettono all'app React di comunicare con il database:

```env
VITE_SUPABASE_URL=https://supabase.co
VITE_SUPABASE_ANON_KEY=la-tua-chiave-anon-pubblica-che-trovi-su-supabase
```
*(Puoi trovare queste due chiavi nella dashboard web di Supabase sotto Project Settings -> API).*

---

### 🤖 Creazione Chiave Groq e Configurazione dei Secrets

Per agganciare l'Intelligenza Artificiale senza esporre la tua chiave segreta nel frontend, sfrutteremo le **Edge Functions** di Supabase collegate a **Groq**.

1. Vai su [Groq Console](https://groq.com) e crea un account gratuito.
2. Vai nella sezione **API Keys** e clicca su **Create API Key**.
3. Scegli un nome e copia la chiave segreta generata (inizierà con `gsk_`).

Prima di configurare i server, torna sul tuo terminale ed esegui questa chiamata di test per assicurarti che la chiave funzioni correttamente e risponda con l'elenco dei modelli disponibili:

```bash
curl https://groq.com -H "Authorization: Bearer la-tua-chiave-gsk"
```

Se il comando risponde stampando a schermo un oggetto JSON con la lista dei modelli, la chiave è attiva. Ora puoi salvarla nei server blindati di Supabase (**Secrets**), in modo che la funzione di backend possa leggerla in totale sicurezza:

```bash
npx supabase secrets set AI_API_KEY=la_tua_chiave_gsk_qui
npx supabase secrets set AI_BASE_URL=https://groq.com
npx supabase secrets set AI_MODEL=openai/gpt-oss-120b
npx supabase secrets set GITHUB_TOKEN=la_tua_chiave_gsk_qui
npx supabase secrets list
```

---

### 🚀 Deploy Finale della Edge Function

Ora che il server cloud possiede tutte le chiavi dell'AI, invia online il codice del tuo backend serverless (`index.js`) con questo comando:

```bash
npx supabase functions deploy evaluate-idea --no-verify-jwt
```
Questo comando compila ed esegue il caricamento della funzione `evaluate-idea` nel cloud di Supabase. Al termine, l'endpoint sarà attivo globalmente.

---

### 🏁 Avvio dell'Applicazione in Locale

Tutti gli ingranaggi sono al loro posto! Ora puoi finalmente lanciare l'applicazione sul tuo computer:

```bash
npm run dev
```

1. Apri l'indirizzo locale fornito da Vite nel browser (di solito `http://localhost:5173`).
2. Nella schermata iniziale, clicca su *"Non hai un account? Registrati"* per creare un nuovo profilo utente reale su Supabase Auth.
3. Controlla la tua casella email (anche nello spam) e clicca sul link di conferma per attivare l'account.
4. Effettua l'accesso inserendo Email e Password.
5. Verrai reindirizzato alla **Dashboard**. Scrivi un'idea imprenditoriale di almeno 30 caratteri, premi invio e guarda l'AI generare il punteggio e la matrice SWOT, con la possibilità di scaricare l'intero report testuale in formato **PDF modificabile**.
