# 🐙 Git Module

The Git module in `bash-wizardry` is designed to make version control safer and faster by using intelligent functions instead of simple aliases.

## 🚀 Key Commands

### `gup` (Sync Branch)
The ultimate synchronization command.
- **What it does:** Performs `git pull --rebase` followed by `git push`.
- **Why use it:** It maintains a linear history and saves you from typing two commands every time you want to sync your work.

### `gbd <branch_name>` (Safe Delete)
Deletes a local branch with a safety net.
- **What it does:** Asks for confirmation before running `git branch -D`.
- **Why use it:** Prevents accidental deletion of branches with unmerged work.

### `gclean` (Clean Merged Branches)
Tidy up local branches that are already merged.
- **What it does:** Fetches `origin` (with `--prune`), lists local branches merged into origin's default branch, and asks for confirmation before running `git branch -d` on them.
- **Safety:** Never deletes the default branch, the current branch, or protected branches (`main master develop dev stage staging` by default). Override the list with `BW_GIT_PROTECTED_BRANCHES` in `config.env`.

### `gundo` (Soft Undo)
Undo your last mistake.
- **What it does:** Runs `git reset --soft HEAD~1`.
- **Why use it:** It undoes the last commit but **keeps all your changes** in the staging area. Perfect for fixing a typo in a commit message or adding a forgotten file.

### `greset` (Hard Reset)
The "nuclear option" with a safety prompt.
- **What it does:** Asks for confirmation before running `git reset --hard HEAD`.
- **Why use it:** Protects you from accidentally wiping your local changes.

## 📊 Status & Logging

- **`gs`**: Compact git status (`git status -sb`).
- **`gl [N]`**: A beautiful, graphed log. Shows the last 15 commits by default.
- **`gdff`**: Standard `git diff`.

## 📦 Staging & Committing

- **`ga [files]`**: Smart add. If no files are specified, it performs `git add .`.
- **`gc "message"`**: Smart commit. If no message is provided, it opens your default editor.
- **`gca`**: Amend the last commit.

## 🌿 Branching

- **`gb`**: List all branches (local and remote).
- **`gco <branch>`**: Checkout branch (with intelligent autocompletion).
- **`gcob <new_branch>`**: Create and switch to a new branch.

---
[Back to Documentation Index](../README.md)
