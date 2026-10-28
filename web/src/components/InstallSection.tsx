import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { INSTALL_COMMAND } from "@/lib/content";
import styles from "./InstallSection.module.css";

const RELOAD_COMMAND = "source ~/.zshrc";

export default function InstallSection() {
  return (
    <section id="install" className="section" aria-labelledby="install-title">
      <div className="container">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">Install</p>
          <h2 id="install-title" className="section-title">
            Start casting in{" "}
            <span className="text-gradient">under a minute</span>
          </h2>
          <p className="section-lead">
            One installer, one reload. Works on macOS, Linux and WSL, in Bash
            and Zsh.
          </p>
        </Reveal>

        <Reveal className={styles.panel} selector="[data-step]" stagger={0.12}>
          <ol className={styles.steps}>
            <li className={styles.step} data-step>
              <span className={styles.number} aria-hidden="true">
                1
              </span>
              <div className={styles.body}>
                <h3 className={styles.stepTitle}>Run the installer</h3>
                <div className={styles.code}>
                  <code className={styles.command}>
                    <span className={styles.prompt} aria-hidden="true">
                      ${" "}
                    </span>
                    {INSTALL_COMMAND}
                  </code>
                  <CopyButton
                    text={INSTALL_COMMAND}
                    label="Copy install command"
                  />
                </div>
              </div>
            </li>

            <li className={styles.step} data-step>
              <span className={styles.number} aria-hidden="true">
                2
              </span>
              <div className={styles.body}>
                <h3 className={styles.stepTitle}>Reload your shell</h3>
                <div className={styles.code}>
                  <code className={styles.command}>
                    <span className={styles.prompt} aria-hidden="true">
                      ${" "}
                    </span>
                    {RELOAD_COMMAND}
                    <span className={styles.comment}>
                      {" "}
                      # or: source ~/.bashrc
                    </span>
                  </code>
                  <CopyButton
                    text={RELOAD_COMMAND}
                    label="Copy reload command"
                  />
                </div>
              </div>
            </li>

            <li className={styles.step} data-step>
              <span className={styles.number} aria-hidden="true">
                3
              </span>
              <div className={styles.body}>
                <h3 className={styles.stepTitle}>Make it yours</h3>
                <p className={styles.note}>
                  Run <code className="inline-code">bw-help</code> to list the
                  modules, turn any of them off in{" "}
                  <code className="inline-code">config.env</code>, and stay
                  current with <code className="inline-code">bw-update</code>.
                </p>
                <pre className={styles.config} aria-label="Example config.env">
                  <code>
                    <span className={styles.comment}># config.env</span>
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
              </div>
            </li>
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
