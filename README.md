# 🧙‍♂️ bash-wizardry

<p align="center">
  <img width="250" height="250" alt="bash-wizardry logo" src="https://github.com/user-attachments/assets/0ecc72f6-e94f-45f5-a0cf-a47ee32297b1" />
</p>

<p align="center">
  <b>Your terminal, with superpowers. Simple, secure, and under your control.</b><br>
  <i>Empower your productivity with intelligent shell spells.</i>
</p>

<p align="center">
  <a href="https://github.com/CarlosLeonCode/bash-wizardry/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/CarlosLeonCode/bash-wizardry/actions/workflows/ci.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/CarlosLeonCode/bash-wizardry"></a>
</p>

<p align="center">
  <a href="https://bashwizardry.carlosleoncode.com">Website</a> •
  <a href="#-installation">Installation</a> •
  <a href="docs/en/README.md">English Docs</a> •
  <a href="docs/es/README.md">Documentación (ES)</a> •
  <a href="docs/en/changelog.md">What's New?</a>
</p>

---

`bash-wizardry` transforms complex commands and repetitive workflows into short, intelligent **spells**. It's not just a collection of aliases; it's a context-aware suite designed for modern developers.

▶️ **Watch the 72-second film on [bashwizardry.carlosleoncode.com](https://bashwizardry.carlosleoncode.com)** ([en español](https://bashwizardry.carlosleoncode.com/es)).

## ✨ Why bash-wizardry?

- 🧠 **Context-Aware:** Commands like `ni` automatically detect if you are using `npm`, `yarn`, or `pnpm`.
- 🛡️ **Safe by Design:** Destructive operations (like `greset`, `gbd` or `gclean`) ask first, in Bash and Zsh. `gclean` never deletes your default, current or protected branches.
- 📂 **Workspace Magic:** Move between projects instantly with `ws`. A project's `.bw-on-enter` hook runs only after you review and approve it with `ws-trust`.
- 🤖 **Agent-Safe:** Invisible to AI coding agents and never shadows a real command ([details](#-works-alongside-ai-agents)).
- 🚫 **Zero Black Magic:** 100% shell script based. No hidden binaries, no invasive installers.
- 🚀 **Performance First:** Lightweight and modular to keep your shell startup instantaneous.

---

## 🚀 Installation

### Simple (Recommended)
Invoke the wizard with a single command:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash
```
The installer downloads only the tool (under 1 MB on disk instead of about 16 MB), not the website or the film. Set `BW_INSTALL_FULL=1` to get the whole repository, or `BW_REPO_URL` to install from your fork (e.g. `curl ... | BW_INSTALL_FULL=1 bash`).

<details>
<summary><b>Manual Installation (For Power Users)</b></summary>

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CarlosLeonCode/bash-wizardry.git ~/.bash-wizardry
   ```
2. **Source the initializer:**
   Add this line to the end of your `~/.zshrc` or `~/.bashrc`:
   ```bash
   source ~/.bash-wizardry/init.sh
   ```
3. **Configure your spells (Optional):**
   ```bash
   mkdir -p ~/.config/bash-wizardry
   cp ~/.bash-wizardry/config.env.example ~/.config/bash-wizardry/config.env
   ```
</details>

> [!TIP]
> After installation, restart your terminal or run `source ~/.zshrc` to activate the magic. For more details, see our [Full Setup Guide](docs/en/getting-started.md).

### Uninstall
The uninstaller removes the lines it added to your shell startup files (keeping a backup) and deletes `~/.bash-wizardry`. It asks before changing anything:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/uninstall.sh | bash
# or, from your install:
~/.bash-wizardry/uninstall.sh
```
Your config in `~/.config/bash-wizardry/` is kept; add `--purge` to delete it too (with curl: `| bash -s -- --purge`). Details in the [Setup Guide](docs/en/getting-started.md#uninstall).

---

## 🔮 The Magic Arsenal

Our specialized modules cover every aspect of the modern developer's life.

| Module         | Core Spell | Description                                   |                                             Documentation                                              |
| :------------- | :--------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------------------: |
| **Workspaces** | `ws`       | Fast navigation & automation hooks.           |   [EN](docs/en/tools.md#📂-workspaces-ws) / [ES](docs/es/herramientas.md#📂-espacios-de-trabajo-ws)    |
| **Git**        | `gup`      | Linear history sync & safe branch management. |                  [EN](docs/en/tools.md#🐙-git) / [ES](docs/es/herramientas.md#🐙-git)                  |
| **Node.js**    | `nr`       | Manager-agnostic script execution.            |              [EN](docs/en/tools.md#📦-node-js) / [ES](docs/es/herramientas.md#📦-node-js)              |
| **Docker**     | `dckrexec`  | Interactive container shell & cleanup.        |               [EN](docs/en/tools.md#🐳-docker) / [ES](docs/es/herramientas.md#🐳-docker)               |
| **Env**        | `env-set`  | Secure environment file switcher.             | [EN](docs/en/tools.md#🌍-env-switcher) / [ES](docs/es/herramientas.md#🌍-selector-de-entornos-env-set) |

---

## 🎛️ Make it yours

Customize without forking: your `config.env` and your own modules live in `~/.config/bash-wizardry/`, so updates never touch them. A user module named like a core one (for example `git.sh`) replaces it. See the [Customization guide](docs/en/customization.md) ([ES](docs/es/personalizacion.md)).

---

## 🤖 Works alongside AI agents

AI coding agents (Claude Code, Codex, Cursor, Gemini CLI...) often run their commands through your shell setup. bash-wizardry stays out of their way:

- **Agent mode:** in non-interactive shells, or when a known agent variable such as `CLAUDECODE` is set, `init.sh` only adds `scripts/` to your `PATH`. No aliases, functions, hooks or completions are defined. Control it with `BW_AGENT_MODE=auto|1|0`.
- **Collision guard:** a spell is skipped if it would shadow a real command, builtin or keyword (for example `rs` vs `/usr/bin/rs`, or `r` in Zsh). That is also why `rails generate` is `rgen`, so ripgrep's `rg` keeps working. Run `bw-help` to see what was skipped.
- **Your call:** keep a skipped spell with `BW_ALLOW_OVERRIDE="rs r"` in `config.env`.
- **Machine-readable spellbook:** `bwiz` stays on your `PATH` even in agent mode. Agents can run `bwiz help --json` (or `bwiz help --json git`) to get every spell as JSON (`module`, `name`, `kind`, `usage`, `description`, `enabled`), generated from `catalog/commands.tsv`.

---

## 🔄 Stay Updated

The wizard is always learning. Keep your tools sharp with:

```bash
bw-update
```

> [!IMPORTANT]
> **Upgrading from an earlier version?**
> - `rails generate` moved from `rg` to `rgen`, so ripgrep's `rg` works again.
> - Existing `.bw-on-enter` hooks no longer run until you approve them once with `ws-trust` (and again after any edit).
> - Spells that would shadow a tool you have installed (e.g. `gs` with Ghostscript, `gm` with GraphicsMagick, `n` with the `n` version manager) are skipped. `bw-help` lists them; bring them back with `BW_ALLOW_OVERRIDE`.
> - The previous `bw-update` didn't reload your shell: after this first update, open a new terminal.
>
> Full list in [What's New?](docs/en/changelog.md).

---

## 🧪 Development

```bash
bats tests/                    # shell test suite (Bash and Zsh)
bash tools/gen-catalog.sh      # regenerate the site's catalog after editing catalog/*.tsv
npm --prefix web run dev       # landing site (Next.js) on localhost:3000
npm --prefix video run studio  # product film (Remotion)
```

CI runs ShellCheck and the bats suite on Ubuntu and macOS. See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## 🤝 Community

- [Contributing](CONTRIBUTING.md): how to add spells and open a pull request.
- [Code of Conduct](CODE_OF_CONDUCT.md): be kind; we follow the Contributor Covenant.
- [Security policy](SECURITY.md): please report vulnerabilities privately, not in public issues.
- [Changelog](CHANGELOG.md) and [Roadmap](docs/roadmap.md).

## 🛡️ License

Distributed under the [MIT License](LICENSE). Built with ❤️ by developers, for developers.

## ☕ Support My Work

If this project brings you value, you can support me here:

[![☕ Support on Ko-fi](https://img.shields.io/badge/Support%20My%20Work%20on%20Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/carlosleoncode)

---

<p align="center">
  <a href="https://bashwizardry.carlosleoncode.com">Website</a> •
  <a href="https://github.com/CarlosLeonCode/bash-wizardry">GitHub</a> •
  <a href="docs/en/getting-started.md">Full Documentation</a> •
  <a href="https://www.youtube.com/@carlosleoncode">YouTube</a>
</p>
<p align="center"><sub>Designed &amp; built by <a href="https://carlosleoncode.com">carlosleoncode</a></sub></p>
