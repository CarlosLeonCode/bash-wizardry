# 🔮 The Wizard's Arsenal (Tools & Modules)

bash-wizardry is divided into specialized modules. Each can be enabled/disabled in `config.env`.

## 📂 Workspaces (`ws`)
*Making navigation magic.*

- **`ws [query]`**: Jump to a project directory. Interactive search with `fzf`.
- **Hooks**: Supports `.bw-on-enter` scripts in project roots.

## 📦 Node.js
*Universal JS workflow.*

- **`ni`**, **`na`**, **`nr`**: Agnostic package management (npm, yarn, pnpm).
- **`n-reinstall`**: Nukes `node_modules` and reinstalls.

## 🐙 Git
*Safe and fast history.*

- **`gup`**: The ultimate sync (`pull --rebase` + `push`).
- **`gbd`**: Safe branch deletion with prompt.
- **`gundo`**: Undo last commit softly.

## 🐳 Docker
*Interactive container management.*

- **`dkrinto`**: Shell into a container (interactive menu).
- **`dkrclean`**: Safe cleanup wizard.
- **`dkrlogs`**: Interactive log streaming.

## 🌍 Env Switcher
*Environment management.*

- **`env-set [name]`**: Safely swap `.env` files.
- **`env-ls`**: List available environments.

## 🪄 Discovery
*Contextual awareness.*

- Shows tips when entering a project (e.g., "Detected Node.js project. Type 'nr' to manage scripts.")

---
[Return to README](../README.md)
