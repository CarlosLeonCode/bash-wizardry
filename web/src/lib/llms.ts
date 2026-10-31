// llms.txt and llms-full.txt (https://llmstxt.org) for each locale: a
// plain-text map of the project for LLMs and AI answer engines. Served by
// the route handlers in app/(en) and app/(es)/es, built once at build time.
// The spell lists come from the generated CATALOG, so they never drift.

import { CATALOG } from "@/lib/catalog.generated";
import {
  getDictionary,
  LOCALES,
  llmsTxtPath,
  LOCALE_NAME,
  PAGE_URL,
  type LlmsFile,
  type Locale,
} from "@/lib/i18n";
import {
  AGENT_ENV_VARS,
  AUTHOR,
  INSTALL_COMMAND,
  MODULE_STATS,
  REPO_URL,
  SITE_URL,
  SPELL_COUNT,
  TOOLS,
  toSpell,
} from "@/lib/site";

const blob = (path: string) => `${REPO_URL}/blob/main/${path}`;

const code = (text: string) => `\`${text}\``;

interface Link {
  title: string;
  path: string;
  note: string;
}

interface LlmsCopy {
  summary: string;
  facts: string;
  install: { title: string; reload: string; note: string };
  agents: { title: string; items: string[] };
  custom: { title: string; items: string[] };
  spells: { title: string; lead: string; count: string };
  reference: { title: string; lead: string; confirms: string };
  docs: { title: string; links: Link[] };
  tools: { title: string };
  optional: { title: string; full: string; other: string; source: string };
}

const env = AGENT_ENV_VARS.map(code).join(", ");

const COPY: Record<Locale, LlmsCopy> = {
  en: {
    summary: `bash-wizardry is a free, open-source (MIT) suite of ${SPELL_COUNT} context-aware shell commands ("spells") for Bash and Zsh: Git, Node.js (npm, yarn, pnpm), Docker, Rails, Ruby, Django, workspaces and .env files. It is plain shell script with no binaries, and it stays invisible to AI coding agents.`,
    facts: `Website: ${PAGE_URL.en}. Source: ${REPO_URL}. Author: ${AUTHOR.name} (${AUTHOR.handle}, ${AUTHOR.url}). Runs on macOS, Linux and Windows (WSL), in Bash and Zsh.`,
    install: {
      title: "Install",
      reload: "Then reload your shell: `source ~/.zshrc` (or `source ~/.bashrc`).",
      note: "The installer clones the repository to `~/.bash-wizardry` and adds `source ~/.bash-wizardry/init.sh` to your shell profile. `bw-update` updates it; `uninstall.sh` removes it and asks first.",
    },
    agents: {
      title: "AI coding agents",
      items: [
        `Agent mode: when the shell is non-interactive or an agent variable is set (${env}), \`init.sh\` only adds \`scripts/\` to \`PATH\` and returns. No aliases, functions, hooks or completions are defined, so every command an agent runs means what it expects.`,
        "Control it with `BW_AGENT_MODE=auto|1|0` and `BW_AGENT_ENV_VARS` in `config.env`. In agent mode `BW_AGENT_ACTIVE=1` is exported.",
        "Discovery: `bwiz` stays on `PATH`. `bwiz help --json [module]` prints every spell as JSON (`module`, `name`, `kind`, `usage`, `description`, `enabled`).",
        "Collision guard: in interactive shells a spell that would shadow an executable, builtin or keyword is skipped unless listed in `BW_ALLOW_OVERRIDE`; `bw-help` lists the skipped ones.",
        "Destructive spells (`greset`, `gbd`, `gclean`, ...) ask for confirmation first.",
      ],
    },
    custom: {
      title: "Customization",
      items: [
        "Your settings live in `~/.config/bash-wizardry/config.env` (`$BW_CONFIG_HOME`); it loads after the repository's `config.env` and survives updates.",
        "Toggle modules with `BW_ENABLE_<MODULE>=true|false`; set `BW_WORKSPACE_ROOTS` for `ws` and `BW_GIT_PROTECTED_BRANCHES` for `gclean`.",
        "Your own modules go in `~/.config/bash-wizardry/modules/*.sh`. A user module named like a core one (e.g. `git.sh`) replaces it, no fork needed.",
        "Workspace hooks (`.bw-on-enter`) run only after you approve them with `ws-trust`; any edit needs a new approval.",
      ],
    },
    spells: {
      title: "Spells by module",
      lead: "Every public spell, by catalog module. Run `bwiz help <module>` for usage; llms-full.txt has every description.",
      count: "spells",
    },
    reference: {
      title: "Command reference",
      lead: "Every public spell, generated from `catalog/commands.tsv`: usage, kind and description.",
      confirms: "asks for confirmation",
    },
    docs: {
      title: "Docs",
      links: [
        { title: "README", path: "README.md", note: "overview, install, AI agents, updating" },
        { title: "Getting started", path: "docs/en/getting-started.md", note: "install, uninstall, configuration" },
        { title: "Tools and modules", path: "docs/en/tools.md", note: "workspaces, Node.js, Git, Docker, env switcher, discovery" },
        { title: "Customization", path: "docs/en/customization.md", note: "user config and modules, replacing a core module" },
        { title: "Git module", path: "docs/en/modules/git.md", note: "gup, gbd, gclean, gundo, greset" },
        { title: "Node.js module", path: "docs/en/modules/node.md", note: "lockfile detection, ni, na, nr, n-reinstall" },
        { title: "Workspaces module", path: "docs/en/modules/workspaces.md", note: "ws, trusted hooks, discovery tips" },
        { title: "What's new", path: "docs/en/changelog.md", note: "release notes in plain words" },
        { title: "Changelog", path: "CHANGELOG.md", note: "every release, Keep a Changelog format" },
        { title: "Security policy", path: "SECURITY.md", note: "how to report a vulnerability" },
        { title: "Contributing", path: "CONTRIBUTING.md", note: "how to add a spell" },
      ],
    },
    tools: { title: "More tools by the author" },
    optional: {
      title: "Optional",
      full: "Full command reference: every spell with usage and description",
      other: "The same file in Spanish",
      source: "Source code on GitHub",
    },
  },
  es: {
    summary: `bash-wizardry es una colección libre y de código abierto (MIT) de ${SPELL_COUNT} comandos de shell que entienden el contexto ("hechizos") para Bash y Zsh: Git, Node.js (npm, yarn, pnpm), Docker, Rails, Ruby, Django, workspaces y archivos .env. Es shell puro, sin binarios, e invisible para los agentes de IA.`,
    facts: `Sitio web: ${PAGE_URL.es}. Código: ${REPO_URL}. Autor: ${AUTHOR.name} (${AUTHOR.handle}, ${AUTHOR.url}). Funciona en macOS, Linux y Windows (WSL), con Bash y Zsh.`,
    install: {
      title: "Instalación",
      reload: "Luego recarga tu shell: `source ~/.zshrc` (o `source ~/.bashrc`).",
      note: "El instalador clona el repositorio en `~/.bash-wizardry` y añade `source ~/.bash-wizardry/init.sh` al perfil de tu shell. `bw-update` lo actualiza; `uninstall.sh` lo elimina y pregunta antes.",
    },
    agents: {
      title: "Agentes de IA",
      items: [
        `Modo agente: cuando la shell no es interactiva o hay una variable de agente definida (${env}), \`init.sh\` solo añade \`scripts/\` al \`PATH\` y termina. No define alias, funciones, hooks ni autocompletado, así que cada comando que ejecuta un agente hace lo que este espera.`,
        "Se controla con `BW_AGENT_MODE=auto|1|0` y `BW_AGENT_ENV_VARS` en `config.env`. En modo agente se exporta `BW_AGENT_ACTIVE=1`.",
        "Descubrimiento: `bwiz` sigue en el `PATH`. `bwiz help --json [module]` devuelve cada hechizo en JSON (`module`, `name`, `kind`, `usage`, `description`, `enabled`).",
        "Protección contra colisiones: en shells interactivas se omite el hechizo que ocultaría un ejecutable, un builtin o una palabra reservada, salvo que esté en `BW_ALLOW_OVERRIDE`; `bw-help` lista los omitidos.",
        "Los hechizos destructivos (`greset`, `gbd`, `gclean`, ...) piden confirmación antes.",
      ],
    },
    custom: {
      title: "Personalización",
      items: [
        "Tu configuración vive en `~/.config/bash-wizardry/config.env` (`$BW_CONFIG_HOME`); se carga después del `config.env` del repositorio y sobrevive a las actualizaciones.",
        "Activa o desactiva módulos con `BW_ENABLE_<MODULE>=true|false`; define `BW_WORKSPACE_ROOTS` para `ws` y `BW_GIT_PROTECTED_BRANCHES` para `gclean`.",
        "Tus propios módulos van en `~/.config/bash-wizardry/modules/*.sh`. Un módulo de usuario con el nombre de uno del núcleo (p. ej. `git.sh`) lo reemplaza, sin hacer fork.",
        "Los hooks de workspace (`.bw-on-enter`) solo se ejecutan después de aprobarlos con `ws-trust`; cualquier cambio requiere una nueva aprobación.",
      ],
    },
    spells: {
      title: "Hechizos por módulo",
      lead: "Todos los hechizos públicos, por módulo del catálogo. Ejecuta `bwiz help <module>` para ver su uso; llms-full.txt trae todas las descripciones.",
      count: "hechizos",
    },
    reference: {
      title: "Referencia de comandos",
      lead: "Todos los hechizos públicos, generados desde `catalog/commands.es.tsv`: uso, tipo y descripción.",
      confirms: "pide confirmación",
    },
    docs: {
      title: "Documentación",
      links: [
        { title: "README (en inglés)", path: "README.md", note: "resumen, instalación, agentes de IA, actualización" },
        { title: "Primeros pasos", path: "docs/es/empezando.md", note: "instalación, desinstalación, configuración" },
        { title: "Herramientas y módulos", path: "docs/es/herramientas.md", note: "workspaces, Node.js, Git, Docker, selector de entornos, descubrimiento" },
        { title: "Personalización", path: "docs/es/personalizacion.md", note: "configuración y módulos propios, reemplazar un módulo del núcleo" },
        { title: "Módulo Git", path: "docs/es/modulos/git.md", note: "gup, gbd, gclean, gundo, greset" },
        { title: "Módulo Node.js", path: "docs/es/modulos/node.md", note: "detección del lockfile, ni, na, nr, n-reinstall" },
        { title: "Módulo Workspaces", path: "docs/es/modulos/workspaces.md", note: "ws, hooks de confianza, sugerencias de descubrimiento" },
        { title: "¿Qué hay de nuevo?", path: "docs/es/cambios.md", note: "notas de cada versión en palabras sencillas" },
        { title: "Changelog (en inglés)", path: "CHANGELOG.md", note: "todas las versiones, formato Keep a Changelog" },
        { title: "Política de seguridad (en inglés)", path: "SECURITY.md", note: "cómo reportar una vulnerabilidad" },
        { title: "Cómo contribuir (en inglés)", path: "CONTRIBUTING.md", note: "cómo añadir un hechizo" },
      ],
    },
    tools: { title: "Más herramientas del autor" },
    optional: {
      title: "Opcional",
      full: "Referencia completa: cada hechizo con su uso y descripción",
      other: "El mismo archivo en inglés",
      source: "Código fuente en GitHub",
    },
  },
};

const absolute = (locale: Locale, file: LlmsFile) => `${SITE_URL}${llmsTxtPath(locale, file)}`;

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

/** Header, install, agents and customization: shared by both files. */
function intro(c: LlmsCopy) {
  return [
    "# Bash Wizardry",
    `> ${c.summary}`,
    c.facts,
    `## ${c.install.title}`,
    ["```bash", INSTALL_COMMAND, "```", "", c.install.reload, "", c.install.note].join("\n"),
    `## ${c.agents.title}`,
    bullets(c.agents.items),
    `## ${c.custom.title}`,
    bullets(c.custom.items),
  ];
}

function links(locale: Locale, c: LlmsCopy, file: LlmsFile) {
  const other = LOCALES.find((l) => l !== locale) ?? locale;
  const optional = [
    file === "llms.txt" && `[llms-full.txt](${absolute(locale, "llms-full.txt")}): ${c.optional.full}`,
    `[${LOCALE_NAME[other]}](${absolute(other, file)}): ${c.optional.other}`,
    `[GitHub](${REPO_URL}): ${c.optional.source}`,
  ].filter((line): line is string => Boolean(line));
  // Same descriptions as the "more tools" section of the page.
  const tools = getDictionary(locale).tools.items;

  return [
    `## ${c.docs.title}`,
    bullets(c.docs.links.map((l) => `[${l.title}](${blob(l.path)}): ${l.note}`)),
    `## ${c.tools.title}`,
    bullets(TOOLS.map((tool) => `[${tool.name}](${tool.url}): ${tools[tool.id].description}`)),
    `## ${c.optional.title}`,
    bullets(optional),
  ];
}

/** /llms.txt and /es/llms.txt: the map, with spell names per module. */
export function buildLlmsTxt(locale: Locale) {
  const c = COPY[locale];
  const modules = MODULE_STATS.map(({ module, count }) => {
    const names = CATALOG.filter((e) => e.module === module).map((e) => code(e.name));
    return `**${module}** (${count} ${c.spells.count}): ${names.join(", ")}`;
  });

  return render([
    ...intro(c),
    `## ${c.spells.title}`,
    c.spells.lead,
    bullets(modules),
    ...links(locale, c, "llms.txt"),
  ]);
}

/** /llms-full.txt and /es/llms-full.txt: the map plus every catalog row. */
export function buildLlmsFullTxt(locale: Locale) {
  const c = COPY[locale];
  const reference = MODULE_STATS.map(({ module, count }) => {
    const rows = CATALOG.filter((e) => e.module === module).map((entry) => {
      const spell = toSpell(entry, locale);
      const confirm = spell.confirms ? ` (${c.reference.confirms})` : "";
      return `${code(spell.usage)} [${entry.kind}]: ${spell.description}${confirm}`;
    });
    return `### ${module} (${count} ${c.spells.count})\n\n${bullets(rows)}`;
  });

  return render([
    ...intro(c),
    `## ${c.reference.title}`,
    c.reference.lead,
    ...reference,
    ...links(locale, c, "llms-full.txt"),
  ]);
}

const render = (blocks: string[]) => `${blocks.join("\n\n")}\n`;

/** Response for a route handler. */
export const textResponse = (body: string) =>
  new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
