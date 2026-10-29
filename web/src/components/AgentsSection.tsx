import { Fragment, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n";
import {
  AGENT_ENV_VARS,
  AGENT_EXAMPLE_VAR,
  AGENT_FAQ_IDS,
  AGENT_SHELL_ITEMS,
  AGENT_SIGNALS,
} from "@/lib/site";
import styles from "./AgentsSection.module.css";

/** Max characters per continuation line of the BW_AGENT_ENV_VARS example. */
const VARS_WIDTH = 36;

/**
 * Splits the variable list into short lines so the example reads on a phone.
 * Each line ends in a backslash: inside double quotes the shell drops the
 * backslash-newline, and init.sh skips the extra spaces of the indentation.
 */
function wrapVars(names: readonly string[]) {
  const [first, ...rest] = names;
  const lines: string[] = [];
  let line = "";
  for (const name of rest) {
    if (line && line.length + 1 + name.length > VARS_WIDTH) {
      lines.push(line);
      line = name;
    } else {
      line = line ? `${line} ${name}` : name;
    }
  }
  if (line) lines.push(line);
  return [first, ...lines];
}

/**
 * One line of the config.env example. Lines are blocks with a hanging indent,
 * so a comment that wraps on a phone stays clearly inside its "# " margin.
 */
function Line({
  children,
  comment,
}: {
  children?: ReactNode;
  comment?: boolean;
}) {
  const className = comment ? `${styles.line} comment` : styles.line;
  return <span className={className}>{children ?? " "}</span>;
}

function PanelTitle({ children }: { children: string }) {
  return (
    <h3 className={styles.panelTitle} data-print>
      <span className={styles.hash} aria-hidden="true">
        ##{" "}
      </span>
      {children}
    </h3>
  );
}

export default function AgentsSection({ t }: { t: Dictionary["agents"] }) {
  const { detection, shell, config, faq } = t;
  const varsLines = wrapVars([...AGENT_ENV_VARS, AGENT_EXAMPLE_VAR]);

  return (
    <section id="agents" className="section" aria-labelledby="agents-title">
      <div className="container">
        <SectionHead
          id="agents-title"
          command="./agents --explain"
          title={t.title}
          lead={t.lead}
        />

        <div className={styles.grid}>
          <Reveal className={styles.panel} selector="[data-print]" stagger={0.06}>
            <PanelTitle>{detection.title}</PanelTitle>
            <table className={styles.table} role="table">
              <caption className="sr-only">{detection.caption}</caption>
              <thead className={styles.head} role="rowgroup">
                <tr role="row">
                  <th scope="col" role="columnheader">
                    {detection.columns.agent}
                  </th>
                  <th scope="col" role="columnheader">
                    {detection.columns.signal}
                  </th>
                  <th scope="col" role="columnheader" className={styles.resultHead}>
                    {detection.columns.result}
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {AGENT_SIGNALS.map((row) => {
                  const note = detection.notes[row.id];
                  return (
                    <tr key={row.id} role="row" className={styles.row} data-print>
                      <th scope="row" role="rowheader" className={styles.agent}>
                        {"agent" in row ? row.agent : detection.other}
                      </th>
                      <td role="cell" className={styles.signals}>
                        {row.signals.map((signal, i) => (
                          <Fragment key={signal}>
                            {i > 0 && (
                              <span className={styles.or}> {detection.or} </span>
                            )}
                            <code>{signal}</code>
                          </Fragment>
                        ))}
                        {note && (
                          <>
                            <span className={styles.or}> {detection.or} </span>
                            <span className={styles.note}>{note}</span>
                          </>
                        )}
                      </td>
                      <td role="cell" className={styles.result}>
                        <span aria-hidden="true">[</span>
                        {detection.result}
                        <span aria-hidden="true">]</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={styles.footnote} data-print>
              <span aria-hidden="true"># </span>
              <RichText text={detection.footnote} />
            </p>
          </Reveal>

          <div className={styles.side}>
            <Reveal className={styles.panel} selector="[data-print]" stagger={0.05}>
              <PanelTitle>{shell.title}</PanelTitle>
              <ul className={styles.gets}>
                {AGENT_SHELL_ITEMS.map((item) => (
                  <li
                    key={item.id}
                    className={item.loaded ? styles.on : styles.off}
                    data-print
                  >
                    <span className={styles.mark} aria-hidden="true">
                      {item.loaded ? "✓" : "✗"}
                    </span>
                    <span>
                      <span className="sr-only">
                        {item.loaded ? shell.on : shell.off}{" "}
                      </span>
                      <RichText text={shell.items[item.id]} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="figure" className={styles.config}>
              <figcaption className={styles.configTitle}>{config.label}</figcaption>
              <pre className={styles.code}>
                <code>
                  <Line comment># ~/.config/bash-wizardry/config.env</Line>
                  <Line />
                  {config.modeComment.map((line) => (
                    <Line key={line} comment>
                      # {line}
                    </Line>
                  ))}
                  <Line comment># BW_AGENT_MODE=auto</Line>
                  <Line />
                  {config.varsComment.map((line) => (
                    <Line key={line} comment>
                      # {line}
                    </Line>
                  ))}
                  {varsLines.map((line, i) => {
                    const last = i === varsLines.length - 1;
                    return (
                      <Line key={line}>
                        {i === 0 && "BW_AGENT_ENV_VARS="}
                        <span className={styles.value}>
                          {i === 0 ? '"' : "  "}
                          {line}
                          {last ? '"' : " \\"}
                        </span>
                      </Line>
                    );
                  })}
                </code>
              </pre>
            </Reveal>
          </div>
        </div>

        <Reveal className={`${styles.panel} ${styles.faq}`} selector="[data-print]">
          <PanelTitle>{faq.title}</PanelTitle>
          <dl className={styles.faqList}>
            {AGENT_FAQ_IDS.map((id) => (
              <div key={id} className={styles.faqItem} data-print>
                <dt className={styles.question}>
                  <span className={styles.qmark} aria-hidden="true">
                    ?{" "}
                  </span>
                  {faq.items[id].question}
                </dt>
                <dd className={styles.answer}>
                  <RichText text={faq.items[id].answer} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
