#!/bin/bash
#
# Git Module for bash-wizardry
#
# This module provides a set of powerful functions and aliases to streamline
# your Git workflow. It favors functions over simple aliases to add logic,
# context-awareness, and safety checks.

# -----------------------------------------------------------------------------
#  STATUS & LOGGING
# -----------------------------------------------------------------------------

# Shows a compact, decorated, and graphed log.
# Usage: gl [number_of_commits]
gl() {
  local count=${1:-15} # Default to showing the last 15 commits
  git log --oneline --graph --decorate --color=always -n "$count"
}

# Simple, common aliases that don't need function logic.
alias gs='git status -sb' # A more useful, short branch status
alias gdff='git diff'
alias gfetch='git fetch --all --prune --jobs=10'

# -----------------------------------------------------------------------------
#  STAGING & COMMITTING
# -----------------------------------------------------------------------------

# Adds files to the staging area. Defaults to all files if no args are passed.
# This function unifies 'ga' and 'gaa' into a single, smarter command.
# Usage: ga [file1] [file2] | ga
ga() {
  if [ $# -eq 0 ]; then
    git add .
  else
    git add "$@"
  fi
}
alias gaa='ga' # Keep alias for muscle memory

# Commits staged changes. If no message is provided, opens the editor.
# This promotes writing better, more detailed commit messages.
# Usage: gc "Your commit message" | gc
gc() {
  if [ -z "$1" ]; then
    git commit
  else
    git commit -m "$1"
  fi
}

alias gca='git commit --amend'
alias grstr='git restore'
alias grm='git rm'

# -----------------------------------------------------------------------------
#  BRANCHING & CHECKOUT
# -----------------------------------------------------------------------------

# Checks out a branch or creates a new one.
# Usage: gco <branch_name> | gco -b <new_branch_name>
alias gco='git checkout'
alias gcob='git checkout -b'

# Lists all local and remote branches.
alias gb='git branch -a'

# Deletes a branch locally with a confirmation prompt.
# This adds a safety layer to a destructive operation.
# Usage: gbd <branch_name>
gbd() {
  if [ -z "$1" ]; then
    echo "Error: Branch name must be provided." >&2
    return 1
  fi
  read -p "Are you sure you want to force-delete branch '$1'? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git branch -D "$1"
  fi
}

# -----------------------------------------------------------------------------
#  REMOTE OPERATIONS (PUSH, PULL, SYNC)
# -----------------------------------------------------------------------------

# Pushes changes. If no args are provided, it pushes the current branch to its
# configured upstream. This is the most common push scenario.
# Usage: gp | gp origin main
gp() {
  if [ $# -eq 0 ]; then
    # Push the current branch to its upstream remote branch
    git push
  else
    git push "$@"
  fi
}

alias gpo='git push origin'
alias gplo='git pull origin'

# A powerful new function to sync your branch.
# It pulls with rebase to maintain a linear history and then pushes.
# Usage: gup
gup() {
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    echo "Syncing branch '$current_branch'..."
    git pull --rebase && git push
}

# -----------------------------------------------------------------------------
#  MERGE & REBASE
# -----------------------------------------------------------------------------

alias gm='git merge'
alias gmc='git merge --continue'
alias gma='git merge --abort'
alias grbi='git rebase -i'
alias grbc='git rebase --continue'
alias grba='git rebase --abort'
alias gchrr='git cherry-pick'

# -----------------------------------------------------------------------------
#  HISTORY & UTILITY
# -----------------------------------------------------------------------------

# Stash operations remain as simple aliases.
alias gstash='git stash'
alias gstashp='git stash pop'

# Resets the current HEAD to the last commit with a confirmation prompt.
# Adds a crucial safety check to a highly destructive command.
# Usage: greset
greset() {
  read -p "Are you sure you want to discard all local changes? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git reset --hard HEAD
  fi
}

# A function to undo the last commit, keeping the changes in the working directory.
# Usage: gundo
gundo() {
  git reset --soft HEAD~1
}

# A function to clean up local branches that have been merged into main/master.
# Usage: gclean
gclean() {
    echo "Fetching latest state from origin..."
    git fetch origin
    local default_branch=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)
    echo "Cleaning branches merged into origin/$default_branch..."
    git branch --merged "origin/$default_branch" | grep -v "\* $default_branch" | xargs -r git branch -d
}
