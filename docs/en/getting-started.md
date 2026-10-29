# 🚀 Getting Started with bash-wizardry

Welcome to the wizard's tower! `bash-wizardry` is designed to be a non-intrusive, powerful extension for your terminal.

## 🛠️ Installation

### Automatic (Recommended)
The safest way to install is using the installation script:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash
```

### Manual
1. Clone the repository to a folder of your choice (e.g., `~/.bash-wizardry`).
2. Source the `init.sh` file in your `.zshrc` or `.bashrc`:
   ```bash
   echo "source ~/.bash-wizardry/init.sh" >> ~/.zshrc
   ```

### Uninstall
Remove bash-wizardry from your shell startup files and delete `~/.bash-wizardry`:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/uninstall.sh | bash
```
Or run the copy you already have: `~/.bash-wizardry/uninstall.sh`.

- It shows what it will change and asks before doing it (`--yes` skips the question).
- Every edited file (`~/.zshrc`, `~/.bashrc`, `~/.bash_profile`) is backed up as `<file>.bw-backup.<timestamp>`.
- Your config in `~/.config/bash-wizardry/` is kept. Add `--purge` to delete it too (your `config.env`, user modules and trusted hooks):
  ```bash
  curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/uninstall.sh | bash -s -- --purge
  ```
- Open a new terminal afterwards: spells already loaded in the current one stay until it closes.

## ⚙️ Configuration

The project uses a `config.env` file in the root directory. You can enable or disable modules and set your own workspace paths.

1. Create `config.env` from the template:
   ```bash
   cp config.env.example config.env
   ```
2. Edit `config.env` to suit your needs:
   - `BW_ENABLE_GIT=true` (Enable/Disable modules)
   - `BW_WORKSPACE_ROOTS="$HOME/Dev"` (Set your project paths)

> [!TIP]
> Keep your settings out of the repo in `~/.config/bash-wizardry/config.env`: it loads after the repo's `config.env`, wins over it, and survives updates. Your own modules go in `~/.config/bash-wizardry/modules/`. See [Customization](customization.md).

## 🧙‍♂️ Basic Usage

- **`bw-help`**: Lists every spell by module (`bw-help git` for one module), plus skipped commands and your loaded user modules.
- **`bwiz`**: The command-line companion on your `PATH`: `bwiz help [--json] [module]`, `bwiz modules`, `bwiz version`.
- **`bw-update`**: Pulls the latest changes (fast-forward only) and reloads the system in your current shell. If you have local changes that block the update, it reports an error instead.
- **`ws`**: Jump between your workspaces.

## 🛡️ Safety First
Commands like `gbd` (delete branch) or `rdbreset` (reset database) will always ask for confirmation. Use them without fear!

### 🤖 AI agents and command collisions
- **Agent mode:** when the shell is non-interactive or a known agent variable (like `CLAUDECODE`) is set, `init.sh` only adds `scripts/` to your `PATH` and stops. AI coding agents never see bash-wizardry aliases, functions or hooks.
- **Collision guard:** any spell that would shadow a real command, builtin or keyword (for example `rs` vs `/usr/bin/rs`, or `r` in Zsh) is skipped at load time. `bw-help` lists the skipped names.

Settings in `config.env`:
- `BW_AGENT_MODE=auto` (`auto` detects agents, `1` always agent mode, `0` always full load)
- `BW_ALLOW_OVERRIDE="rs"` (space-separated spells allowed to shadow existing commands)

---
[Return to README](../../README.md)
