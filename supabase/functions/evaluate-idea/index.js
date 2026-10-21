// Edge Function "evaluate-idea"
// Riceve l'idea dal frontend, interroga un modello tramite un'API compatibile OpenAI
// (OpenAI, Groq, ecc.) e restituisce il JSON con la valutazione SWOT.
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

// Lo schema va descritto al modello: le chiavi devono combaciare con quelle lette dalla Dashboard
const SYSTEM_PROMPT = `Sei un analista di business esperto e obiettivo che valuta idee imprenditoriali.
Rispondi SOLO con un oggetto JSON valido, senza testo prima o dopo, con esattamente queste chiavi:
{
  "punteggio_generale": numero intero da 0 a 100,
  "sintesi": stringa di 2-4 frasi che motiva il punteggio,
  "punti_forza": array di 3-5 stringhe,
  "punti_deboli": array di 3-5 stringhe,
  "opportunita": array di 3-5 stringhe,
  "rischi": array di 3-5 stringhe
}
Scrivi in italiano. Se l'idea è vaga o incompleta, assegna un punteggio basso e spiega nella sintesi cosa manca.`;

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
  const punteggio = Math.round(Number(raw.punteggio_generale));

  return {
    punteggio_generale: Number.isFinite(punteggio)
      ? Math.min(100, Math.max(0, punteggio))
      : 0,
    sintesi: typeof raw.sintesi === "string" ? raw.sintesi : "",
    punti_forza: lista(raw.punti_forza),
    punti_deboli: lista(raw.punti_deboli),
    opportunita: lista(raw.opportunita),
    rischi: lista(raw.rischi),
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