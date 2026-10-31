// The shape every locale's dictionary must fill. en.ts and es.ts are both
// typed as Dictionary, so TypeScript rejects a locale that misses a key.
//
// Conventions for the strings:
//   - Text between `backticks` renders as inline code (see RichText).
//   - Shell commands, program output, paths, flags and brand names are not
//     translated; they live in src/lib/site.ts.

import type {
  LeadCaptureCopyOverrides,
  RoleOption,
} from "@carlosleoncode/lead-capture";
import type {
  AgentCommandId,
  AgentFaqId,
  AgentShellItemId,
  AgentSignalId,
  BootLine,
  PrincipleFlag,
  ShowcaseId,
  SpellbookTabId,
  ToolId,
} from "@/lib/site";

export interface ShowcaseCopy {
  eyebrow: string;
  title: string;
  /** May contain `inline code`. */
  description: string;
  points: string[];
  /** Plain-text description of the terminal session for assistive tech. */
  sessionLabel: string;
}

export interface CardCopy {
  title: string;
  description: string;
  cta: string;
}

export interface CopyButtonCopy {
  /** Keycap text per status (the compact variant lowercases it). */
  idle: string;
  copied: string;
  error: string;
  /** Live-region messages. */
  copiedMessage: string;
  errorMessage: string;
  /** Tooltip. */
  title: string;
}

export interface FilmButtonCopy {
  /** Visible keycap text, e.g. "play". */
  text: string;
  /** Accessible name. */
  label: string;
}

export interface HeroFilmCopy {
  /** tmux pane title, e.g. "pane 2: demo". */
  pane: string;
  /** Accessible name of the <video>. */
  label: string;
  /** Visually hidden description of what the (silent) film shows. */
  summary: string;
  /** Accessible name of the controls group. */
  controls: string;
  play: FilmButtonCopy;
  pause: FilmButtonCopy;
  replay: FilmButtonCopy;
  /** Accessible name of the seek slider. */
  seek: string;
  /** Slider value text; {current} and {total} are replaced. */
  timeOf: string;
}

export interface Dictionary {
  meta: {
    /** Page title: 60 characters at most. */
    title: string;
    /** Meta, Open Graph and Twitter description: 155 characters at most. */
    description: string;
    keywords: string[];
    /** SoftwareApplication description for JSON-LD. */
    appDescription: string;
    /** SoftwareApplication featureList for JSON-LD. */
    features: string[];
    /** VideoObject name of the hero film. */
    filmName: string;
    /** Social card (src/lib/og.tsx). */
    og: {
      alt: string;
      headline: [string, string];
      subline: string;
    };
  };
  common: {
    skipToContent: string;
    /** Appended (visually hidden) to links that open a new tab. */
    newTab: string;
    copy: CopyButtonCopy;
  };
  topLinks: {
    label: string;
    project: string;
    projectLinks: { github: string; issues: string; web: string };
    authorLinks: { github: string; youtube: string; web: string; kofi: string };
    /** Title of the author's other tools group, e.g. "more tools:". */
    tools: string;
    /** Phones: compact chip to the tools section, e.g. "4 tools". */
    toolsShort: string;
    /** Accessible name of that chip; starts with the visible text. */
    toolsShortLabel: string;
  };
  nav: {
    primary: string;
    mobile: string;
    home: string;
    links: {
      agents: string;
      tour: string;
      principles: string;
      spellbook: string;
      install: string;
      tools: string;
    };
    menu: string;
    close: string;
    language: string;
    /** tmux status line word, e.g. "128 spells". */
    spells: string;
  };
  sidebar: {
    label: string;
    /** Screen-reader summary of the tree. */
    summary: string;
    userNote: string;
  };
  hero: {
    titleLines: [string, string];
    lead: [string, string];
    /** Prefix before the author link in the hero, e.g. "created by". */
    createdBy: string;
    copyInstall: string;
    viewSource: string;
    panesLabel: string;
    paneYou: string;
    paneAgent: string;
    film: HeroFilmCopy;
    bootLog: BootLine[];
    agentComments: Partial<Record<AgentCommandId, string>>;
  };
  agents: {
    title: string;
    lead: string;
    detection: {
      title: string;
      /** Visually hidden table caption. */
      caption: string;
      columns: { agent: string; signal: string; result: string };
      /** Name of the catch-all row (agents without a known variable). */
      other: string;
      /** Joins two signals, e.g. "or". */
      or: string;
      /** Extra signal shown after a row's variables. */
      notes: Partial<Record<AgentSignalId, string>>;
      result: string;
      /** May contain `inline code`. */
      footnote: string;
    };
    shell: {
      title: string;
      /** Visually hidden prefixes that replace the ✗ / ✓ glyphs. */
      off: string;
      on: string;
      /** May contain `inline code`. */
      items: Record<AgentShellItemId, string>;
    };
    config: {
      label: string;
      /** Comment lines above BW_AGENT_MODE, without the leading "# ". */
      modeComment: string[];
      /** Comment lines above BW_AGENT_ENV_VARS, without the leading "# ". */
      varsComment: string[];
    };
    faq: {
      title: string;
      /** Answers may contain `inline code`. */
      items: Record<AgentFaqId, { question: string; answer: string }>;
    };
  };
  showcase: {
    title: string;
    lead: string;
    commandsLabel: string;
    /** tmux word for a pane, e.g. "pane 0: git". */
    pane: string;
    items: Record<ShowcaseId, ShowcaseCopy>;
  };
  principles: {
    title: string;
    lead: string;
    userCommands: string;
    options: string;
    license: string;
    items: Record<PrincipleFlag, { title: string; description: string }>;
  };
  spellbook: {
    title: string;
    /** May contain `inline code`. */
    lead: string;
    tablist: string;
    /** Table caption; "{module}" is replaced by the module name. */
    caption: string;
    columns: { name: string; usage: string; description: string; safety: string };
    none: string;
    summaries: Record<SpellbookTabId, string>;
  };
  install: {
    title: string;
    lead: string;
    steps: { run: string; reload: string; customize: string };
    copyInstall: string;
    copyReload: string;
    reloadComment: string;
    /** May contain `inline code`. */
    note: string;
    configLabel: string;
  };
  /** The author's other tools (TOOLS in src/lib/urls.ts). */
  tools: {
    title: string;
    /** One-line comment under the title, without the leading "# ". */
    lead: string;
    /** Short tag (2–3 words) and a one-sentence description per tool. */
    items: Record<ToolId, { tag: string; description: string }>;
  };
  community: {
    title: string;
    cards: { contribute: CardCopy; issue: CardCopy; star: CardCopy };
  };
  footer: {
    label: string;
    tagline: string;
    columns: {
      product: string;
      project: string;
      community: string;
      tools: string;
    };
    links: {
      tour: string;
      spellbook: string;
      install: string;
      source: string;
      releases: string;
      license: string;
      contributing: string;
      issues: string;
      youtube: string;
      kofi: string;
    };
    license: string;
    builtBy: string;
    spells: string;
  };
  /** Optional "get updates" subscription (src/lib/leads.ts). */
  leads: {
    /** Footer button that opens the card, rendered as "[ get updates ]". */
    getUpdates: string;
    /** Footer link to the privacy policy. */
    privacy: string;
    /** Card copy; "{product}" becomes "bash-wizardry". Missing keys keep the package's Spanish defaults. */
    card: LeadCaptureCopyOverrides;
    /** Role select options (value = backend slug). Omitted: the package's Spanish labels. */
    roles?: readonly RoleOption[];
  };
  /** The privacy policy page (its body lives in components/PrivacyPolicy.tsx). */
  privacy: {
    /** Page title and <h1>. */
    title: string;
    /** Meta description: 155 characters at most. */
    description: string;
    /** Link back to the home page. */
    back: string;
    /** Link to the same page in the other language. */
    otherLanguage: string;
    /** Accessible name of the page's top navigation. */
    navLabel: string;
  };
}
