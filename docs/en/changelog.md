# 🆕 What's New?

## Phase 2: Agent-Safe Core (Latest Update)

A sturdier core that works for you at the terminal and stays out of the way of AI coding agents.

### ⚠️ Breaking Changes
- **`rg` is now `rgen`** (`rails generate`), so ripgrep's `rg` is no longer shadowed.
- **`.bw-on-enter` hooks need approval:** they run only after `ws-trust` (sha256-pinned; any edit requires trusting again).
- **Colliding spells are skipped:** a spell that would shadow an installed command, builtin or keyword (e.g. `rs`, `gs` with Ghostscript, Zsh's `r`) is not loaded. `bw-help` lists them; keep any with `BW_ALLOW_OVERRIDE`.

### 🌟 New Features
- **Agent mode:** in non-interactive shells or when an agent variable is set (`CLAUDECODE`, `CODEX_SANDBOX`, `CURSOR_AGENT`, `GEMINI_CLI`, `AI_AGENT`...), nothing but `scripts/` is loaded. Control it with `BW_AGENT_MODE=auto|1|0`.
- **`bwiz` CLI:** `bwiz help [module]`, `bwiz help --json` for agents, `bwiz modules`, `bwiz version`.
- **Customize without forking:** your `config.env` and modules live in `~/.config/bash-wizardry/`; a user module named like a core one replaces it. See [Customization](customization.md).
- **Command catalog:** `catalog/commands.tsv` is the single source of truth for `bw-help`, `bwiz` and the website.
- **New website** at [bashwizardry.carlosleoncode.com](https://bashwizardry.carlosleoncode.com), in English and Spanish, with a 72-second product film.
- **Lighter install:** the installer downloads only the tool (under 1 MB instead of about 16 MB), skipping the website and the film. `BW_INSTALL_FULL=1` gets everything; `BW_REPO_URL` installs from a fork.

### 🐛 Fixes
- Confirmation prompts (`greset`, `n-clean`, `dckrprune`, `rdbreset`...) work in Zsh.
- `ws` works in Zsh and with multiple roots; the Docker container picker returns the right ID.
- `gclean` never deletes the default, current or protected branches (`BW_GIT_PROTECTED_BRANCHES`) and asks first.
- `bw-update` reloads your shell and reports failures; `djstartapp` works on macOS; completions are loaded; `docker-cleanup.sh` is executable.
- Docs and hints use the real Docker commands (`dckrexec`, `dckrlogs`, `dckrclean`).

### 🛠️ Quality
- Bats test suite for Bash and Zsh, plus CI with ShellCheck on Ubuntu and macOS.

## Phase 1: Deep Context & Workspaces

We have just implemented the core features of Phase 1, focusing on making the terminal understand where you are and what you need.

### 🌟 New Features

#### 1. Magic Workspaces (`ws`)
- **Interactive Search**: Use `fzf` to jump between your projects instantly.
- **On-Enter Hooks**: Add a `.bw-on-enter` file to any project root to automate environment setup (nvm, docker, exports).
- **Multiple Roots**: Define multiple project directories in `BW_WORKSPACE_ROOTS`.

#### 2. Auto-Discovery & Contextual Tips
- **Awareness**: When you enter a directory, the wizard detects the project type (Node, Docker, Django, Rails).
- **Subtle Hints**: Displays specialized tips about available scripts or tools for that specific context.

#### 3. Smart `.env` Switcher (`env-set`)
- **Safe Swapping**: Easily switch between `.env.staging`, `.env.production`, etc.
- **Safety Backups**: If your current `.env` has manual changes, it will be automatically backed up before swapping.

### 🛠️ Core Improvements
- **Cross-Platform Compatibility**: Enhanced `init.sh` to support older Bash versions (like macOS's default 3.2).
- **Multilingual Support**: Documentation is now available in both English and Spanish.

---
[Return to Index](README.md)
