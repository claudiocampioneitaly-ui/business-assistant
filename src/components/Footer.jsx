import styles from "./style/Footer.module.css";

// Link del footer: modifica qui href e testi quando avrai le pagine reali
const FOOTER_LINKS = [
  { label: "Documentazione", href: "#doc" },
  { label: "Privacy", href: "/privacy" },
];

function Footer() {
  return (
    <footer className={styles["main-footer"]}>
      <div className={styles["footer-inner"]}>
        {/* Copyright */}
        <div className={styles["footer-copy"]}>
          © {new Date().getFullYear()} Business Assistant AI Platform.
        </div>

        {/* Link */}
        <nav className={styles["footer-nav"]}>
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles["footer-link"]}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
