import styles from "./Background.module.css";

/**
 * Static, CSS-only backdrop: two soft brand glows over a faded grid.
 * Replaces the old canvas MatrixRain, which repainted ~30 times per second.
 */
export default function Background() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.grid} />
      <div className={`${styles.glow} ${styles.glowPurple}`} />
      <div className={`${styles.glow} ${styles.glowCyan}`} />
    </div>
  );
}
