import styles from "./Crt.module.css";

/**
 * CRT layer: a soft phosphor glow behind the page and faint scanlines on top.
 * Pure CSS, never intercepts the pointer, hidden from assistive technology.
 */
export default function Crt() {
  return (
    <div aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.scanlines} />
    </div>
  );
}
