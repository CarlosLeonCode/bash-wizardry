import type {
  LeadCaptureCopy,
  RoleSlug,
} from "@carlosleoncode/lead-capture";
import type { Dictionary } from "@/lib/i18n/types";
import {
  countFor,
  leader,
  SCRIPTS,
  SHELL_MODULES,
  SPELL_COUNT,
} from "@/lib/site";

const NEW_TAB = "(opens in a new tab)";

export const en: Dictionary = {
  meta: {
    title: "Bash Wizardry — Bash & Zsh spells, safe with AI agents",
    description: `${SPELL_COUNT} context-aware spells for Bash & Zsh: Git, Node.js, Docker, Rails, Django and workspaces. Pure shell, no binaries, invisible to AI agents.`,
    keywords: [
      "bash",
      "zsh",
      "terminal",
      "cli",
      "shell aliases",
      "productivity",
      "developer tools",
      "git",
      "docker",
      "node.js",
    ],
    appDescription:
      "A curated suite of context-aware shell spells for Bash and Zsh. Pure shell, no binaries, 100% under your control.",
    features: [
      `${SPELL_COUNT} spells for Git, Node.js, Docker, Rails, Ruby and Django`,
      "Lockfile-aware npm, yarn and pnpm commands",
      "Workspaces with trusted .bw-on-enter hooks",
      "Confirmation before destructive Git operations",
      "Agent mode: invisible to AI coding agents",
      "Machine-readable catalog with bwiz help --json",
      "User config and modules without forking",
    ],
    filmName: "bash-wizardry: Your terminal. Superpowers included.",
    og: {
      alt: `bash-wizardry: Your terminal. Superpowers included. ${SPELL_COUNT} spells for Bash and Zsh, invisible to AI agents.`,
      headline: ["Your terminal.", "Superpowers included."],
      subline: `${SPELL_COUNT} spells for Bash & Zsh · invisible to AI agents`,
    },
  },

  common: {
    skipToContent: "Skip to content",
    newTab: NEW_TAB,
    copy: {
      idle: "COPY",
      copied: "COPIED",
      error: "FAILED",
      copiedMessage: "Copied to clipboard",
      errorMessage: "Copy failed",
      title: "Copy to clipboard",
    },
  },

  topLinks: {
    label: "Project and author links",
    project: "project:",
    projectLinks: {
      github: "GitHub repository of bash-wizardry",
      issues: "Issues of bash-wizardry on GitHub",
      web: "Website of bash-wizardry, bashwizardry.carlosleoncode.com",
    },
    authorLinks: {
      github: "GitHub profile of carlosleoncode",
      youtube: "YouTube channel of carlosleoncode",
      web: "Website of carlosleoncode, carlosleoncode.com",
      kofi: "Ko-fi page of carlosleoncode",
    },
  },

  nav: {
    primary: "Primary",
    mobile: "Mobile",
    home: "bash-wizardry home",
    links: {
      agents: "agents",
      tour: "tour",
      principles: "principles",
      spellbook: "spellbook",
      install: "install",
    },
    menu: "menu",
    close: "close",
    language: "Language",
    spells: "spells",
  },

  sidebar: {
    label: "Install layout",
    summary: `${SPELL_COUNT} spells across ${SHELL_MODULES.length} modules: ${SHELL_MODULES.map(
      (m) => `${m.module} ${m.count}`,
    ).join(", ")}.`,
    userNote: "user",
  },

  hero: {
    titleLines: ["your terminal,", "superpowers included"],
    lead: [
      `${SPELL_COUNT} context-aware spells for git, node, docker, rails & django.`,
      "pure bash/zsh. no binaries. no daemons. invisible to AI agents.",
    ],
    createdBy: "created by",
    copyInstall: "Copy install command",
    viewSource: "view source",
    panesLabel:
      "Two terminal panes. In your interactive shell, 'exec zsh' loads every bash-wizardry module, " +
      "a user module, and skips 'rs' because it would shadow /usr/bin/rs. " +
      "In an AI agent's shell, no aliases are defined, 'type gup' finds nothing, " +
      `and 'bwiz help --json git' lists the ${countFor("git")} git spells on demand.`,
    paneYou: "pane 0: you",
    paneAgent: "pane 1: agent",
    film: {
      pane: "pane 2: demo",
      label: "bash-wizardry product film (no audio)",
      summary:
        "A 72-second silent film. A cursor types 'bash-wizardry', then the line 'Your terminal. " +
        "Superpowers included.' The long git, docker and package-manager commands typed every day give way " +
        "to single spells: gup syncs a branch, nr picks the right package manager, ws jumps into a project " +
        "and asks before running its hook, and gclean asks before deleting merged branches. It closes on " +
        "spells staying invisible to AI agents, overriding any spell without a fork, and the install command.",
      controls: "Film controls",
      play: { text: "play", label: "Play the film" },
      pause: { text: "pause", label: "Pause the film" },
      replay: { text: "replay", label: "Replay the film from the start" },
      seek: "Film position",
      timeOf: "{current} of {total}",
    },
    // What `exec zsh` prints in spirit: one line per loaded module.
    bootLog: [
      { status: "init", text: "bash-wizardry init" },
      ...SHELL_MODULES.map(({ module, count }) => ({
        status: "ok" as const,
        text: `${leader(`module ${module}`)} ${String(count).padStart(2)} spells`,
      })),
      { status: "ok", text: `${leader("user module my-team")} loaded` },
      { status: "skip", text: "rs → would shadow /usr/bin/rs" },
      { status: "ready", text: "spells armed · try bw-help" },
    ],
    agentComments: {
      type: "stealth mode: no aliases, no hooks",
      discover: "agents discover spells on demand",
    },
  },

  agents: {
    title: "Built for humans. Invisible to agents.",
    lead: "When Claude Code, Codex, Cursor or Gemini CLI run commands in your shell, bash-wizardry steps aside: no aliases, no functions, no surprises.",
    detection: {
      title: "Who triggers stealth mode",
      caption:
        "AI coding agents, the environment variables that put their shell in agent mode, and the result",
      columns: { agent: "AGENT", signal: "DETECTED BY", result: "RESULT" },
      other: "any other agent",
      or: "or",
      notes: { codex: "a non-interactive shell" },
      result: "stealth",
      footnote:
        "A heuristic, not an official integration: variable names can change between tools and versions. With `auto`, any non-interactive shell counts as an agent too.",
    },
    shell: {
      title: "What the agent's shell gets",
      off: "Not loaded:",
      on: "Available:",
      items: {
        aliases: "aliases",
        functions: "functions",
        hooks: "hooks: `.bw-on-enter`, discovery tips",
        completions: "completions",
        scripts: `\`scripts/\` on PATH: ${SCRIPTS.map((s) => `\`${s}\``).join(", ")}`,
        json: "`bwiz help --json [module]`: the spell catalog as JSON",
        flag: "`BW_AGENT_ACTIVE=1`, so your own scripts can tell",
      },
    },
    config: {
      label: "Agent settings in config.env",
      modeComment: [
        "auto (default) | 1 = always | 0 = never.",
        "Leave it commented so an agent's env can set it.",
      ],
      varsComment: [
        "Setting the list replaces the default one:",
        "keep it and append your agent's variable.",
      ],
    },
    faq: {
      title: "FAQ",
      items: {
        break: {
          question: "Will it break my agent's commands?",
          answer:
            "No. In agent mode bash-wizardry defines nothing, so every command the agent runs means what it expects. Even in your own shell, a spell that would shadow a real executable, builtin or keyword is skipped unless you allow it in `BW_ALLOW_OVERRIDE`.",
        },
        spells: {
          question: "Can my agent still use the spells?",
          answer:
            "It can look them up. `bwiz` stays on PATH, and `bwiz help --json [module]` returns each spell's module, name, kind, usage, description and whether its module is enabled. The aliases and functions themselves are not loaded.",
        },
        detect: {
          question: "My agent isn't detected?",
          answer:
            "Export `BW_AGENT_MODE=1` in the agent's environment, or add the variable it sets to `BW_AGENT_ENV_VARS`. To check, run `echo $BW_AGENT_ACTIVE` from the agent: `1` means stealth.",
        },
      },
    },
  },

  showcase: {
    title: "See the spells in action",
    lead: "Each session mirrors the messages the scripts actually print. No mock features, no hidden binaries.",
    commandsLabel: "Commands",
    pane: "pane",
    items: {
      workspaces: {
        eyebrow: "Magic Workspaces",
        title: "Jump to any project. Run only the hooks you trust.",
        description:
          "`ws` searches every directory in BW_WORKSPACE_ROOTS: exact match first, fuzzy match next, or an fzf picker when you type nothing. Projects can ship a `.bw-on-enter` hook to set up their environment on arrival.",
        points: [
          "Hooks never run until you review and approve them with ws-trust.",
          "Trust is pinned to a sha256 of the file: any edit requires re-trusting.",
        ],
        sessionLabel:
          "Terminal demo: 'ws api' enters the api workspace and warns that its .bw-on-enter hook is untrusted. 'ws-trust' prints the hook and asks for confirmation, then trusts it. The next 'ws api' runs the trusted workspace hook.",
      },
      discovery: {
        eyebrow: "Contextual Discovery",
        title: "The wizard reads the room.",
        description:
          "On every directory change in Zsh (and after every `ws` jump), bash-wizardry looks for package.json, Docker files, manage.py and a Rails Gemfile, then prints the spells that fit that project.",
        points: [
          "Node → nr, Docker → dckrexec, Django → djshell, Rails → rcs.",
          "Stays silent in your home directory and in projects it does not recognize.",
        ],
        sessionLabel:
          "Terminal demo: changing into a project directory prints Wizard Tips suggesting 'nr' for Node.js scripts, 'dckrexec' for Docker containers and 'rcs' for the Rails console.",
      },
      env: {
        eyebrow: "Env Switcher",
        title: "Swap .env files without losing your edits.",
        description:
          "`env-ls` lists every .env.<name> file and marks the active one. `env-set` swaps one into place (or opens an fzf picker) and backs up a hand-edited .env before overwriting it.",
        points: [
          "Custom .env files are saved as .env.backup.<timestamp>.",
          "Works in any project: Node, Rails, Django, Docker Compose.",
        ],
        sessionLabel:
          "Terminal demo: 'env-ls' lists the local, production and staging environment files. 'env-set production' backs up the custom .env to a timestamped file and sets the environment to production.",
      },
      node: {
        eyebrow: "Node.js",
        title: "One set of commands for npm, yarn and pnpm.",
        description:
          "bash-wizardry reads the lockfile (pnpm > yarn > npm) and runs the right package manager for you. `nr` without arguments opens a menu of your package.json scripts.",
        points: [
          "ni, na, nad, nrm, nup behave the same in every project.",
          "n-reinstall wipes node_modules and lockfiles (after confirming) and reinstalls.",
        ],
        sessionLabel:
          "Terminal demo: 'nr' shows a numbered menu of package.json scripts (build, dev, lint); choosing dev runs it with pnpm.",
      },
      git: {
        eyebrow: "Git",
        title: "Fast Git, with guardrails.",
        description:
          "`gup` pulls with rebase and pushes in one go. `gclean` deletes branches already merged into origin's default branch, but never the default branch, your current branch, or anything in BW_GIT_PROTECTED_BRANCHES, and it always asks first.",
        points: [
          "greset and gbd confirm before discarding anything.",
          "gundo is a soft reset: the commit goes, your changes stay.",
        ],
        sessionLabel:
          "Terminal demo: 'gclean' fetches from origin, lists two branches merged into origin/main, asks for confirmation and deletes them.",
      },
    },
  },

  principles: {
    title: "Powerful, but never reckless",
    lead: "bash-wizardry is a set of plain shell functions you can read in an afternoon. It speeds you up without taking control away from you.",
    userCommands: "User Commands",
    options: "OPTIONS",
    license: "MIT License",
    items: {
      "--agent-safe": {
        title: "Agent-safe by default",
        description:
          "Invisible to AI coding agents: in non-interactive or agent shells only scripts/ joins your PATH. And no spell ever shadows a real command, builtin or keyword.",
      },
      "--trusted-hooks": {
        title: "Trusted hooks only",
        description:
          "A .bw-on-enter hook runs only after you approve it with ws-trust. Approvals are pinned to the file's sha256, so edits need a fresh review.",
      },
      "--forkable": {
        title: "Yours to extend",
        description:
          "Drop your own modules in ~/.config/bash-wizardry/modules. A file named like a core module replaces it, and bw-update never touches your files.",
      },
      "--confirm": {
        title: "Safety first",
        description:
          "Destructive spells like greset, gbd, gclean, rdbreset, djflushmigrations and dckrprune ask for confirmation, in both Bash and Zsh.",
      },
      "--interactive": {
        title: "Interactive Docker",
        description:
          "Pick a container from a menu for exec, logs, stop, start, restart or rm. dckrclean asks before pruning each resource type.",
      },
      "--lockfile-aware": {
        title: "Manager-agnostic Node",
        description:
          "The lockfile decides: pnpm, yarn or npm. Your fingers only need ni, na, nr and friends.",
      },
      "--modular": {
        title: "Modular by design",
        description:
          "Toggle any module with BW_ENABLE_<MODULE>=true|false in config.env. bw-update fast-forwards and reloads in place.",
      },
      "--pure-shell": {
        title: "Pure shell",
        description:
          "Readable Bash and Zsh scripts. No binaries, no daemons, nothing running in the background.",
      },
    },
  },

  spellbook: {
    title: "Every spell, one glance away",
    lead: `All ${SPELL_COUNT} spells by module, straight from the catalog. Spells marked \`[confirm]\` ask before doing anything destructive.`,
    tablist: "Modules",
    caption:
      "{module} spells: name, usage, description and whether they ask before acting",
    columns: {
      name: "NAME",
      usage: "USAGE",
      description: "DESCRIPTION",
      safety: "SAFETY",
    },
    none: "none",
    summaries: {
      git: "Everyday Git, shorter, with confirmation on anything destructive.",
      node: "Auto-detects pnpm > yarn > npm from the lockfile.",
      docker: "Interactive container picker whenever you omit the container ID.",
      rails:
        "Rails shortcuts plus Ruby helpers that work with asdf, rbenv or rvm.",
      django: "manage.py without the typing.",
      workspaces: "Navigation, environment files and the core commands.",
    },
  },

  install: {
    title: "Start casting in under a minute",
    lead: "One installer, one reload. Works on macOS, Linux and WSL, in Bash and Zsh.",
    steps: {
      run: "Run the installer",
      reload: "Reload your shell",
      customize: "Make it yours",
    },
    copyInstall: "Copy install command",
    copyReload: "Copy reload command",
    reloadComment: "# or: source ~/.bashrc",
    note: "Run `bw-help` to list the modules, turn any of them off in `config.env`, and stay current with `bw-update`. Your own settings and modules live in `~/.config/bash-wizardry`, so updates never touch them.",
    configLabel: "Example config.env",
  },

  community: {
    title: "Built by developers, for developers",
    cards: {
      contribute: {
        title: "Contribute",
        description:
          "New spells, fixes and docs are welcome. Start with the guide.",
        cta: "read the guide",
      },
      issue: {
        title: "Report an issue",
        description: "Found a bug or a rough edge? Open an issue on GitHub.",
        cta: "open an issue",
      },
      star: {
        title: "Star the repo",
        description: "Stars help other developers discover the project.",
        cta: "star on github",
      },
    },
  },

  footer: {
    label: "Footer",
    tagline:
      "The developer productivity toolkit that lives in your terminal. Safe, fast and hackable.",
    columns: { product: "product", project: "project", community: "community" },
    links: {
      tour: "tour",
      spellbook: "spellbook",
      install: "install",
      source: "source code",
      releases: "releases",
      license: "MIT license",
      contributing: "contributing",
      issues: "issues",
      youtube: "youtube",
      kofi: "ko-fi",
    },
    license: "MIT License",
    builtBy: "Designed & built by",
    spells: "spells",
  },

  leads: {
    getUpdates: "get updates",
    privacy: "privacy",
    // Full English version of the package's DEFAULT_COPY_ES.
    card: {
      title: "Want to hear what's new?",
      description:
        "Leave your email and we'll only write when {product} has something new. No spam.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      consentLabel:
        "I agree to receive occasional emails with {product} news. I can unsubscribe at any time.",
      privacyLink: "Privacy policy",
      newTabHint: NEW_TAB,
      submit: "Subscribe",
      submitting: "Sending…",
      notNow: "Not now",
      close: "Close",
      detailsTitle: "Tell us a bit more?",
      detailsDescription: "It's optional and helps us decide what to improve.",
      nameLabel: "Name",
      roleLabel: "What do you do?",
      countryLabel: "Country",
      selectPlaceholder: "Prefer not to say",
      save: "Save",
      skip: "Skip",
      successTitle: "Done! We'll only write when there's news.",
      announcement: "Optional notice: you can get {product} news by email.",
      errors: {
        required: "This field is required.",
        invalid: "Check this field.",
        too_long: "This text is too long.",
        not_allowed: "This can't be sent from here.",
        rate_limited: "Too many attempts. Try again in a minute.",
        network: "We couldn't send it. Check your connection and try again.",
        server: "Something went wrong on our side. Try again later.",
        email: {
          required: "Enter your email.",
          invalid: "Check the email format.",
          too_long: "That email is too long.",
        },
        consent: {
          required: "Tick the box to continue.",
        },
      },
    } satisfies LeadCaptureCopy,
    roles: [
      { value: "diseno", label: "Design" },
      { value: "desarrollo", label: "Development" },
      { value: "producto", label: "Product" },
      { value: "marketing", label: "Marketing" },
      { value: "soporte", label: "Support" },
      { value: "educacion", label: "Education" },
      { value: "estudiante", label: "Student" },
      { value: "otro", label: "Other" },
    ] satisfies { value: RoleSlug; label: string }[],
  },

  privacy: {
    title: "Privacy policy",
    description:
      "How the optional bash-wizardry news subscription handles your data: what is stored, why, for how long, your rights and how to unsubscribe.",
    back: "back to bash-wizardry",
    otherLanguage: "español",
    navLabel: "Privacy policy",
  },
};
