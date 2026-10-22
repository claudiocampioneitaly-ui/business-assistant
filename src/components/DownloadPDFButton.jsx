import React from 'react';
import { jsPDF } from 'jspdf';

function DownloadPDFButton({ result }) {
  const handleDownloadPDF = () => {
    if (!result) return;

    // 1. Inizializziamo un documento A4 standard (misure in millimetri)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configurazione margini e posizione iniziale di scrittura
    const margineSinistro = 20;
    let y = 20; // Coordinata verticale di partenza

    // Funzione helper per scrivere paragrafi lunghi andando a capo automaticamente
    const scriviTesto = (testo, fontSize, isBold = false, spazioSotto = 7) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(33, 37, 41); // Forza il colore NERO ANTRACITE (risolve il grigio chiaro)

      // Divide il testo automaticamente se supera la larghezza del foglio A4
      const righe = doc.splitTextToSize(testo, 170); 
      
      righe.forEach(riga => {
        // Se la riga sta per uscire dal foglio, crea automaticamente una nuova pagina
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(riga, margineSinistro, y);
        y += (fontSize * 0.35) + 1.5; // Calcola lo spazio di interlinea
      });
      
      y += spazioSotto;
    };

    // ==========================================
    // SCRITTURA DEI DATI VETTORIALI NEL PDF
    // ==========================================
    
    // Titolo Principale
    scriviTesto("REPORT DI VALUTAZIONE AZIENDALE", 22, true, 10);
    
    // Punteggio Generale
    scriviTesto(`Punteggio Generale: ${result.punteggio_generale}/100`, 14, true, 12);
    
    // Sintesi dell'AI
    scriviTesto("Sintesi Analisi:", 12, true, 2);
    scriviTesto(result.sintesi || "Nessuna sintesi disponibile.", 11, false, 12);

    // --- MATRICE SWOT ---
    scriviTesto("MATRICE SWOT REALE", 14, true, 8);

    // Punti di Forza
    scriviTesto("Punti di Forza:", 12, true, 2);
    result.punti_forza?.forEach(item => scriviTesto(`• ${item}`, 11, false, 1));
    y += 5; // Spazio di distacco tra le sezioni

    // Punti Deboli
    scriviTesto("Punti Deboli:", 12, true, 2);
    result.punti_deboli?.forEach(item => scriviTesto(`• ${item}`, 11, false, 1));
    y += 5;

    // Opportunità
    scriviTesto("Opportunità:", 12, true, 2);
    result.opportunita?.forEach(item => scriviTesto(`• ${item}`, 11, false, 1));
    y += 5;

    // Rischi
    scriviTesto("Rischi:", 12, true, 2);
    result.rischi?.forEach(item => scriviTesto(`• ${item}`, 11, false, 1));
    y += 15;

    // Disclaimer Obbligatorio in fondo
    scriviTesto("Nota bene: La valutazione AI è una stima motivata, non una previsione scientifica del successo commerciale.", 9, false, 0);

    // 2. Salva il file sul computer dell'utente come vero PDF testuale
    doc.save('Analisi_Idea_Imprenditoriale.pdf');
  };

  return (
    <button type="button" onClick={handleDownloadPDF} className="btn-download-pdf">
      📄 Scarica Report PDF Modificabile
    </button>
  );
}

export default DownloadPDFButton;