// Locale-independent site data: URLs, catalog stats, the spellbook tab layout
// and the terminal transcripts. Every command and output line here mirrors
// the real scripts in the repository root (init.sh, modules/*.sh, scripts/),
// so it stays in English in every locale. Translatable copy lives in
// src/lib/i18n/. The command reference itself is generated from
// catalog/commands.tsv and catalog/commands.es.tsv.

import {
  CATALOG,
  type CatalogEntry,
  type CatalogLocale,
} from "@/lib/catalog.generated";
import type { Locale } from "@/lib/i18n/config";

export {
  AUTHOR,
  ISSUES_URL,
  REPO_URL,
  SITE_URL,
  TOOLS,
  toolHost,
  type ToolId,
} from "@/lib/urls";

/** The installer script, as fetched by INSTALL_COMMAND. */
export const INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh";

export const INSTALL_COMMAND = `curl -fsSL ${INSTALL_SCRIPT_URL} | bash`;

export const RELOAD_COMMAND = "source ~/.zshrc";

/* -------------------------------------------------------------------------- */
/*  Catalog stats (derived, never hardcoded)                                  */
/* -------------------------------------------------------------------------- */

/** Total number of public spells. */
export const SPELL_COUNT = CATALOG.length;

export interface ModuleStat {
  module: string;
  count: number;
}

/** Spell count per catalog module, in catalog order. */
export const MODULE_STATS: ModuleStat[] = CATALOG.reduce<ModuleStat[]>(
  (stats, entry) => {
    const stat = stats.find((s) => s.module === entry.module);
    if (stat) stat.count += 1;
    else stats.push({ module: entry.module, count: 1 });
    return stats;
  },
  [],
);

/** Catalog modules that live in modules/<name>.sh ("core" lives in init.sh). */
export const SHELL_MODULES = MODULE_STATS.filter((s) => s.module !== "core");

/** Executables in scripts/, which stay on PATH even in agent mode. */
export const SCRIPTS = CATALOG.filter((entry) => entry.kind === "script").map(
  (entry) => entry.name,
);

export const countFor = (module: string) =>
  MODULE_STATS.find((s) => s.module === module)?.count ?? 0;

/* -------------------------------------------------------------------------- */
/*  Hero film                                                                 */
/* -------------------------------------------------------------------------- */

/** Length of the product film in seconds (video/src/timeline.ts, 2160 frames at 30 fps). */
export const HERO_FILM_DURATION = 72;

/** Day the film was published on the site (VideoObject uploadDate). */
export const HERO_FILM_UPLOAD_DATE = "2026-10-28";

/** HERO_FILM_DURATION as an ISO 8601 duration, e.g. "PT1M12S". */
export const HERO_FILM_ISO_DURATION = `PT${Math.floor(HERO_FILM_DURATION / 60)}M${HERO_FILM_DURATION % 60}S`;

export interface HeroFilmSource {
  /** File name, shown in the pane title like a player command. */
  file: string;
  src: string;
  poster: string;
}

/** One cut per locale, exported by video/tools/export-web.sh into public/video/. */
const heroFilm = (locale: Locale): HeroFilmSource => ({
  file: `bash-wizardry-${locale}.mp4`,
  src: `/video/bash-wizardry-${locale}.mp4`,
  poster: `/video/bash-wizardry-${locale}-poster.webp`,
});

export const HERO_FILM: Record<Locale, HeroFilmSource> = {
  en: heroFilm("en"),
  es: heroFilm("es"),
};

/* -------------------------------------------------------------------------- */
/*  Hero panes                                                                */
/* -------------------------------------------------------------------------- */

export type BootStatus = "init" | "ok" | "skip" | "ready";

export interface BootLine {
  status: BootStatus;
  text: string;
}

/** "label ......" padded to a fixed width, like a boot log. */
export const leader = (label: string, width = 22) =>
  `${label} ${".".repeat(Math.max(3, width - label.length))}`;

/** An AI agent's shell: no spells loaded, the catalog one command away. */
export const AGENT_COMMANDS = [
  { id: "aliases", cmd: "alias | wc -l", output: "0" },
  { id: "type", cmd: "type gup", output: "bash: type: gup: not found" },
  {
    id: "discover",
    cmd: "bwiz help --json git | jq length",
    output: String(countFor("git")),
  },
] as const;

export type AgentCommandId = (typeof AGENT_COMMANDS)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Agents section: how init.sh spots an AI coding agent                      */
/* -------------------------------------------------------------------------- */

/** Default BW_AGENT_ENV_VARS, in the order init.sh lists them. */
export const AGENT_ENV_VARS = [
  "CLAUDECODE",
  "CLAUDE_CODE_ENTRYPOINT",
  "CODEX_SANDBOX",
  "CODEX_THREAD_ID",
  "CURSOR_AGENT",
  "GEMINI_CLI",
  "AI_AGENT",
] as const;

/** Placeholder for the variable a user adds for an agent we do not know. */
export const AGENT_EXAMPLE_VAR = "MY_AGENT";

/**
 * Which variables put each agent's shell in agent mode. Any one of them is
 * enough. "other" has no brand name: its label comes from the dictionary.
 */
export const AGENT_SIGNALS = [
  {
    id: "claude",
    agent: "Claude Code",
    signals: ["CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT"],
  },
  { id: "codex", agent: "Codex", signals: ["CODEX_SANDBOX", "CODEX_THREAD_ID"] },
  { id: "cursor", agent: "Cursor Agent", signals: ["CURSOR_AGENT"] },
  { id: "gemini", agent: "Gemini CLI", signals: ["GEMINI_CLI"] },
  { id: "other", signals: ["AI_AGENT=1", "BW_AGENT_MODE=1"] },
] as const satisfies readonly {
  id: string;
  agent?: string;
  signals: readonly string[];
}[];

export type AgentSignalId = (typeof AGENT_SIGNALS)[number]["id"];

/** What an agent's shell gets from bash-wizardry, in display order. */
export const AGENT_SHELL_ITEMS = [
  { id: "aliases", loaded: false },
  { id: "functions", loaded: false },
  { id: "hooks", loaded: false },
  { id: "completions", loaded: false },
  { id: "scripts", loaded: true },
  { id: "json", loaded: true },
  { id: "flag", loaded: true },
] as const;

export type AgentShellItemId = (typeof AGENT_SHELL_ITEMS)[number]["id"];

export const AGENT_FAQ_IDS = ["break", "spells", "detect"] as const;

export type AgentFaqId = (typeof AGENT_FAQ_IDS)[number];

/* -------------------------------------------------------------------------- */
/*  Terminal demos (literal program output: never translated)                 */
/* -------------------------------------------------------------------------- */

export type TerminalTone =
  "plain" | "muted" | "accent" | "info" | "success" | "warn";

export interface TerminalOutputLine {
  text: string;
  tone?: TerminalTone;
}

export interface TerminalStep {
  /** Command typed at the prompt. */
  cmd: string;
  /** Directory shown in the prompt for this command. */
  cwd: string;
  output: TerminalOutputLine[];
  /** Seconds to hold after the output before the next command. */
  hold?: number;
}

export interface TerminalSession {
  title: string;
  /** Plain-text description of the session for assistive technology. */
  label: string;
  steps: TerminalStep[];
  /** Directory shown on the final idle prompt. */
  finalCwd: string;
}

const wizardTips = (...hints: string[]): TerminalOutputLine[] => [
  { text: "🧙‍♂️ Wizard Tips:", tone: "accent" },
  ...hints.map((hint) => ({ text: `  - ${hint}`, tone: "plain" as const })),
];

export const SHOWCASE_IDS = [
  "workspaces",
  "discovery",
  "env",
  "node",
  "git",
] as const;

export type ShowcaseId = (typeof SHOWCASE_IDS)[number];

export interface ShowcaseScript {
  commands: string[];
  session: Omit<TerminalSession, "label">;
}

export const SHOWCASE_SCRIPTS: Record<ShowcaseId, ShowcaseScript> = {
  workspaces: {
    commands: ["ws", "ws-trust"],
    session: {
      title: "zsh — workspaces",
      steps: [
        {
          cmd: "ws api",
          cwd: "~",
          output: [
            { text: "✨ Entered workspace: api", tone: "success" },
            {
              text: "⚠️  Untrusted .bw-on-enter found. Review it and run 'ws-trust' to allow it.",
              tone: "warn",
            },
          ],
        },
        {
          cmd: "ws-trust",
          cwd: "~/Dev/api",
          output: [
            { text: "----- .bw-on-enter -----", tone: "muted" },
            { text: "nvm use 20", tone: "plain" },
            { text: "------------------------", tone: "muted" },
            {
              text: "Trust and run this hook in future visits? [y/N] y",
              tone: "warn",
            },
            {
              text: "✅ Hook trusted. It will run on your next 'ws' visit.",
              tone: "success",
            },
          ],
        },
        {
          cmd: "ws api",
          cwd: "~/Dev/api",
          output: [
            { text: "✨ Entered workspace: api", tone: "success" },
            { text: "🪄 Running workspace hook...", tone: "accent" },
          ],
        },
      ],
      finalCwd: "~/Dev/api",
    },
  },
  discovery: {
    commands: ["nr", "dckrexec", "djshell", "rcs"],
    session: {
      title: "zsh — discovery",
      steps: [
        {
          cmd: "cd ~/Dev/shop",
          cwd: "~",
          output: wizardTips(
            "Detected Node.js project. Type 'nr' to manage scripts.",
            "Detected Docker environment. Type 'dckrexec' to jump into a container.",
            "Detected Rails project. Type 'rcs' for console.",
          ),
        },
      ],
      finalCwd: "~/Dev/shop",
    },
  },
  env: {
    commands: ["env-ls", "env-set"],
    session: {
      title: "zsh — env",
      steps: [
        {
          cmd: "env-ls",
          cwd: "~/Dev/api",
          output: [
            { text: "🧙‍♂️ Available environment files:", tone: "accent" },
            { text: "  - local", tone: "plain" },
            { text: "  - production", tone: "plain" },
            { text: "  - staging", tone: "plain" },
          ],
        },
        {
          cmd: "env-set production",
          cwd: "~/Dev/api",
          output: [
            {
              text: "⚠️ Custom .env detected and backed up to .env.backup.20261028142310",
              tone: "warn",
            },
            { text: "✨ Environment set to: production", tone: "success" },
          ],
        },
      ],
      finalCwd: "~/Dev/api",
    },
  },
  node: {
    commands: ["ni", "na", "nr", "n-reinstall"],
    session: {
      title: "zsh — node",
      steps: [
        {
          cmd: "nr",
          cwd: "~/Dev/web",
          output: [
            { text: "Please select a script to run:", tone: "plain" },
            { text: "1) build", tone: "muted" },
            { text: "2) dev", tone: "info" },
            { text: "3) lint", tone: "muted" },
            { text: "#? 2", tone: "plain" },
            { text: "-> Using 'pnpm' to run 'dev'...", tone: "accent" },
          ],
        },
      ],
      finalCwd: "~/Dev/web",
    },
  },
  git: {
    commands: ["gup", "gclean", "gundo"],
    session: {
      title: "zsh — git",
      steps: [
        {
          cmd: "gclean",
          cwd: "~/Dev/api",
          output: [
            { text: "Fetching latest state from origin...", tone: "muted" },
            { text: "Branches merged into origin/main:", tone: "plain" },
            { text: "  - feat/login", tone: "info" },
            { text: "  - fix/typo", tone: "info" },
            { text: "Delete these 2 merged branches? [y/N] y", tone: "warn" },
            { text: "Deleted branch feat/login (was 3f2a1c9).", tone: "muted" },
            { text: "Deleted branch fix/typo (was 8b7d0e4).", tone: "muted" },
          ],
        },
      ],
      finalCwd: "~/Dev/api",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Principles: flags and example commands                                    */
/* -------------------------------------------------------------------------- */

export const PRINCIPLE_FLAGS = [
  { flag: "--agent-safe", command: "bwiz help --json" },
  { flag: "--trusted-hooks", command: "ws-trust" },
  { flag: "--forkable", command: "bwiz modules" },
  { flag: "--confirm", command: "greset" },
  { flag: "--interactive", command: "dckrexec" },
  { flag: "--lockfile-aware", command: "nr" },
  { flag: "--modular", command: "bw-update" },
  { flag: "--pure-shell" },
] as const satisfies readonly { flag: string; command?: string }[];

export type PrincipleFlag = (typeof PRINCIPLE_FLAGS)[number]["flag"];

/* -------------------------------------------------------------------------- */
/*  Spellbook (command reference)                                             */
/* -------------------------------------------------------------------------- */

// Commands come from the generated CATALOG; only the tab layout lives here.
// An English catalog description ending in "Asks first." marks a command that
// confirms before acting; the Spanish descriptions never carry that phrase.

export interface Spell {
  name: string;
  usage: string;
  /** Localized description, without the trailing "Asks first.". */
  description: string;
  /** True when the command asks for confirmation before acting. */
  confirms: boolean;
}

export interface SpellGroup {
  /** Catalog module name, as passed to `bwiz help <module>`. */
  module: string;
  spells: Spell[];
}

export interface SpellbookModule {
  id: string;
  summary: string;
  groups: SpellGroup[];
}

/** Tabs of the spellbook: short window name and the catalog modules shown. */
export const SPELLBOOK_TABS = [
  { id: "git", groups: [{ module: "git" }] },
  { id: "node", groups: [{ module: "node" }] },
  { id: "docker", groups: [{ module: "docker" }] },
  { id: "rails", groups: [{ module: "rails" }, { module: "ruby" }] },
  { id: "django", groups: [{ module: "django" }] },
  {
    id: "workspaces",
    groups: [{ module: "workspaces" }, { module: "env" }, { module: "core" }],
  },
] as const;

export type SpellbookTabId = (typeof SPELLBOOK_TABS)[number]["id"];

const CONFIRMS_SUFFIX = " Asks first.";

/** One catalog row in a locale, with "Asks first." turned into `confirms`. */
export const toSpell = (entry: CatalogEntry, locale: CatalogLocale): Spell => {
  const confirms = entry.description.en.endsWith(CONFIRMS_SUFFIX);
  const description =
    locale === "en" && confirms
      ? entry.description.en.slice(0, -CONFIRMS_SUFFIX.length)
      : entry.description[locale];
  return { name: entry.name, usage: entry.usage, description, confirms };
};

/** The spellbook for one locale; tab summaries come from its dictionary. */
export const buildSpellbook = (
  locale: CatalogLocale,
  summaries: Record<SpellbookTabId, string>,
): SpellbookModule[] =>
  SPELLBOOK_TABS.map((tab) => ({
    id: tab.id,
    summary: summaries[tab.id],
    groups: tab.groups.map(({ module }) => ({
      module,
      spells: CATALOG.filter((entry) => entry.module === module).map((entry) =>
        toSpell(entry, locale),
      ),
    })),
  }));

/* -------------------------------------------------------------------------- */
/*  Privacy policy data (the optional "get updates" subscription)             */
/* -------------------------------------------------------------------------- */

/** A value the author still has to fill in. */
type Todo = `TODO${string}`;

export interface PrivacyConfig {
  /** Data controller: your full legal name or company name. */
  controller: string;
  /** City and country of the controller, e.g. "Bogotá, Colombia". */
  location: string;
  /** Mailbox for privacy requests and unsubscribes. */
  contactEmail: string;
  /** Supabase project region, as shown in its settings, e.g. "us-east-1 (N. Virginia, USA)". */
  supabaseRegion: string;
  /** true when Brevo sends the emails and handles unsubscribes (BREVO_ENABLED). */
  usesBrevo: boolean | Todo;
  /**
   * Brand whose other tools may also be announced to subscribers, e.g.
   * "Carlos Leon Code". null: only bash-wizardry news.
   */
  otherToolsBrand: string | null;
  /** Days to delete a person's data after they unsubscribe (template: 30). */
  retentionDaysAfterUnsubscribe: number | Todo;
  /** Months without sending any news before the list is deleted (template: 24). */
  inactiveListMonths: number | Todo;
  /** Business days to answer, set by Ley 1581 de 2012 (arts. 14 and 15). */
  responseDays: { queries: number; claims: number };
  /** Minimum age to subscribe: 14 or 18. */
  minimumAge: 14 | 18 | Todo;
  /** Date of the last important change, YYYY-MM-DD. */
  lastUpdated: string;
}

/**
 * Real data shown on /privacy and /es/privacidad. Every "TODO" must be
 * replaced by the author: a production build with the subscription on
 * (LEADS_ENABLED) fails while any value still starts with "TODO" (see assertPrivacyReady),
 * so the subscription can never ship with a half-filled policy.
 */
export const PRIVACY: PrivacyConfig = {
  controller: "Carlos Esteban León",
  location: "Colombia",
  contactEmail: "carlosleoncode@gmail.com",
  supabaseRegion: "TODO: Supabase project region",
  usesBrevo: false,
  otherToolsBrand: null,
  retentionDaysAfterUnsubscribe: 30,
  inactiveListMonths: 24,
  responseDays: { queries: 10, claims: 15 },
  minimumAge: 18,
  lastUpdated: "TODO: YYYY-MM-DD",
};

/** Dotted paths of the PRIVACY values that still start with "TODO". */
export function privacyPlaceholders(
  value: unknown = PRIVACY,
  path = "PRIVACY",
): string[] {
  if (typeof value === "string") return value.startsWith("TODO") ? [path] : [];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      privacyPlaceholders(child, `${path}.${key}`),
    );
  }
  return [];
}

/**
 * Throws in production builds while PRIVACY has placeholders. Called at the
 * top of each privacy page module, and only when the subscription is on
 * (LEADS_ENABLED: endpoint set and package installed). Otherwise nothing is
 * collected, the privacy pages are 404 and the build passes.
 */
export function assertPrivacyReady(leadsEnabled: boolean) {
  if (!leadsEnabled || process.env.NODE_ENV !== "production") return;
  const missing = privacyPlaceholders();
  if (missing.length === 0) return;
  throw new Error(
    `NEXT_PUBLIC_LEADS_ENDPOINT is set but the privacy policy still has placeholders: ${missing.join(", ")}. ` +
      "Fill them in PRIVACY (web/src/lib/site.ts), or unset NEXT_PUBLIC_LEADS_ENDPOINT to build without the subscription.",
  );
}
