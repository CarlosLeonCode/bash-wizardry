# 🚀 bash-wizardry: Next Level Planning

This document outlines the roadmap to evolve `bash-wizardry` from a collection of aliases into a truly indispensable "developer OS" within the terminal.

---

## 🔮 Vision: The "Zero-Thought" Terminal
A developer should focus on **logic**, not **syntax**. The next level of bash-wizardry will minimize the cognitive load of everyday tasks through predictive context, AI integration, and superior interactivity.

---

## 🗺️ Phase 1: Deep Context & Workspaces
*Making the terminal understand where you are and what you need.*

1.  **`ws` (Magic Workspaces):** ✅
    *   A searchable navigation tool (using `fzf`) to jump between active projects.
    *   Example: `ws my-project` instantly `cd`s into the directory and executes a "on-enter" script (e.g., starts Docker or sets Node version).
2.  **Auto-Discovery & Tips:** ✅
    *   When entering a directory, show a subtle hint about available scripts: *"Detected Next.js project. Type `nr` to see 5 available scripts."*
3.  **Smart `.env` Switcher:** ✅
    *   Manage multiple environment files elegantly. `env-set staging` swaps `.env.staging` into `.env` safely.

## 🤖 Phase 2: The Wizard's Familiar (AI Integration)
*Leveraging LLMs to debug and explain.*

1.  **`bw-fix`:**
    *   After a command fails (non-zero exit code), typing `bw-fix` captures the error and asks an AI for the solution or automatically suggests the fix.
2.  **`bw-ask`:**
    *   A direct terminal bridge to ask questions like: *"How do I find all files larger than 100MB and exclude .git?"*
3.  **`bw-explain`:**
    *   Piping a complex command into this tool will return a human-readable explanation of what it does.

## 🛠️ Phase 3: Interactive "Pro" Modules
*Upgrading existing modules with better UI/UX.*

1.  **Unified Log Tailer (`w-logs`):**
    *   A single command that tails logs from Docker, PM2, and local log files simultaneously in a split-view or color-coded stream.
2.  **Advanced Docker Wizard (`dkr-wiz`):**
    *   A full TUI (Terminal User Interface) to manage containers, view performance, and shell into them without typing IDs.
3.  **Dependency Auditor:**
    *   `n-check`: Quickly scans for outdated dependencies and provides an interactive menu to update them one-by-one with safety checks.

## 🎨 Phase 4: Extreme Personalization & UI
*Visual excellence in the terminal.*

1.  **Dynamic Prompt Integration:**
    *   A "Magic Status" line that shows: 
        *   Active Docker containers count.
        *   Database connection status.
        *   Current Node/Ruby/Python version.
2.  **FZF Everywhere:**
    *   Integrate fuzzy searching into every list-based command (branch switching, script selection, file opening).
3.  **`bw-share`:**
    *   Instantly upload a terminal snippet or command output to a private/public gist for quick debugging sessions with teammates.

---

## 📈 New Modules to Explore
- **Python/Poetry Module:** `pa` (add), `pi` (install), `pr` (run).
- **K8s Module:** Simplified `kubectl` contexts and namespace management.
- **GitOps:** Auto-generating Pull Request templates from the command line.
- **Database Module:** Quick dumps/restores for Postgres and MySQL.

---

## 🗓️ Implementation Strategy
- **Prioritize Interactivity:** Start by replacing static lists with `fzf`/`gum` menus.
- **Maintain Lean Footprint:** Ensure that even with AI and TUI features, the "cold start" of a new shell remains instantaneous.
- **Privacy First:** Any AI feature must be opt-in and support local LLMs (like Ollama).
