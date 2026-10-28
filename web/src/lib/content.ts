// Site copy and data. Every command and output line here mirrors the real
// scripts in the repository root (init.sh, modules/*.sh, scripts/).

export const REPO_URL = "https://github.com/CarlosLeonCode/bash-wizardry";
export const SITE_URL = "https://bashwizardry.com";
export const INSTALL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash";

/* -------------------------------------------------------------------------- */
/*  Terminal demos                                                            */
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

export const heroSession: TerminalSession = {
  title: "zsh — ~/Dev",
  label:
    "Terminal demo: running 'ws api' jumps into the api workspace, then the wizard detects a Node.js and Docker project and suggests 'nr' and 'dckrexec'.",
  steps: [
    {
      cmd: "ws api",
      cwd: "~/Dev",
      output: [
        { text: "✨ Entered workspace: api", tone: "success" },
        ...wizardTips(
          "Detected Node.js project. Type 'nr' to manage scripts.",
          "Detected Docker environment. Type 'dckrexec' to jump into a container.",
        ),
      ],
    },
  ],
  finalCwd: "~/Dev/api",
};

export interface Showcase {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  commands: string[];
  session: TerminalSession;
}

export const showcases: Showcase[] = [
  {
    id: "workspaces",
    eyebrow: "Magic Workspaces",
    title: "Jump to any project. Run only the hooks you trust.",
    description:
      "`ws` searches every directory in BW_WORKSPACE_ROOTS: exact match first, fuzzy match next, or an fzf picker when you type nothing. Projects can ship a `.bw-on-enter` hook to set up their environment on arrival.",
    points: [
      "Hooks never run until you review and approve them with ws-trust.",
      "Trust is pinned to a sha256 of the file: any edit requires re-trusting.",
    ],
    commands: ["ws", "ws-trust"],
    session: {
      title: "zsh — workspaces",
      label:
        "Terminal demo: 'ws api' enters the api workspace and warns that its .bw-on-enter hook is untrusted. 'ws-trust' prints the hook and asks for confirmation, then trusts it. The next 'ws api' runs the trusted workspace hook.",
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
  {
    id: "discovery",
    eyebrow: "Contextual Discovery",
    title: "The wizard reads the room.",
    description:
      "On every directory change in Zsh (and after every `ws` jump), bash-wizardry looks for package.json, Docker files, manage.py and a Rails Gemfile, then prints the spells that fit that project.",
    points: [
      "Node → nr, Docker → dckrexec, Django → djshell, Rails → rcs.",
      "Stays silent in your home directory and in projects it does not recognize.",
    ],
    commands: ["nr", "dckrexec", "djshell", "rcs"],
    session: {
      title: "zsh — discovery",
      label:
        "Terminal demo: changing into a project directory prints Wizard Tips suggesting 'nr' for Node.js scripts, 'dckrexec' for Docker containers and 'rcs' for the Rails console.",
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
  {
    id: "env",
    eyebrow: "Env Switcher",
    title: "Swap .env files without losing your edits.",
    description:
      "`env-ls` lists every .env.<name> file and marks the active one. `env-set` swaps one into place (or opens an fzf picker) and backs up a hand-edited .env before overwriting it.",
    points: [
      "Custom .env files are saved as .env.backup.<timestamp>.",
      "Works in any project: Node, Rails, Django, Docker Compose.",
    ],
    commands: ["env-ls", "env-set"],
    session: {
      title: "zsh — env",
      label:
        "Terminal demo: 'env-ls' lists the local, production and staging environment files. 'env-set production' backs up the custom .env to a timestamped file and sets the environment to production.",
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
  {
    id: "node",
    eyebrow: "Node.js",
    title: "One set of commands for npm, yarn and pnpm.",
    description:
      "bash-wizardry reads the lockfile (pnpm > yarn > npm) and runs the right package manager for you. `nr` without arguments opens a menu of your package.json scripts.",
    points: [
      "ni, na, nad, nrm, nup behave the same in every project.",
      "n-reinstall wipes node_modules and lockfiles (after confirming) and reinstalls.",
    ],
    commands: ["ni", "na", "nr", "n-reinstall"],
    session: {
      title: "zsh — node",
      label:
        "Terminal demo: 'nr' shows a numbered menu of package.json scripts (build, dev, lint); choosing dev runs it with pnpm.",
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
  {
    id: "git",
    eyebrow: "Git",
    title: "Fast Git, with guardrails.",
    description:
      "`gup` pulls with rebase and pushes in one go. `gclean` deletes branches already merged into origin's default branch, but never the default branch, your current branch, or anything in BW_GIT_PROTECTED_BRANCHES, and it always asks first.",
    points: [
      "greset and gbd confirm before discarding anything.",
      "gundo is a soft reset: the commit goes, your changes stay.",
    ],
    commands: ["gup", "gclean", "gundo"],
    session: {
      title: "zsh — git",
      label:
        "Terminal demo: 'gclean' fetches from origin, lists two branches merged into origin/main, asks for confirmation and deletes them.",
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
];

/* -------------------------------------------------------------------------- */
/*  Principles grid                                                           */
/* -------------------------------------------------------------------------- */

export interface Feature {
  icon: string;
  title: string;
  description: string;
  command?: string;
}

export const features: Feature[] = [
  {
    icon: "🛡️",
    title: "Safety first",
    description:
      "Destructive spells like greset, gbd, gclean, rdbreset, djflushmigrations and dckrprune ask for confirmation, in both Bash and Zsh.",
    command: "greset",
  },
  {
    icon: "🔐",
    title: "Trusted hooks only",
    description:
      "A .bw-on-enter hook runs only after you approve it with ws-trust. Approvals are pinned to the file's sha256, so edits need a fresh review.",
    command: "ws-trust",
  },
  {
    icon: "🐳",
    title: "Interactive Docker",
    description:
      "Pick a container from a menu for exec, logs, stop, start, restart or rm. dckrclean asks before pruning each resource type.",
    command: "dckrexec",
  },
  {
    icon: "📦",
    title: "Manager-agnostic Node",
    description:
      "The lockfile decides: pnpm, yarn or npm. Your fingers only need ni, na, nr and friends.",
    command: "nr",
  },
  {
    icon: "🤖",
    title: "Agent-safe by default",
    description:
      "Invisible to AI coding agents: in non-interactive or agent shells only scripts/ joins your PATH. And no spell ever shadows a real command, builtin or keyword.",
    command: "bw-help",
  },
  {
    icon: "⚡",
    title: "Pure shell",
    description:
      "Readable Bash and Zsh scripts. No binaries, no daemons, nothing running in the background.",
  },
  {
    icon: "🎛️",
    title: "Modular by design",
    description:
      "Toggle any module with BW_ENABLE_<MODULE>=true|false in config.env. bw-update fast-forwards and reloads in place.",
    command: "bw-update",
  },
];

/* -------------------------------------------------------------------------- */
/*  Spellbook (command reference)                                             */
/* -------------------------------------------------------------------------- */

export interface Spell {
  cmd: string;
  description: string;
  /** True when the command asks for confirmation before acting. */
  confirms?: boolean;
}

export interface SpellGroup {
  title?: string;
  spells: Spell[];
}

export interface SpellbookModule {
  id: string;
  label: string;
  summary: string;
  groups: SpellGroup[];
}

export const spellbook: SpellbookModule[] = [
  {
    id: "git",
    label: "Git",
    summary:
      "Everyday Git, shorter, with confirmation on anything destructive.",
    groups: [
      {
        spells: [
          { cmd: "gs", description: "Short status with branch info." },
          {
            cmd: "gl [n]",
            description: "Compact graph log (last 15 commits by default).",
          },
          {
            cmd: "ga",
            description: "Stage files (everything when no path is given).",
          },
          {
            cmd: "gc [msg]",
            description: "Commit with a message, or open your editor.",
          },
          { cmd: "gco", description: "Checkout a branch or path." },
          { cmd: "gcob", description: "Create and switch to a new branch." },
          { cmd: "gbd", description: "Delete a branch.", confirms: true },
          {
            cmd: "gp",
            description: "Push the current branch to its upstream.",
          },
          { cmd: "gup", description: "Sync: pull --rebase, then push." },
          {
            cmd: "gundo",
            description: "Undo the last commit, keep the changes (soft reset).",
          },
          {
            cmd: "greset",
            description: "Discard all local changes (hard reset).",
            confirms: true,
          },
          {
            cmd: "gclean",
            description:
              "Delete merged branches; never default, current or BW_GIT_PROTECTED_BRANCHES.",
            confirms: true,
          },
        ],
      },
    ],
  },
  {
    id: "node",
    label: "Node",
    summary: "Auto-detects pnpm > yarn > npm from the lockfile.",
    groups: [
      {
        spells: [
          { cmd: "ni", description: "Install dependencies." },
          { cmd: "na <pkg>", description: "Add a dependency." },
          { cmd: "nad <pkg>", description: "Add a dev dependency." },
          { cmd: "nrm <pkg>", description: "Remove a dependency." },
          {
            cmd: "nr [script]",
            description: "Run a script, or pick one from a menu (needs jq).",
          },
          {
            cmd: "nup",
            description: "Interactive upgrades (yarn/pnpm) or npm outdated.",
          },
          {
            cmd: "n-clean",
            description: "Remove node_modules and lockfiles.",
            confirms: true,
          },
          {
            cmd: "n-reinstall",
            description: "n-clean followed by a fresh install.",
            confirms: true,
          },
          {
            cmd: "n-why <pkg>",
            description: "Explain why a package is installed.",
          },
        ],
      },
    ],
  },
  {
    id: "docker",
    label: "Docker",
    summary: "Interactive container picker whenever you omit the container ID.",
    groups: [
      {
        spells: [
          {
            cmd: "dckrexec",
            description: "Open a shell (or run a command) in a container.",
          },
          { cmd: "dckrlogs", description: "Follow a container's logs." },
          {
            cmd: "dckrstop / dckrstart",
            description: "Stop or start a container.",
          },
          {
            cmd: "dckrrestart / dckrrm",
            description: "Restart or remove a container.",
          },
          {
            cmd: "dckrclean",
            description:
              "Prune containers, images and volumes, one prompt each.",
            confirms: true,
          },
          {
            cmd: "dckrprune",
            description: "docker system prune -a.",
            confirms: true,
          },
          {
            cmd: "dckrip",
            description: "List the IP of every running container.",
          },
          {
            cmd: "dckrbuild [tag]",
            description:
              "Build the current directory (defaults to <dir>:latest).",
          },
          {
            cmd: "dckrup / dckrdown",
            description: "docker-compose up -d / down.",
          },
          {
            cmd: "docker-cleanup.sh",
            description: "Standalone cleanup script, available on your PATH.",
          },
        ],
      },
    ],
  },
  {
    id: "rails",
    label: "Rails & Ruby",
    summary:
      "Rails shortcuts plus Ruby helpers that work with asdf, rbenv or rvm.",
    groups: [
      {
        title: "Rails",
        spells: [
          { cmd: "rc", description: "Rails console." },
          { cmd: "rcs", description: "Rails console in sandbox mode." },
          {
            cmd: "rs",
            description:
              "Rails server (skipped where an rs command exists, like macOS).",
          },
          {
            cmd: "rgen",
            description:
              "rails generate (renamed from rg so ripgrep keeps working).",
          },
          { cmd: "rdbm", description: "Run pending migrations." },
          {
            cmd: "rdbd / rdbreset",
            description: "Drop or reset the database.",
            confirms: true,
          },
          { cmd: "rrts <pattern>", description: "Search routes." },
          {
            cmd: "rlog [env]",
            description: "Tail the log for an environment.",
          },
        ],
      },
      {
        title: "Ruby",
        spells: [
          { cmd: "bi", description: "bundle install." },
          { cmd: "be", description: "bundle exec." },
          {
            cmd: "btest",
            description: "Run rspec or rails test, whichever the project uses.",
          },
          { cmd: "rb-v", description: "List installed Ruby versions." },
          {
            cmd: "rb-glo / rb-lcl",
            description: "Set the global or local Ruby version.",
          },
          {
            cmd: "rb-info",
            description: "Show Ruby, Bundler and RubyGems versions.",
          },
        ],
      },
    ],
  },
  {
    id: "django",
    label: "Django",
    summary: "manage.py without the typing.",
    groups: [
      {
        spells: [
          { cmd: "djm", description: "python manage.py." },
          { cmd: "djrs [port]", description: "Run the development server." },
          {
            cmd: "djmm [app] [name]",
            description:
              "makemigrations, optionally for one app and with a name.",
          },
          { cmd: "djdbm", description: "migrate." },
          {
            cmd: "djt [label]",
            description: "Run the test suite or a single test label.",
          },
          {
            cmd: "djshell",
            description: "shell_plus when available, shell otherwise.",
          },
          {
            cmd: "djstartapp <name>",
            description: "Create an app and add it to INSTALLED_APPS.",
          },
          {
            cmd: "djflushmigrations <app>",
            description: "Delete an app's migration files (keeps __init__.py).",
            confirms: true,
          },
        ],
      },
    ],
  },
  {
    id: "workspaces",
    label: "Workspaces & Env",
    summary: "Navigation, environment files and the core commands.",
    groups: [
      {
        title: "Workspaces",
        spells: [
          {
            cmd: "ws [name]",
            description:
              "Jump to a project in BW_WORKSPACE_ROOTS (exact, fuzzy or fzf).",
          },
          {
            cmd: "ws-trust",
            description: "Review and approve the current .bw-on-enter hook.",
            confirms: true,
          },
        ],
      },
      {
        title: "Env",
        spells: [
          {
            cmd: "env-ls",
            description: "List .env.<name> files and mark the active one.",
          },
          {
            cmd: "env-set [name]",
            description: "Swap a file into .env (fzf picker without a name).",
          },
        ],
      },
      {
        title: "Core",
        spells: [
          {
            cmd: "bw-update",
            description: "Fast-forward pull and reload in the current shell.",
          },
          { cmd: "bw-help", description: "List the installed modules." },
        ],
      },
    ],
  },
];
