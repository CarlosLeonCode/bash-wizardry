import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n";
import { AUTHOR, TOOLS, toolHost } from "@/lib/site";
import styles from "./MoreToolsSection.module.css";

/** Cards linking to the author's other tools (TOOLS in src/lib/urls.ts). */
export default function MoreToolsSection({ t }: { t: Dictionary }) {
  const tools = TOOLS.map((tool) => ({ ...tool, ...t.tools.items[tool.id] }));

  return (
    <section id="tools" className="section" aria-labelledby="tools-title">
      <div className="container">
        <SectionHead
          id="tools-title"
          command={`ls ~/${AUTHOR.handle}/tools`}
          title={t.tools.title}
          lead={t.tools.lead}
        />

        <Reveal as="ul" className={styles.grid} stagger={0.1}>
          {tools.map((tool) => (
            <li key={tool.id}>
              {/* rel without noreferrer: the author's own sites may see the referral. */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener"
                className={styles.card}
              >
                <span className={styles.entry} aria-hidden="true">
                  drwxr-xr-x {tool.id}/
                </span>
                <h3 className={styles.name}>{tool.name}</h3>
                <p className={styles.tag}>{tool.tag}</p>
                <p className={styles.description}>{tool.description}</p>
                <span className={styles.host}>
                  <span aria-hidden="true">→ </span>
                  {toolHost(tool.url)} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> {t.common.newTab}</span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
