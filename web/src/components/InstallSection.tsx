import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import RichText from "@/components/RichText";
import type { CopyButtonCopy, Dictionary } from "@/lib/i18n";
import { INSTALL_COMMAND, RELOAD_COMMAND } from "@/lib/site";
import styles from "./InstallSection.module.css";

function CommandBox({
  command,
  label,
  comment,
  copy,
}: {
  command: string;
  label: string;
  comment?: string;
  copy: CopyButtonCopy;
}) {
  return (
    <div className={styles.code}>
      <code className={styles.command}>
        <span className={styles.prompt} aria-hidden="true">
          ${" "}
        </span>
        {command}
        {comment && <span className="comment"> {comment}</span>}
      </code>
      <CopyButton text={command} label={label} variant="compact" t={copy} />
    </div>
  );
}

export default function InstallSection({ t }: { t: Dictionary }) {
  const { install } = t;
  return (
    <section id="install" className="section" aria-labelledby="install-title">
      <div className="container">
        <SectionHead
          id="install-title"
          command="./install.sh"
          title={install.title}
          lead={install.lead}
        />

        <Reveal
          as="ol"
          className={styles.steps}
          selector="[data-step]"
          stagger={0.12}
        >
          <li className={styles.step} data-step>
            <h3 className={styles.stepTitle}>
              <span className={styles.number} aria-hidden="true">
                [1/3]
              </span>{" "}
              {install.steps.run}
            </h3>
            <CommandBox
              command={INSTALL_COMMAND}
              label={install.copyInstall}
              copy={t.common.copy}
            />
          </li>

          <li className={styles.step} data-step>
            <h3 className={styles.stepTitle}>
              <span className={styles.number} aria-hidden="true">
                [2/3]
              </span>{" "}
              {install.steps.reload}
            </h3>
            <CommandBox
              command={RELOAD_COMMAND}
              label={install.copyReload}
              comment={install.reloadComment}
              copy={t.common.copy}
            />
          </li>

          <li className={styles.step} data-step>
            <h3 className={styles.stepTitle}>
              <span className={styles.number} aria-hidden="true">
                [3/3]
              </span>{" "}
              {install.steps.customize}
            </h3>
            <p className={styles.note}>
              <RichText text={install.note} />
            </p>
            <pre className={styles.config} aria-label={install.configLabel}>
              <code>
                <span className="comment">
                  # ~/.config/bash-wizardry/config.env
                </span>
                {"\n"}BW_ENABLE_DOCKER=
                <span className={styles.value}>true</span>
                {"\n"}BW_ENABLE_DJANGO=
                <span className={styles.value}>false</span>
                {"\n"}BW_WORKSPACE_ROOTS=
                <span className={styles.value}>
                  &quot;$HOME/Dev:$HOME/Work&quot;
                </span>
              </code>
            </pre>
          </li>
        </Reveal>
      </div>
    </section>
  );
}
