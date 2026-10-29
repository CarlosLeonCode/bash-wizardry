import { Fragment } from "react";
import type { Dictionary } from "@/lib/i18n";
import { SCRIPTS, SHELL_MODULES, SPELL_COUNT } from "@/lib/site";
import styles from "./Sidebar.module.css";

const NAME_WIDTH = 15;

/** One tree row: branch glyphs, a name and an optional right-hand note. */
function Row({
  branch,
  name,
  note,
  dir,
  user,
}: {
  branch: string;
  name: string;
  note?: string | number;
  dir?: boolean;
  user?: boolean;
}) {
  const nameClass = user ? styles.user : dir ? styles.dir : undefined;
  return (
    <>
      <span className={styles.branch}>{branch}</span>
      <span className={nameClass}>{name}</span>
      {note !== undefined && (
        <span className={user ? styles.user : styles.note}>
          {" ".repeat(Math.max(1, NAME_WIDTH - name.length))}
          {typeof note === "number" ? String(note).padStart(3) : note}
        </span>
      )}
      {"\n"}
    </>
  );
}

/**
 * Desktop-only file tree of the install, with spell counts derived from the
 * catalog. The tree is visual; screen readers get the summary paragraph.
 */
export default function Sidebar({ t }: { t: Dictionary["sidebar"] }) {
  return (
    <aside className={styles.sidebar} aria-label={t.label}>
      <p className="sr-only">{t.summary}</p>
      <pre className={styles.tree} aria-hidden="true">
        <span className={styles.heading}># tree ~/.bash-wizardry</span>
        {"\n"}
        ~/.bash-wizardry/{"\n"}
        <Row branch="├── " name="init.sh" />
        <Row branch="├── " name="config.env" />
        <Row branch="├── " name="modules/" dir />
        {SHELL_MODULES.map((m) => (
          <Fragment key={m.module}>
            <Row branch="│   ├── " name={`${m.module}.sh`} note={m.count} />
          </Fragment>
        ))}
        <Row branch="│   └── " name="discovery.sh" />
        <Row branch="├── " name="scripts/" dir />
        {SCRIPTS.map((name, i) => (
          <Fragment key={name}>
            <Row
              branch={i === SCRIPTS.length - 1 ? "│   └── " : "│   ├── "}
              name={name}
            />
          </Fragment>
        ))}
        <Row branch="├── " name="catalog/" dir />
        <Row branch="│   └── " name="commands.tsv" note={SPELL_COUNT} />
        <Row branch="└── " name="tests/" note="bats ✓" dir />
        {"\n"}
        <span className={styles.heading}># ~/.config/bash-wizardry</span>
        {"\n"}
        <Row branch="├── " name="config.env" />
        <Row branch="└── " name="modules/" user />
        <Row branch="    └── " name="my-team.sh" note={t.userNote} user />
      </pre>
    </aside>
  );
}
