# 🆕 What's New?

## Phase 1: Deep Context & Workspaces (Latest Update)

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
