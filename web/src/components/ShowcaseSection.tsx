import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import TerminalDemo from "@/components/TerminalDemo";
import { showcases } from "@/lib/content";
import styles from "./ShowcaseSection.module.css";

/** Renders `backtick` spans in copy as inline code. */
function withCode(text: string) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="inline-code">
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function ShowcaseSection() {
  return (
    <section id="tour" className="section" aria-labelledby="tour-title">
      <div className="container">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">The tour</p>
          <h2 id="tour-title" className="section-title">
            See the spells in action
          </h2>
          <p className="section-lead">
            Each session mirrors the messages the scripts actually print. No
            mock features, no hidden binaries.
          </p>
        </Reveal>

        <div className={styles.list}>
          {showcases.map((item, index) => (
            <article
              key={item.id}
              className={`${styles.row} ${index % 2 === 1 ? styles.reverse : ""}`}
              aria-labelledby={`showcase-${item.id}`}
            >
              <Reveal className={styles.text} y={28}>
                <p className="eyebrow">
                  <span className={styles.index}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.eyebrow}
                </p>
                <h3 id={`showcase-${item.id}`} className={styles.title}>
                  {item.title}
                </h3>
                <p className={styles.description}>
                  {withCode(item.description)}
                </p>
                <ul className={styles.points}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className={styles.commands} aria-label="Commands">
                  {item.commands.map((cmd) => (
                    <li key={cmd}>
                      <code>{cmd}</code>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className={styles.visual} y={40}>
                <TerminalDemo session={item.session} trigger="scroll" />
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
