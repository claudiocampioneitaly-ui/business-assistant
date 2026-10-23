// Edge Function "evaluate-idea"
// Riceve l'idea dal frontend, interroga un modello tramite un'API compatibile OpenAI
// (OpenAI, Groq, ecc.) e restituisce il JSON con la valutazione completa:
// sintesi dell'idea, 8 metriche, Business Success Score, SWOT, competitor,
// valutazione GO / NO GO e 3 suggerimenti operativi.
//
// Configurazione tramite secrets di Supabase (mai nel codice, mai nel frontend):
//   AI_API_KEY   -> obbligatoria: la chiave del provider
//   AI_BASE_URL  -> facoltativa, default OpenAI (https://api.openai.com/v1)
//   AI_MODEL     -> facoltativa, default gpt-4o-mini

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AI_BASE_URL = (
  Deno.env.get("AI_BASE_URL") ?? "https://api.openai.com/v1"
).replace(/\/+$/, "");
const AI_MODEL = Deno.env.get("AI_MODEL") ?? "gpt-4o-mini";
const AI_API_KEY = Deno.env.get("AI_API_KEY");

const MIN_LENGTH = 30; // uguale al minLength della textarea nella Dashboard
const MAX_LENGTH = 4000; // evita richieste enormi che consumano token

// Soglia del Business Success Score sotto la quale l'esito di riserva è "NO GO"
// (usata solo se il modello non restituisce un esito valido)
const SOGLIA_GO = 60;

// Le 8 metriche richieste dal progetto.
// Titolo e ordine li decide il SERVER: il modello restituisce solo valore e motivazione,
// così il frontend riceve sempre le stesse 8 voci, con gli stessi nomi, nello stesso ordine.
const METRICHE = [
  {
    chiave: "fattibilita_tecnica",
    titolo: "Fattibilità tecnica",
    descrizione:
      "realizzabilità con tecnologie, competenze e risorse plausibili",
  },
  {
    chiave: "potenziale_mercato",
    titolo: "Potenziale di mercato",
    descrizione:
      "ampiezza e attrattività dell'opportunità, con incertezza esplicita",
  },
  {
    chiave: "sostenibilita_economica",
    titolo: "Sostenibilità economica",
    descrizione: "possibile equilibrio tra costi, ricavi e margini",
  },
  {
    chiave: "competitivita",
    titolo: "Competitività",
    descrizione: "possibilità di differenziarsi rispetto alle alternative",
  },
  {
    chiave: "scalabilita",
    titolo: "Scalabilità",
    descrizione: "capacità di crescere senza costi proporzionali eccessivi",
  },
  {
    chiave: "domanda_potenziale",
    titolo: "Domanda potenziale",
    descrizione: "probabilità che esista un bisogno concreto da validare",
  },
  {
    chiave: "velocita_lancio",
    titolo: "Velocità di lancio",
    descrizione: "semplicità di creare e testare un MVP",
  },
  {
    chiave: "innovazione",
    titolo: "Innovazione",
    descrizione: "originalità e utilità dell'approccio",
  },
];

// Lo schema va descritto al modello: le chiavi devono combaciare con quelle lette dalla Dashboard.
// Il blocco "metriche" viene generato dall'array METRICHE, così prompt e normalizzazione non si disallineano.
const SYSTEM_PROMPT = `Sei un analista di business esperto e obiettivo che valuta idee imprenditoriali.
Rispondi SOLO con un oggetto JSON valido, senza testo prima o dopo, con esattamente queste chiavi:
{
  "sintesi_idea": stringa di 2-3 frasi che rielabora in modo sintetico l'idea dell'utente (cosa propone, a chi si rivolge, come funziona),
  "metriche": {
${METRICHE.map(
  (m) =>
    `    "${m.chiave}": { "valore": intero da 0 a 100, "motivazione": stringa di 1-2 frasi }   (${m.titolo}: ${m.descrizione})`,
).join(",\n")}
  },
  "swot": {
    "punti_forza": array di 2-5 stringhe,
    "debolezze": array di 2-5 stringhe,
    "opportunita": array di 2-5 stringhe,
    "minacce": array di 2-5 stringhe
  },
  "competitor": array di massimo 3 oggetti { "nome": stringa, "attivita": stringa con l'attività principale, "punto_debole": stringa con un possibile punto debole },
  "valutazione_finale": { "esito": "GO" oppure "NO GO", "spiegazione": stringa di 2-3 frasi },
  "suggerimenti": array di esattamente 3 stringhe
}
Regole:
- Scrivi in italiano.
- Valuta ogni metrica in modo indipendente e realistico, senza gonfiare i punteggi.
- Nella motivazione del potenziale di mercato rendi esplicita l'incertezza della stima.
- Competitor: indica solo aziende o prodotti realmente esistenti a tua conoscenza e pertinenti all'idea. Se non ne conosci, restituisci un array vuoto. Non inventare URL, fatturati, quote di mercato o altri dati economici: verranno comunque mostrati come "da verificare".
- Esito "GO" solo se la media delle 8 metriche è almeno ${SOGLIA_GO} e non ci sono criticità bloccanti; altrimenti "NO GO". La spiegazione deve essere coerente con le metriche.
- Suggerimenti: 3 azioni operative concrete per validare o migliorare l'idea (ad esempio interviste a potenziali clienti, landing page di test, prototipo), legate alle metriche più deboli.
- Se l'idea è vaga o incompleta, assegna punteggi bassi e spiega nella sintesi e nella valutazione finale cosa manca.`;

// Risposta JSON con gli header CORS
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Garantisce che il frontend riceva sempre la forma attesa, anche se il modello sbaglia qualcosa
function normalizzaRisultato(raw) {
  const lista = (v) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);
  const testo = (v) => (typeof v === "string" ? v.trim() : "");
  const limita = (n) => Math.min(100, Math.max(0, n));

  // 1. Metriche: titolo dal server, valore e motivazione dal modello.
  // Se ne manca una, meglio far fallire la richiesta (il frontend mostra "riprova")
  // piuttosto che inserire uno 0 finto che abbasserebbe la media.
  const metricheRaw = raw.metriche ?? {};
  const metriche = METRICHE.map(({ chiave, titolo }) => {
    // "?? NaN" evita che null diventi 0 con Number(null)
    const valore = Math.round(Number(metricheRaw[chiave]?.valore ?? NaN));
    if (!Number.isFinite(valore)) {
      throw new Error(`Metrica mancante o non numerica: ${chiave}`);
    }
    return {
      chiave,
      titolo,
      valore: limita(valore),
      motivazione: testo(metricheRaw[chiave]?.motivazione),
    };
  });

  // 2. Business Success Score: media delle 8 metriche, calcolata qui e NON chiesta al modello
  const businessSuccessScore = Math.round(
    metriche.reduce((somma, m) => somma + m.valore, 0) / metriche.length,
  );

  // 3. SWOT
  const swot = raw.swot ?? {};

  // 4. Competitor: massimo 3, sempre marcati come non verificati
  // (la risposta del modello non è una ricerca aggiornata)
  const competitor = (Array.isArray(raw.competitor) ? raw.competitor : [])
    .filter((c) => c && testo(c.nome))
    .slice(0, 3)
    .map((c) => ({
      nome: testo(c.nome),
      attivita: testo(c.attivita),
      punto_debole: testo(c.punto_debole),
      verificato: false,
    }));

  // 5. Esito GO / NO GO: accetta solo i due valori previsti,
  // altrimenti lo ricava dal punteggio
  const esitoModello = testo(raw.valutazione_finale?.esito)
    .toUpperCase()
    .replace(/[-_]/g, " ");
  const esito =
    esitoModello === "GO" || esitoModello === "NO GO"
      ? esitoModello
      : businessSuccessScore >= SOGLIA_GO
        ? "GO"
        : "NO GO";

  return {
    sintesi_idea: testo(raw.sintesi_idea),
    metriche,
    business_success_score: businessSuccessScore,
    swot: {
      punti_forza: lista(swot.punti_forza),
      debolezze: lista(swot.debolezze),
      opportunita: lista(swot.opportunita),
      minacce: lista(swot.minacce),
    },
    competitor,
    valutazione_finale: {
      esito,
      spiegazione: testo(raw.valutazione_finale?.spiegazione),
    },
    suggerimenti: lista(raw.suggerimenti).slice(0, 3),
  };
}

Deno.serve(async (req) => {
  // Preflight CORS del browser
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo non consentito." }, 405);
  }

  if (!AI_API_KEY) {
    console.error("Secret AI_API_KEY mancante");
    return jsonResponse({ error: "Servizio AI non configurato." }, 500);
  }

  // 1. Validazione dell'input
  let idea;
  try {
    ({ idea } = await req.json());
  } catch {
    return jsonResponse({ error: "Corpo della richiesta non valido." }, 400);
  }

  idea = typeof idea === "string" ? idea.trim() : "";
  if (idea.length < MIN_LENGTH) {
    return jsonResponse(
      { error: `Descrivi l'idea con almeno ${MIN_LENGTH} caratteri.` },
      400,
    );
  }
  if (idea.length > MAX_LENGTH) {
    return jsonResponse(
      { error: `L'idea può essere lunga al massimo ${MAX_LENGTH} caratteri.` },
      400,
    );
  }

  // 2. Chiamata al provider (formato Chat Completions di OpenAI)
  let response;
  try {
    response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Valuta questa idea imprenditoriale e restituisci solo il JSON:\n\n${idea}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3, // valori bassi = valutazioni più stabili tra una richiesta e l'altra
      }),
      signal: AbortSignal.timeout(30_000), // non lasciare l'utente in attesa all'infinito
    });
  } catch (err) {
    console.error("Errore di rete verso il provider AI:", err);
    return jsonResponse(
      { error: "Il servizio AI non risponde, riprova tra poco." },
      504,
    );
  }

  if (!response.ok) {
    // I dettagli finiscono nei log della funzione (dashboard Supabase), non al browser
    console.error(
      `Provider AI ha risposto ${response.status}:`,
      await response.text(),
    );
    if (response.status === 429) {
      return jsonResponse(
        {
          error: "Limite di richieste raggiunto, riprova tra qualche secondo.",
        },
        429,
      );
    }
    return jsonResponse(
      { error: `Errore dal servizio AI (HTTP ${response.status}).` },
      502,
    );
  }

  // 3. Estrazione e parsing della risposta
  // (anche gli errori lanciati da normalizzaRisultato, es. metrica mancante, finiscono qui)
  try {
    const aiData = await response.json();
    const contentText = aiData.choices?.[0]?.message?.content ?? ""; // choices è un array
    const pulito = contentText.replace(/```json|```/g, "").trim(); // alcuni modelli aggiungono i backtick
    return jsonResponse(normalizzaRisultato(JSON.parse(pulito)));
  } catch (err) {
    console.error("Risposta del modello non interpretabile:", err);
    return jsonResponse(
      { error: "La risposta dell'AI non è in un formato valido, riprova." },
      502,
    );
  }
});
