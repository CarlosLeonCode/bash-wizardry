# 🧙‍♂️ bash-wizardry

<p align="center">
<img width="250" height="250" alt="bash-wizardry logo" src="https://github.com/user-attachments/assets/0ecc72f6-e94f-45f5-a0cf-a47ee32297b1" />
</p>

### Your terminal, with superpowers. Simple, secure, and under your control.

A suite of command-line tools designed to be **simple, secure, and under your control**. `bash-wizardry` transforms long commands and repetitive workflows into short, intelligent spells without ever automatically modifying your system.

## ✨ Philosophy & Features

*   🧠 **Intelligent & Contextual:** Commands like `nr` give you an interactive menu of your scripts, and `ni` knows if your project uses `npm`, `yarn`, or `pnpm`.
*   🛡️ **Secure by Default:** Destructive operations like `git branch -D` or `git reset` now ask for confirmation, protecting you from mistakes.
*   🌐 **Unified & Simple:** Use the same command (`na`, `nr`, `n-clean`) across all your Node.js projects.
*   🚫 **No Black Magic: 100% Transparent:** No installers that modify your config files without you knowing. You have total control over the installation, which consists of just one line in your `.zshrc` or `.bashrc`.
*   🚀 **Built for Speed:** Complete workflows, like syncing a branch (`gup`) or resetting a Rails database (`rdbreset`), are reduced to a single command.

## 🚀 Installation (The Safe & Recommended Way)

You can install `bash-wizardry` with a single command that does everything for you safely.

```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash
```

### Manual Installation

If you prefer full control, follow these two steps:

**Step 1: Clone the Repository**

Choose a permanent location for the code. `~/.bash-wizardry` is a good convention.

```bash
git clone https://github.com/CarlosLeonCode/bash-wizardry.git ~/.bash-wizardry
```

**Step 2: Connect your Shell**

Open your configuration file (`~/.zshrc` for Zsh or `~/.bashrc` for Bash) and add the following line **at the end of the file**:

```bash
# ~/.zshrc or ~/.bashrc

# Load bash-wizardry
source ~/.bash-wizardry/init.sh
```

Then, **restart your terminal** and all commands will be available.

---

## ✨ A Glimpse of the Magic

Click on each module to discover some of its most powerful spells.

<details>
<summary><b>🐙 Git Module</b></summary>

| Command | Description |
| :--- | :--- |
| `gup` | **Sync your branch:** performs `pull --rebase` and then `push`. Indispensable. |
| `gclean` | Cleans your local repository by deleting branches that have already been merged. |
| `gundo` | Undoes the last commit, but keeps all changes in your files. |
| `gbd <branch>` | Deletes a local branch, **asking for confirmation**. |
| `gco` + `Tab` | Autocompletes with local **and remote** branch names. |

</details>

<details>
<summary><b>📦 Node.js Module (npm/yarn/pnpm)</b></summary>

The system automatically detects which manager to use. The same commands for all your projects!

| Command | Description |
| :--- | :--- |
| `ni` | Installs dependencies (`npm i`, `yarn`, or `pnpm i`). |
| `na <pkg>` | Adds a new dependency. |
| `nr` | **Shows an interactive menu** for you to choose which script to run. |
| `n-reinstall` | Solves 99% of dependency problems (`rm -rf node_modules` and reinstalls). |
| `p i` | Use `p`, `y`, or `n` to force the use of a specific package manager. |

</details>

<details>
<summary><b>🐳 Docker Module</b></summary>

| Command | Description |
| :--- | :--- |
| `dkrinto` | Enters a container. **Shows an interactive menu** if you don't specify an ID. |
| `dkrlogs` | Shows container logs. Also interactive. |
| `dkrclean` | Starts a **secure and interactive wizard** to clean everything (containers, images, volumes). |
| `dkrip` | Shows the IP addresses of all running containers. |

</details>

<details>
<summary><b>🚂 Backend Modules (Django & Rails)</b></summary>

| Command | Description |
| :--- | :--- |
| `djstartapp <app>`| (Django) Creates an app AND **automatically adds it to `INSTALLED_APPS`**. |
| `djshell` | (Django) Starts `shell_plus` with model auto-import if available. |
| `rdbreset` | (Rails) **Resets the entire DB:** drop, create, migrate & seed (asks for confirmation). |
| `rcs` | (Rails) Opens a console in `sandbox` mode (changes are not saved). |

</details>

---

## 🔄 Updates

When you want to update `bash-wizardry` to the latest version, simply run:

```bash
bw-update
```

Or manually:

```bash
cd ~/.bash-wizardry && git pull
```

## 🛠️ Local Development & Testing

Want to add your own magic or test changes safely?

1.  Navigate to the directory where you clone your development projects (e.g., `~/Dev/bash-wizardry`).
2.  Open a clean terminal in that location.
3.  Load the system into your current session:
    ```bash
    source init.sh
    ```
4.  Ready! Now you can test all aliases and functions. When you change code, simply run `source init.sh` again to reload.

## 🤝 Contributing

Do you have your own magic? Share it! Fork the repo, add your spell, and send a Pull Request.

## 📜 License

[MIT](LICENSE)

## ☕ Support My Work

If this project bring you value, you can support me here:

[![☕ Support on Ko-fi](https://img.shields.io/badge/Support%20My%20Work%20on%20Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/carlosleoncode)
