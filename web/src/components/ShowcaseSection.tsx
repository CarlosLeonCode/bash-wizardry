import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import SectionHead from "@/components/SectionHead";
import TerminalDemo from "@/components/TerminalDemo";
import type { Dictionary } from "@/lib/i18n";
import { SHOWCASE_IDS, SHOWCASE_SCRIPTS } from "@/lib/site";
import styles from "./ShowcaseSection.module.css";

export default function ShowcaseSection({
  t,
}: {
  t: Dictionary["showcase"];
}) {
  // Translated copy around the literal (English) terminal transcripts.
  const showcases = SHOWCASE_IDS.map((id) => {
    const { commands, session } = SHOWCASE_SCRIPTS[id];
    const copy = t.items[id];
    return {
      id,
      ...copy,
      commands,
      session: { ...session, label: copy.sessionLabel },
    };
  });

  return (
    <section id="tour" className="section" aria-labelledby="tour-title">
      <div className="container">
        <SectionHead
          id="tour-title"
          command={`./tour --sessions ${showcases.length}`}
          title={t.title}
          lead={t.lead}
        />

        <div className={styles.list}>
          {showcases.map((item, index) => (
            <article
              key={item.id}
              className={styles.row}
              aria-labelledby={`showcase-${item.id}`}
            >
              <Reveal className={styles.text}>
                <p className={styles.eyebrow}>
                  <span aria-hidden="true">## </span>
                  {String(index + 1).padStart(2, "0")} · {item.eyebrow}
                </p>
                <h3 id={`showcase-${item.id}`} className={styles.title}>
                  {item.title}
                </h3>
                <p className={styles.description}>
                  <RichText text={item.description} />
                </p>
                <ul className={styles.points}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className={styles.commands} aria-label={t.commandsLabel}>
                  {item.commands.map((cmd) => (
                    <li key={cmd}>
                      <code>{cmd}</code>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <div className={styles.visual}>
                <TerminalDemo
                  session={item.session}
                  trigger="scroll"
                  pane={`${t.pane} ${index}: ${item.id}`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
