// Every human-language string shown on screen, in English and Spanish.
// Commands and real script output are NOT here: they stay in English in both
// cuts because that is what the shell actually prints.

export type Locale = "en" | "es";

export type Segment = { text: string; accent?: boolean };

export type Copy = {
  title: { line1: Segment[]; line2: Segment[]; size: number };
  problem: { caption: string };
  oneSpell: { caption: string };
  workspaces: { caption: string };
  asksFirst: { caption: string };
  agents: { line1: string; line2: string; you: string; agent: string };
  makeItYours: { caption: string; override: string };
  numbers: { spells: string; modules: string; binaries: string; daemons: string };
  endCard: { footer: string };
};

export const COPY: Record<Locale, Copy> = {
  en: {
    title: {
      line1: [{ text: "Your" }, { text: "terminal." }],
      line2: [{ text: "Superpowers", accent: true }, { text: "included." }],
      size: 136,
    },
    problem: { caption: "Every day." },
    oneSpell: { caption: "One spell. Any project." },
    workspaces: { caption: "Jump anywhere. Run only what you trust." },
    asksFirst: { caption: "Destructive spells always ask first." },
    agents: {
      line1: "Built for humans.",
      line2: "Invisible to agents.",
      you: "you",
      agent: "your agent",
    },
    makeItYours: {
      caption: "Make it yours. No fork required.",
      override: "Override any core spell by name.",
    },
    numbers: { spells: "spells", modules: "modules", binaries: "binaries", daemons: "daemons" },
    endCard: { footer: "Designed & built by carlosleoncode" },
  },
  es: {
    title: {
      line1: [{ text: "Tu" }, { text: "terminal." }],
      line2: [{ text: "Superpoderes", accent: true }, { text: "incluidos." }],
      size: 128,
    },
    problem: { caption: "Todos los días." },
    oneSpell: { caption: "Un hechizo. Cualquier proyecto." },
    workspaces: { caption: "Salta a cualquier proyecto. Ejecuta solo lo que confías." },
    asksFirst: { caption: "Los hechizos destructivos siempre preguntan." },
    agents: {
      line1: "Hecho para humanos.",
      line2: "Invisible para los agentes.",
      you: "tú",
      agent: "tu agente",
    },
    makeItYours: {
      caption: "Hazlo tuyo. Sin fork.",
      override: "Sobrescribe cualquier hechizo por su nombre.",
    },
    numbers: { spells: "hechizos", modules: "módulos", binaries: "binarios", daemons: "daemons" },
    endCard: { footer: "Diseñado y construido por carlosleoncode" },
  },
};
