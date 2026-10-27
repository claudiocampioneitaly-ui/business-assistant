import React from "react";
import { jsPDF } from "jspdf";
// CSS Module: lo stile del bottone ora ha un file suo e vale SOLO qui
import styles from "../style/DownloadPDFButton.module.css";

// ==========================================
// STILE DEL PDF: modifica qui font, colori e spaziature
// ==========================================

// Pagina A4 in millimetri
const PAGINA = { larghezza: 210, altezza: 297, margine: 20, margineBasso: 22 };
const LARGHEZZA_TESTO = PAGINA.larghezza - PAGINA.margine * 2;

// Scala tipografica (punti): poche dimensioni, usate sempre allo stesso modo
const FONT = {
  titolo: 20,
  punteggio: 26,
  sezione: 13,
  sottotitolo: 11,
  testo: 10,
  piccolo: 8.5,
};

// Colori RGB (stesso verde del sito)
const COLORI = {
  testo: [33, 37, 41],
  secondario: [100, 110, 120],
  linea: [220, 224, 228],
  sfondo: [244, 246, 248],
  verde: [16, 185, 129],
  giallo: [217, 160, 30],
  rosso: [200, 60, 60],
};

// Interlinea: da punti a millimetri (1 pt = 0.3528 mm) con un po' di respiro
const interlinea = (size) => size * 0.3528 * 1.45;

// Helvetica di jsPDF conosce solo i caratteri "latini" (codici 0-255).
// Con caratteri tipografici (’ “ ” – … spazi speciali, €) jsPDF li cancella
// oppure scrive la riga con le lettere distanziate: qui li sostituiamo con equivalenti sicuri.
const pulisciTesto = (testo) =>
  String(testo ?? "")
    .normalize("NFC")
    .replace(/[‘’‚′´]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/…/g, "...")
    .replace(/[  -   　]/g, " ")
    .replace(/[​-‍⁠﻿]/g, "")
    .replace(/€/g, "EUR")
    // ultimi caratteri rimasti fuori: si tolgono gli accenti "composti", il resto si scarta
    .replace(/[^\x00-\xFF]/g, (c) => c.normalize("NFKD").replace(/[^\x00-\xFF]/g, ""));

// Stesse soglie della Dashboard
const livelloPotenziale = (score) =>
  score >= 70 ? "Alto potenziale" : score >= 40 ? "Potenziale moderato" : "Da approfondire";
const coloreValore = (valore) =>
  valore >= 70 ? COLORI.verde : valore >= 40 ? COLORI.giallo : COLORI.rosso;

function DownloadPDFButton({ result }) {
  const handleDownloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const x = PAGINA.margine;
    let y = PAGINA.margine;

    // ---------- Funzioni di supporto ----------

    const imposta = (size, stile = "normal", colore = COLORI.testo) => {
      doc.setFont("helvetica", stile);
      doc.setFontSize(size);
      doc.setTextColor(...colore);
    };

    // Se il prossimo blocco non entra nella pagina, ne apre una nuova
    const spazioPer = (altezza) => {
      if (y + altezza > PAGINA.altezza - PAGINA.margineBasso) {
        doc.addPage();
        y = PAGINA.margine;
      }
    };

    // Paragrafo che va a capo da solo; rientro = spazio a sinistra (per gli elenchi)
    const paragrafo = (testo, size, stile = "normal", colore = COLORI.testo, rientro = 0) => {
      imposta(size, stile, colore);
      const righe = doc.splitTextToSize(pulisciTesto(testo), LARGHEZZA_TESTO - rientro);
      const passo = interlinea(size);
      righe.forEach((riga) => {
        spazioPer(passo);
        doc.text(riga, x + rientro, y + passo * 0.75);
        y += passo;
      });
    };

    // Titolo di sezione con una linea sottile sotto
    const sezione = (titolo) => {
      y += 8;
      spazioPer(20); // evita un titolo da solo in fondo alla pagina
      imposta(FONT.sezione, "bold");
      doc.text(titolo, x, y + 4);
      y += 7;
      doc.setDrawColor(...COLORI.linea);
      doc.setLineWidth(0.3);
      doc.line(x, y, x + LARGHEZZA_TESTO, y);
      y += 5;
    };

    // Barra orizzontale da 0 a 100 (inizio = coordinata x da cui parte)
    const barra = (valore, larghezza, inizio = x, altezza = 2) => {
      doc.setFillColor(...COLORI.linea);
      doc.roundedRect(inizio, y, larghezza, altezza, altezza / 2, altezza / 2, "F");
      const pieno = (larghezza * Math.max(0, Math.min(100, valore))) / 100;
      if (pieno > 0) {
        doc.setFillColor(...coloreValore(valore));
        doc.roundedRect(inizio, y, pieno, altezza, altezza / 2, altezza / 2, "F");
      }
      y += altezza;
    };

    // Elenco puntato con rientro sospeso (le righe successive restano allineate al testo)
    const elenco = (voci) => {
      if (!voci?.length) {
        paragrafo("Nessun elemento.", FONT.testo, "normal", COLORI.secondario);
        return;
      }
      voci.forEach((voce) => {
        spazioPer(interlinea(FONT.testo));
        doc.setFillColor(...COLORI.verde);
        doc.circle(x + 1.2, y + interlinea(FONT.testo) * 0.5, 0.7, "F");
        paragrafo(voce, FONT.testo, "normal", COLORI.testo, 5);
        y += 1.5;
      });
    };

    // ---------- Intestazione ----------

    imposta(FONT.titolo, "bold");
    doc.text("Report di valutazione", x, y + 6);
    y += 10;

    const data = new Date().toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    imposta(FONT.testo, "normal", COLORI.secondario);
    doc.text(`Business Assistant  ·  ${data}`, x, y + 3);
    y += 9;

    // ---------- Punteggio generale ----------

    const score = result.business_success_score ?? 0;
    const altezzaRiquadro = 30;
    doc.setFillColor(...COLORI.sfondo);
    doc.roundedRect(x, y, LARGHEZZA_TESTO, altezzaRiquadro, 3, 3, "F");

    const interno = x + 8;
    imposta(FONT.piccolo, "bold", COLORI.secondario);
    doc.text("BUSINESS SUCCESS SCORE", interno, y + 8);

    imposta(FONT.punteggio, "bold", coloreValore(score));
    doc.text(String(score), interno, y + 19);
    const larghezzaNumero = doc.getTextWidth(String(score));
    imposta(FONT.sottotitolo, "normal", COLORI.secondario);
    doc.text("/ 100", interno + larghezzaNumero + 2, y + 19);

    imposta(FONT.sottotitolo, "bold", coloreValore(score));
    doc.text(livelloPotenziale(score), x + LARGHEZZA_TESTO - 8, y + 19, { align: "right" });

    // barra del punteggio dentro il riquadro
    const yRiquadro = y;
    y = yRiquadro + 23;
    barra(score, LARGHEZZA_TESTO - 16, interno);
    y = yRiquadro + altezzaRiquadro;

    // ---------- Sintesi ----------

    sezione("Sintesi dell'idea");
    paragrafo(result.sintesi_idea || "Nessuna sintesi disponibile.", FONT.testo);

    // ---------- Metriche ----------

    sezione("Metriche di valutazione");
    result.metriche?.forEach((metrica, i) => {
      // titolo, valore, barra e motivazione restano sulla stessa pagina
      const righeMotivazione = metrica.motivazione
        ? doc.splitTextToSize(pulisciTesto(metrica.motivazione), LARGHEZZA_TESTO).length
        : 0;
      spazioPer(12 + righeMotivazione * interlinea(FONT.testo));

      if (i > 0) y += 4;
      imposta(FONT.sottotitolo, "bold");
      doc.text(pulisciTesto(metrica.titolo), x, y + 4);
      imposta(FONT.sottotitolo, "bold", coloreValore(metrica.valore));
      doc.text(`${metrica.valore}/100`, x + LARGHEZZA_TESTO, y + 4, { align: "right" });
      y += 6.5;

      barra(metrica.valore, LARGHEZZA_TESTO);
      y += 2;

      if (metrica.motivazione) {
        paragrafo(metrica.motivazione, FONT.testo, "normal", COLORI.secondario);
      }
    });

    // ---------- Analisi SWOT ----------

    sezione("Analisi SWOT");
    const swot = [
      ["Punti di forza", result.swot?.punti_forza],
      ["Punti deboli", result.swot?.debolezze],
      ["Opportunità", result.swot?.opportunita],
      ["Rischi", result.swot?.minacce],
    ];
    swot.forEach(([titolo, voci], i) => {
      if (i > 0) y += 4;
      spazioPer(14);
      paragrafo(titolo, FONT.sottotitolo, "bold");
      y += 1.5;
      elenco(voci);
    });

    // ---------- Nota finale ----------

    y += 8;
    spazioPer(12);
    doc.setDrawColor(...COLORI.linea);
    doc.line(x, y, x + LARGHEZZA_TESTO, y);
    y += 4;
    paragrafo(
      "Nota: la valutazione AI è una stima motivata, non una previsione scientifica del successo commerciale.",
      FONT.piccolo,
      "italic",
      COLORI.secondario,
    );

    // ---------- Piè di pagina su ogni pagina ----------

    const totalePagine = doc.getNumberOfPages();
    for (let p = 1; p <= totalePagine; p++) {
      doc.setPage(p);
      imposta(FONT.piccolo, "normal", COLORI.secondario);
      const yPie = PAGINA.altezza - 10;
      doc.text("Business Assistant", x, yPie);
      doc.text(`Pagina ${p} di ${totalePagine}`, x + LARGHEZZA_TESTO, yPie, { align: "right" });
    }

    // Salva il file sul computer dell'utente come PDF testuale
    doc.save("Analisi_Idea_Imprenditoriale.pdf");
  };

  return (
    <button
      type="button"
      onClick={handleDownloadPDF}
      className={styles["btn-download-pdf"]}
    >
      Scarica Report PDF Modificabile
    </button>
  );
}

export default DownloadPDFButton;
