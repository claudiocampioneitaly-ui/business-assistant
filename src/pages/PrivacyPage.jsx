import styles from "../style/PrivacyPage.module.css";

// =====================================================================
// DATI DA COMPLETARE: modifica SOLO queste costanti, il testo si aggiorna da solo
// =====================================================================

// Chi è il titolare del trattamento (persona, team o azienda responsabile dell'app)
const TITOLARE = "Blackout.SRL";

// Email a cui gli utenti scrivono per domande o per esercitare i loro diritti
const EMAIL_CONTATTO = "blackout19.10.2026@gmail.com";


// Regione del progetto Supabase (Dashboard Supabase → Project Settings → General)
// es. "Unione Europea (Francoforte, Germania)" oppure "Stati Uniti"
const REGIONE_SUPABASE = "Unione Europea"; 

// Servizio su cui è pubblicato il sito (es. "Vercel Inc.", "Netlify Inc.")
const HOSTING = "Render";

// true se in index.html i font/icone vengono caricati da fonts.googleapis.com,
// false se i font sono salvati dentro il progetto
const USA_GOOGLE_FONTS = true;

// Data dell'ultima modifica di questa informativa
const ULTIMO_AGGIORNAMENTO = "27 ottobre 2026";

// =====================================================================

function PrivacyPage() {
  return (
    <div className={styles["privacy-container"]}>
      <article className={styles["privacy-article"]}>
        <header className={styles["privacy-header"]}>
          <h1 className={styles["privacy-title"]}>Informativa sulla privacy</h1>
          <p className={styles["privacy-updated"]}>
            Ultimo aggiornamento: {ULTIMO_AGGIORNAMENTO}
          </p>
          <p className={styles["privacy-intro"]}>
            Questa pagina spiega quali dati raccoglie Business Assistant, perché
            li usa, con chi li condivide e quali diritti hai. È scritta ai sensi
            del Regolamento UE 2016/679 (GDPR) e del Codice privacy italiano
            (D.Lgs. 196/2003).
          </p>
        </header>

        {/* Avviso in evidenza: è l'informazione più importante per chi usa l'app */}
        <aside className={styles["privacy-callout"]} aria-label="Avviso importante">
          <p>
            <strong>Prima di descrivere la tua idea:</strong> il testo che
            inserisci viene inviato a un servizio di intelligenza artificiale
            esterno per generare la valutazione. Non inserire dati personali
            (tuoi o di altre persone), dati sanitari, credenziali o informazioni
            riservate che non vuoi condividere.
          </p>
        </aside>

        <section className={styles["privacy-section"]}>
          <h2>Chi è il titolare del trattamento</h2>
          <p>
            Il titolare del trattamento dei dati è {TITOLARE}. Per qualsiasi
            domanda su questa informativa o sui tuoi dati puoi scrivere a{" "}
            <a href={`mailto:${EMAIL_CONTATTO}`}>{EMAIL_CONTATTO}</a>.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Quali dati raccogliamo</h2>
          <ul>
            <li>
              <strong>Dati dell'account:</strong> il tuo indirizzo email e la
              password che scegli alla registrazione. La password non viene mai
              salvata in chiaro: il servizio di autenticazione ne conserva solo
              una versione cifrata (hash) che nessuno può rileggere. Vengono
              registrate anche la data di creazione dell'account e dell'ultimo
              accesso.
            </li>
            <li>
              <strong>Il testo della tua idea:</strong> la descrizione che
              inserisci nella Dashboard per ottenere la valutazione.
            </li>
            <li>
              <strong>Dati tecnici:</strong> come avviene per qualsiasi sito, i
              server dei nostri fornitori registrano automaticamente alcune
              informazioni sulle richieste, ad esempio indirizzo IP, data e ora,
              tipo di browser. Servono al funzionamento e alla sicurezza del
              servizio.
            </li>
            <li>
              <strong>Dati salvati nel tuo browser:</strong> la sessione di
              accesso e la preferenza del tema chiaro/scuro (vedi la sezione
              “Cookie e memoria del browser”).
            </li>
          </ul>
          <p>
            Non raccogliamo dati di pagamento e non usiamo strumenti di
            pubblicità o di profilazione.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Perché usiamo i tuoi dati</h2>
          <ul>
            <li>
              <strong>Creare e gestire il tuo account</strong> e permetterti di
              accedere. Base giuridica: esecuzione del servizio che hai
              richiesto (art. 6, par. 1, lett. b GDPR).
            </li>
            <li>
              <strong>Valutare la tua idea</strong> con l'intelligenza
              artificiale. Base giuridica: esecuzione del servizio che hai
              richiesto (art. 6, par. 1, lett. b GDPR).
            </li>
            <li>
              <strong>Proteggere il servizio</strong> da abusi, malfunzionamenti
              e accessi non autorizzati. Base giuridica: legittimo interesse a
              mantenere il servizio sicuro (art. 6, par. 1, lett. f GDPR).
            </li>
          </ul>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Come funziona la valutazione con l'intelligenza artificiale</h2>
          <p>
            Quando premi “Valuta Idea Imprenditoriale”, il testo della tua idea
            viene inviato al nostro server e da lì a Groq, il fornitore del
            modello di intelligenza artificiale, che restituisce la valutazione.
          </p>
          <p>
            Business Assistant non salva il testo delle idee né i risultati in un
            proprio database: la valutazione viene mostrata solo sullo schermo e
            il report PDF viene creato direttamente nel tuo browser. Il
            trattamento del testo da parte di Groq è regolato dalle sue
            condizioni e dalla sua{" "}
            <a
              href="https://groq.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              informativa privacy
            </a>
            .
          </p>
          <p>
            La valutazione è generata automaticamente: è una stima motivata, non
            una consulenza professionale, e non produce alcuna decisione che ti
            riguardi in modo vincolante.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Con chi condividiamo i dati</h2>
          <p>
            Non vendiamo e non cediamo i tuoi dati a terzi. Per far funzionare
            l'app ci affidiamo a questi fornitori, che trattano i dati per nostro
            conto:
          </p>
          <ul>
            <li>
              <strong>Supabase Inc.</strong>: autenticazione (account, email,
              password cifrata, sessioni) ed esecuzione del server che comunica
              con l'intelligenza artificiale. Regione del progetto:{" "}
              {REGIONE_SUPABASE}.
            </li>
            <li>
              <strong>Groq Inc.</strong> (Stati Uniti): elaborazione del testo
              dell'idea per generare la valutazione.
            </li>
            <li>
              <strong>{HOSTING}</strong>: pubblicazione del sito web.
            </li>
            {/* Mostrato solo se i font arrivano dai server di Google (vedi costante in alto) */}
            {USA_GOOGLE_FONTS && (
              <li>
                <strong>Google LLC</strong> (Google Fonts): fornitura dei
                caratteri e delle icone del sito. Per scaricarli, il tuo browser
                comunica a Google il tuo indirizzo IP.
              </li>
            )}
          </ul>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Trasferimento dei dati fuori dall'Unione Europea</h2>
          <p>
            Alcuni fornitori hanno sede negli Stati Uniti, quindi i dati possono
            essere trasferiti fuori dall'Unione Europea. Questi trasferimenti
            avvengono sulla base delle garanzie previste dagli articoli 44 e
            seguenti del GDPR, come le Clausole Contrattuali Standard approvate
            dalla Commissione Europea o il Data Privacy Framework UE-USA, ove
            applicabile.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Per quanto tempo conserviamo i dati</h2>
          <ul>
            <li>
              <strong>Dati dell'account:</strong> finché l'account resta attivo.
              Puoi chiederne la cancellazione in qualsiasi momento scrivendo a{" "}
              <a href={`mailto:${EMAIL_CONTATTO}`}>{EMAIL_CONTATTO}</a>.
            </li>
            <li>
              <strong>Testo delle idee:</strong> non viene conservato da
              Business Assistant. Eventuali copie temporanee presso Groq seguono
              le sue politiche di conservazione.
            </li>
            <li>
              <strong>Dati tecnici:</strong> per il tempo limitato previsto dai
              sistemi dei nostri fornitori.
            </li>
          </ul>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Cookie e memoria del browser</h2>
          <p>
            Business Assistant non usa cookie. Salva però due informazioni nella
            memoria locale del tuo browser (localStorage):
          </p>
          <ul>
            <li>
              <strong>La sessione di accesso</strong> (chiave che inizia con{" "}
              <code>sb-</code>): ti mantiene connesso tra una visita e l'altra.
              Viene eliminata quando fai logout.
            </li>
            <li>
              <strong>La preferenza del tema</strong> (chiave{" "}
              <code>theme</code>): contiene solo il valore “light” o “dark”.
            </li>
          </ul>
          <p>
            Sono strumenti tecnici, necessari a fornire il servizio che hai
            richiesto: per questo non serve il tuo consenso, come previsto dalle
            Linee guida del Garante privacy del 10 giugno 2021. Puoi cancellarli
            in qualsiasi momento dalle impostazioni del browser (cancellando i
            dati del sito); in quel caso dovrai accedere di nuovo e il tema
            tornerà a quello predefinito.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Come proteggiamo i dati</h2>
          <p>
            Le comunicazioni tra il tuo browser e i nostri servizi sono cifrate
            (HTTPS). Le password sono conservate solo in forma cifrata e la
            chiave di accesso al servizio di intelligenza artificiale resta sul
            server, mai nel sito. Nessun sistema è sicuro al 100%: ti
            consigliamo di usare una password che non usi su altri siti.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>I tuoi diritti</h2>
          <p>In qualsiasi momento puoi chiedere di:</p>
          <ul>
            <li>sapere quali dati abbiamo su di te e riceverne una copia;</li>
            <li>correggere dati sbagliati o incompleti;</li>
            <li>cancellare i tuoi dati e il tuo account;</li>
            <li>limitare il trattamento o opporti a esso;</li>
            <li>ricevere i tuoi dati in un formato leggibile (portabilità).</li>
          </ul>
          <p>
            Per esercitare questi diritti scrivi a{" "}
            <a href={`mailto:${EMAIL_CONTATTO}`}>{EMAIL_CONTATTO}</a>: ti
            risponderemo entro un mese. Se ritieni che i tuoi dati siano trattati
            in modo non corretto, puoi presentare reclamo al Garante per la
            protezione dei dati personali (
            <a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.garanteprivacy.it
            </a>
            ).
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Minori</h2>
          <p>
            Business Assistant è rivolto a persone maggiorenni. Se hai meno di 18
            anni, ti chiediamo di non registrarti.
          </p>
        </section>

        <section className={styles["privacy-section"]}>
          <h2>Modifiche a questa informativa</h2>
          <p>
            Potremmo aggiornare questa informativa se il servizio cambia. La data
            dell'ultima modifica è sempre indicata in cima alla pagina.
          </p>
        </section>
      </article>
    </div>
  );
}

export default PrivacyPage;