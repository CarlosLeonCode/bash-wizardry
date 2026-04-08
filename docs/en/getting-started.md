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

## ⚙️ Configuration

The project uses a `config.env` file in the root directory. You can enable or disable modules and set your own workspace paths.

1. Create `config.env` from the template:
   ```bash
   cp config.env.example config.env
   ```
2. Edit `config.env` to suit your needs:
   - `BW_ENABLE_GIT=true` (Enable/Disable modules)
   - `BW_WORKSPACE_ROOTS="$HOME/Dev"` (Set your project paths)

## 🧙‍♂️ Basic Usage

- **`bw-help`**: Shows available modules and general help.
- **`bw-update`**: Pulls the latest changes and reloads the system.
- **`ws`**: Jump between your workspaces.

## 🛡️ Safety First
Commands like `gbd` (delete branch) or `rdbreset` (reset database) will always ask for confirmation. Use them without fear!

---
[Return to README](../../README.md)
