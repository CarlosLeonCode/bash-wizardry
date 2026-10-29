# 📂 Workspaces & Discovery

Make your terminal navigate and understand your projects like a pro.

## 🗺️ Workspaces (`ws`)

The `ws` command is your main hub for project navigation.

### Usage
- **`ws [search]`**: Type part of a project name to jump to its directory.
- **`ws` (alone)**: Opens an interactive `fzf` menu to search through all your workspaces.

### Configuration
Define your workspace roots in `config.env`:
```bash
BW_WORKSPACE_ROOTS="$HOME/Dev:$HOME/Personal"
```

### Automation Hooks (`.bw-on-enter`)
You can automate tasks upon entering a project. Simply create a file named `.bw-on-enter` in your project root. `bash-wizardry` will `source` it on every `ws` visit, but only after you trust it.
*Use it for: Setting Node versions, starting databases, or exporting env vars.*

For safety, hooks never run until trusted (a cloned repo could ship a malicious one). From the project root, run **`ws-trust`**: it shows the hook's contents and asks for confirmation. Trust is tied to the file's content, so any change to `.bw-on-enter` requires running `ws-trust` again. Trusted hooks are stored in `~/.config/bash-wizardry/trusted_hooks` (override with `BW_TRUST_FILE`).

---

## 🪄 Discovery

The Discovery module provides context-aware tips every time you enter a directory (via `ws` or `cd`).

### What it detects:
- **Node.js**: Suggests `nr` for scripts.
- **Docker**: Suggests `dckrexec`.
- **Django/Rails**: Suggests shell or database commands.

### How it works:
It scans for key files like `package.json`, `manage.py`, or `docker-compose.yml` and displays a subtle hint.

---
[Back to Documentation Index](../README.md)
