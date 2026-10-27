import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../style/DocumentationPage.module.css";

// Il README viene importato come testo: la pagina resta sempre allineata al file
import readme from "../../README.md?raw";

// Le immagini del README (docs/media) vengono incluse nella build da Vite.
// Le chiavi sono percorsi relativi a questo file, es. "../../docs/media/login.gif"
const media = import.meta.glob("../../docs/media/*", {
  eager: true,
  query: "?url",
  import: "default",
});

// Converte un percorso del README (es. "docs/media/login.gif") nell'URL generato da Vite.
// Con il tema chiaro usa la versione "_light" (es. login_light.gif), se esiste.
const resolveImage = (src, theme) => {
  if (theme === "light") {
    const lightSrc = src.replace(/(\.[a-z]+)$/i, "_light$1");
    if (media[`../../${lightSrc}`]) return media[`../../${lightSrc}`];
  }
  return media[`../../${src}`] ?? src;
};

// Personalizzazione di alcuni elementi del Markdown (le immagini dipendono dal tema)
const getComponents = (theme) => ({
  img: ({ src, alt }) => (
    <img src={resolveImage(src, theme)} alt={alt} loading="lazy" className={styles["doc-image"]} />
  ),
  // I link esterni si aprono in una nuova scheda
  a: ({ href, children }) => {
    const external = /^https?:\/\//.test(href ?? "");
    return (
      <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {children}
      </a>
    );
  },
  // Le tabelle scorrono in orizzontale su schermi stretti
  table: ({ children }) => (
    <div className={styles["doc-table-wrapper"]}>
      <table>{children}</table>
    </div>
  ),
});

// theme arriva da App.jsx ("light" o "dark"): al cambio tema le GIF si aggiornano
function DocumentationPage({ theme }) {
  return (
    <div className={styles["doc-container"]}>
      <article className={styles["doc-article"]}>
        <Markdown remarkPlugins={[remarkGfm]} components={getComponents(theme)}>
          {readme}
        </Markdown>
      </article>
    </div>
  );
}

export default DocumentationPage;
