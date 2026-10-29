import type { Metadata } from "next";
import Link from "next/link";
import RootDocument from "@/components/RootDocument";
import styles from "./global-not-found.module.css";

export const metadata: Metadata = {
  title: "404 | Bash Wizardry",
  robots: { index: false, follow: false },
};

// The site has one root layout per locale, so unknown URLs fall back to this
// standalone page (experimental.globalNotFound). Bilingual on purpose: we
// can't tell which locale the visitor wanted.
export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <main className={styles.main}>
        <p className="prompt">cd $REQUEST_PATH</p>
        <h1 className={styles.title}>404</h1>
        <p className={styles.error}>cd: no such file or directory</p>
        <p className={styles.error} lang="es">
          cd: no existe el archivo o directorio
        </p>
        <nav className={styles.links} aria-label="Home / Inicio">
          <Link className="btn-ghost" href="/" hrefLang="en">
            [ ~/ home ]
          </Link>
          <Link className="btn-ghost" href="/es" hrefLang="es" lang="es">
            [ ~/es inicio ]
          </Link>
        </nav>
      </main>
    </RootDocument>
  );
}
