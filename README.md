# 🧙‍♂️ bash-wizardry

<p align="center">
  <img width="250" height="250" alt="bash-wizardry logo" src="https://github.com/user-attachments/assets/0ecc72f6-e94f-45f5-a0cf-a47ee32297b1" />
</p>

<p align="center">
  <b>Your terminal, with superpowers. Simple, secure, and under your control.</b><br>
  <i>Empower your productivity with intelligent shell spells.</i>
</p>

<p align="center">
  <a href="#-installation">Installation</a> •
  <a href="docs/en/README.md">English Docs</a> •
  <a href="docs/es/README.md">Documentación (ES)</a> •
  <a href="docs/en/changelog.md">What's New?</a>
</p>

---

`bash-wizardry` transforms complex commands and repetitive workflows into short, intelligent **spells**. It's not just a collection of aliases; it's a context-aware suite designed for modern developers.

## ✨ Why bash-wizardry?

- 🧠 **Context-Aware:** Commands like `ni` automatically detect if you are using `npm`, `yarn`, or `pnpm`.
- 🛡️ **Safe by Design:** Destructive operations (like `git reset` or `gbd`) include confirmation prompts.
- 📂 **Workspace Magic:** Move between projects instantly with `ws` and trigger automation hooks.
- 🚫 **Zero Black Magic:** 100% shell script based. No hidden binaries, no invasive installers.
- 🚀 **Performance First:** Lightweight and modular to keep your shell startup instantaneous.

---

## 🚀 Installation

### Simple (Recommended)
Invoke the wizard with a single command:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash
```

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
   cp ~/.bash-wizardry/config.env.example ~/.bash-wizardry/config.env
   ```
</details>

> [!TIP]
> After installation, restart your terminal or run `source ~/.zshrc` to activate the magic. For more details, see our [Full Setup Guide](docs/en/getting-started.md).

---

## 🔮 The Magic Arsenal

Our specialized modules cover every aspect of the modern developer's life.

| Module         | Core Spell | Description                                   |                                             Documentation                                              |
| :------------- | :--------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------------------: |
| **Workspaces** | `ws`       | Fast navigation & automation hooks.           |   [EN](docs/en/tools.md#📂-workspaces-ws) / [ES](docs/es/herramientas.md#📂-espacios-de-trabajo-ws)    |
| **Git**        | `gup`      | Linear history sync & safe branch management. |                  [EN](docs/en/tools.md#🐙-git) / [ES](docs/es/herramientas.md#🐙-git)                  |
| **Node.js**    | `nr`       | Manager-agnostic script execution.            |              [EN](docs/en/tools.md#📦-node-js) / [ES](docs/es/herramientas.md#📦-node-js)              |
| **Docker**     | `dkrinto`  | Interactive container shell & cleanup.        |               [EN](docs/en/tools.md#🐳-docker) / [ES](docs/es/herramientas.md#🐳-docker)               |
| **Env**        | `env-set`  | Secure environment file switcher.             | [EN](docs/en/tools.md#🌍-env-switcher) / [ES](docs/es/herramientas.md#🌍-selector-de-entornos-env-set) |

---

## 🔄 Stay Updated

The wizard is always learning. Keep your tools sharp with:

```bash
bw-update
```

---

## 🛡️ License

Distributed under the [MIT License](LICENSE). Built with ❤️ by developers, for developers.

## ☕ Support My Work

If this project brings you value, you can support me here:

[![☕ Support on Ko-fi](https://img.shields.io/badge/Support%20My%20Work%20on%20Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/carlosleoncode)

---

<p align="center">
  <a href="https://github.com/CarlosLeonCode/bash-wizardry">GitHub</a> •
  <a href="docs/en/getting-started.md">Full Documentation</a>
</p>
