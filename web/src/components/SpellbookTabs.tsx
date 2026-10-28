"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { SpellbookModule } from "@/lib/content";
import styles from "./SpellbookTabs.module.css";

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation):
 * roving tabindex, Left/Right/Home/End keys, aria-selected/aria-controls.
 * All panels are server-rendered; inactive ones use the `hidden` attribute.
 */
export default function SpellbookTabs({
  modules,
}: {
  modules: SpellbookModule[];
}) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasMounted = useRef(false);

  // Animate the newly selected panel in (skipped on first render).
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
        panel.querySelectorAll("[data-row]"),
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.025, overwrite: true },
      );
      gsap.fromTo(
        panel.querySelector("[data-summary]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4 },
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
      <div className={styles.tablistWrap}>
        <div role="tablist" aria-label="Modules" className={styles.tablist}>
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
              {mod.label}
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
          <p className={styles.summary} data-summary>
            {mod.summary}
          </p>
          <div className={styles.groups}>
            {mod.groups.map((group, g) => (
              <div key={group.title ?? g} className={styles.group}>
                {group.title && (
                  <h3 className={styles.groupTitle}>{group.title}</h3>
                )}
                <dl className={styles.list}>
                  {group.spells.map((spell) => (
                    <div key={spell.cmd} className={styles.row} data-row>
                      <dt>
                        <code className={styles.cmd}>{spell.cmd}</code>
                      </dt>
                      <dd className={styles.desc}>
                        {spell.description}
                        {spell.confirms && (
                          <span className={styles.badge}>confirms</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
