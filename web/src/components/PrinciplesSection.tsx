import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n";
import { PRINCIPLE_FLAGS } from "@/lib/site";
import styles from "./PrinciplesSection.module.css";

export default function PrinciplesSection({
  t,
}: {
  t: Dictionary["principles"];
}) {
  const principles = PRINCIPLE_FLAGS.map((item) => ({
    flag: item.flag,
    command: "command" in item ? item.command : undefined,
    ...t.items[item.flag],
  }));

  return (
    <section
      id="principles"
      className="section"
      aria-labelledby="principles-title"
    >
      <div className="container">
        <SectionHead
          id="principles-title"
          command="man bash-wizardry"
          title={t.title}
          lead={t.lead}
        />

        <Reveal className={styles.man} selector="[data-print]" stagger={0.06}>
          <div className={styles.manHeader} aria-hidden="true" data-print>
            <span>BASH-WIZARDRY(1)</span>
            <span className={styles.center}>{t.userCommands}</span>
            <span>BASH-WIZARDRY(1)</span>
          </div>

          <h3 className={styles.heading} data-print>
            {t.options}
          </h3>

          <dl className={styles.options}>
            {principles.map((item) => (
              <div key={item.flag} className={styles.option} data-print>
                <dt className={styles.flag}>{item.flag}</dt>
                <dd className={styles.body}>
                  <p>
                    <strong className={styles.name}>{item.title}.</strong>{" "}
                    {item.description}
                  </p>
                  {item.command && (
                    <p className={styles.example}>
                      <span aria-hidden="true">$ </span>
                      <code>{item.command}</code>
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className={styles.manFooter} aria-hidden="true" data-print>
            <span>bash-wizardry</span>
            <span>{t.license}</span>
            <span>BASH-WIZARDRY(1)</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
