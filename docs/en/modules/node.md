# 📦 Node.js Module

Manage your JavaScript projects with ease. This module automatically detects if you are using `npm`, `yarn`, or `pnpm` and uses the correct command.

## 🤖 Auto-Detection
You don't need to remember which package manager a project uses. `bash-wizardry` looks for `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` for you.

## 🚀 Key Commands

### `ni` (Install)
Installs dependencies.
- Runs `npm install`, `yarn`, or `pnpm install` depending on the project.

### `na <package>` (Add)
Adds a new dependency.
- Runs `npm install`, `yarn add`, or `pnpm add`.

### `nr [script]` (Run)
The smartest way to run scripts.
- **If no script is provided:** It shows an **interactive menu** (if `fzf` is installed) to pick a script from your `package.json`.
- **If a script is provided:** It runs it using the detected manager.

### `n-reinstall` (The 99% Fix)
When everything goes wrong with dependencies.
- **What it does:** Deletes `node_modules` and the lock file (optional), then performs a fresh install.

### `n-clean` (Housekeeping)
Recursively finds and deletes `node_modules` folders in subdirectories. Useful for saving disk space in large monorepos.

## 🛠️ Manager Shortcuts
If you want to force a specific manager:
- **`n <cmd>`**: Force npm.
- **`y <cmd>`**: Force yarn.
- **`p <cmd>`**: Force pnpm.

---
[Back to Documentation Index](../README.md)
