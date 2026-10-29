"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Dictionary } from "@/lib/i18n/types";
import type { SpellbookModule } from "@/lib/site";
import styles from "./SpellbookTabs.module.css";

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation) drawn as a
 * tmux window list: roving tabindex, Left/Right/Home/End keys,
 * aria-selected/aria-controls. All panels are server-rendered; inactive ones
 * use the `hidden` attribute.
 */
export default function SpellbookTabs({
  modules,
  t,
}: {
  modules: SpellbookModule[];
  t: Omit<Dictionary["spellbook"], "title" | "lead" | "summaries">;
}) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasMounted = useRef(false);

  // Print the newly selected panel's rows in (skipped on first render).
  useGSAP(
    () => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      if (!window.matchMedia(MOTION_OK).matches) return;
      const panel = root.current?.querySelector<HTMLElement>(
        `[data-panel="${active}"]`,
      );
      if (!panel) return;
      gsap.fromTo(
        panel.querySelectorAll("[data-print]"),
        { autoAlpha: 0, x: -6 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.12,
          ease: "steps(2)",
          stagger: 0.018,
          overwrite: true,
          clearProps: "transform",
        },
      );
    },
    { scope: root, dependencies: [active] },
  );

  const select = (index: number) => {
    const next = (index + modules.length) % modules.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      Home: () => select(0),
      End: () => select(modules.length - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div ref={root} className={styles.root}>
      <div className={styles.bar}>
        <span className={styles.session} aria-hidden="true">
          [spellbook]
        </span>
        <div role="tablist" aria-label={t.tablist} className={styles.tablist}>
          {modules.map((mod, i) => (
            <button
              key={mod.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${mod.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${mod.id}`}
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
            >
              <span aria-hidden="true">{i}:</span>
              {mod.id}
              <span className={styles.flag} aria-hidden="true">
                {i === active ? "*" : " "}
              </span>
            </button>
          ))}
        </div>
      </div>

      {modules.map((mod, i) => (
        <div
          key={mod.id}
          role="tabpanel"
          id={`panel-${mod.id}`}
          aria-labelledby={`tab-${mod.id}`}
          tabIndex={0}
          hidden={i !== active}
          className={styles.panel}
          data-panel={i}
        >
          <p className={styles.summary} data-print>
            # {mod.summary}
          </p>
          {mod.groups.map((group) => (
            <div key={group.module} className={styles.group}>
              <h3 className="prompt" data-print>
                bwiz help {group.module}
              </h3>
              <table className={styles.table} role="table">
                <caption className="sr-only">
                  {t.caption.replace("{module}", group.module)}
                </caption>
                <thead className={styles.head} role="rowgroup">
                  <tr role="row" data-print>
                    <th scope="col" role="columnheader">{t.columns.name}</th>
                    <th scope="col" role="columnheader">{t.columns.usage}</th>
                    <th scope="col" role="columnheader">
                      {t.columns.description}
                    </th>
                    <th scope="col" role="columnheader" className={styles.safetyHead}>
                      {t.columns.safety}
                    </th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {group.spells.map((spell) => (
                    <tr key={spell.name} role="row" className={styles.row} data-print>
                      <td role="cell" className={styles.name}>
                        {spell.name}
                      </td>
                      <td role="cell" className={styles.usage}>
                        <code>{spell.usage}</code>
                      </td>
                      <td role="cell" className={styles.desc}>
                        {spell.description}
                      </td>
                      <td role="cell" className={styles.safety}>
                        {spell.confirms ? (
                          <span className={styles.confirm}>[confirm]</span>
                        ) : (
                          <>
                            <span className={styles.none} aria-hidden="true">
                              —
                            </span>
                            <span className="sr-only">{t.none}</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
