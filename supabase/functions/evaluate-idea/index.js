import { serve } from "https://deno.land";
import OpenAI from "https://esm.sh";

// Intestazioni per superare i blocchi di sicurezza CORS del browser
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/*
Quando un'applicazione web (ad esempio un frontend in React o Vue) prova a fare una richiesta a un server posizionato su un dominio diverso (il tuo backend), 
il browser invia automaticamente prima una richiesta con metodo OPTIONS. 
Questa richiesta serve a verificare se il server è d'accordo e permette la comunicazione. 
*/

serve(async (req) => {
  // Risponde immediatamente al controllo finto (pre-flight) inviato dal browser
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Estrae i dati inviati dal modulo React
    const { idea } = await req.json();
    if (!idea) {
      throw new Error("L'idea imprenditoriale è obbligatoria.");
    }

    // Configura OpenAI leggendo la chiave privata salvata nel pannello Supabase
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // Richiesta asincrona a OpenAI impostando lo schema JSON forzato (Strict)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sei un analista di business esperto. Valuta l'idea imprenditoriale fornendo un'analisi strutturata ed obiettiva. Nota bene: la valutazione è una stima motivata e non una previsione scientifica del successo commerciale.",
        },
        {
          role: "user",
          content: `Analizza questa idea: ${idea}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "business_evaluation_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              punteggio_generale: { type: "number" },
              punti_forza: { type: "array", items: { type: "string" } },
              punti_deboli: { type: "array", items: { type: "string" } },
              opportunita: { type: "array", items: { type: "string" } },
              rischi: { type: "array", items: { type: "string" } },
              sintesi: { type: "string" },
            },
            required: [
              "punteggio_generale",
              "punti_forza",
              "punti_deboli",
              "opportunita",
              "rischi",
              "sintesi",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    // Restituisce la risposta dell'AI direttamente all'app React
    return new Response(response.choices.message.content, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Cattura e risponde con l'errore se qualcosa va storto
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
