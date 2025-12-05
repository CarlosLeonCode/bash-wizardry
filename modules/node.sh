#!/bin/bash
#
# Node.js Ecosystem Module for bash-wizardry
#
# This module provides a unified and intelligent interface for managing Node.js
# projects. It automatically detects the package manager (pnpm, yarn, npm)
# in use and adapts the commands, allowing you to use the same alias
# across all your projects.

# -----------------------------------------------------------------------------
#  PACKAGE MANAGER AUTO-DETECTION
# -----------------------------------------------------------------------------

# Internal function to determine the package manager for the current project.
# It checks for lockfiles in the recommended order of preference: pnpm > yarn > npm.
# Usage: local pm=$(_n_get_manager)
_n_get_manager() {
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
  else
    # Default to npm if no other lockfile is found.
    echo "npm"
  fi
}

# -----------------------------------------------------------------------------
#  UNIFIED, PACKAGE-MANAGER-AGNOSTIC COMMANDS
# -----------------------------------------------------------------------------

# Install dependencies.
# Usage: ni
unalias ni &>/dev/null
unset -f ni &> /dev/null
ni() {
  local pm=$(_n_get_manager)
  echo "-> Using '$pm' to install dependencies..."
  $pm install
}

# Add a new dependency.
# Usage: na <package_name>
unalias na &>/dev/null
unset -f na &> /dev/null
na() {
  local pm=$(_n_get_manager)
  echo "-> Using '$pm' to add '$1'..."
  if [ "$pm" = "npm" ]; then
    $pm install "$@"
  else
    $pm add "$@"
  fi
}

# Add a new dev dependency.
# Usage: nad <package_name>
unalias nad &>/dev/null
unset -f nad &> /dev/null
nad() {
  local pm=$(_n_get_manager)
  echo "-> Using '$pm' to add '$1' as a dev dependency..."
  if [ "$pm" = "npm" ]; then
    $pm install --save-dev "$@"
  else
    $pm add --dev "$@"
  fi
}

# Remove a dependency.
# Usage: nrm <package_name>
unalias nrm &>/dev/null
unset -f nrm &> /dev/null
nrm() {
  local pm=$(_n_get_manager)
  echo "-> Using '$pm' to remove '$1'..."
  if [ "$pm" = "yarn" ]; then
    $pm remove "$@"
  else
    $pm uninstall "$@"
  fi
}

# Run a script from package.json.
# This function is smarter and provides an interactive menu if no script is specified.
# Usage: nr [script_name] [args] | nr
unalias nr &>/dev/null
unset -f nr &> /dev/null
nr() {
  if [ -z "$1" ]; then
    # Interactive mode if no script name is provided
    local scripts=$(jq -r '.scripts | keys[]' package.json)
    if [ -z "$scripts" ]; then
        echo "No scripts found in package.json." >&2
        return 1
    fi
    echo "Please select a script to run:"
    select script in $scripts; do
      if [ -n "$script" ]; then
        nr "$script"
        return 0
      else
        echo "Invalid selection." >&2
        return 1
      fi
    done
  else
    local pm=$(_n_get_manager)
    echo "-> Using '$pm' to run '$1'..."
    $pm run "$@"
  fi
}

# Short aliases for the most common scripts.
alias nrs='nr start'
alias nrb='nr build'
alias nrtst='nr test'
alias nrd='nr dev'

# Upgrade dependencies (interactive for yarn/pnpm, outdated for npm).
# Usage: nup
unalias nup &>/dev/null
unset -f nup &> /dev/null
nup() {
  local pm=$(_n_get_manager)
  echo "-> Using '$pm' to handle upgrades..."
  case "$pm" in
    "yarn") yarn upgrade-interactive ;;
    "pnpm") pnpm update -i ;;
    "npm") npm outdated # npm update is less safe, so we just show what's outdated
  esac
}

# -----------------------------------------------------------------------------
#  UTILITY & CLEANUP FUNCTIONS
# -----------------------------------------------------------------------------

# A powerful command to completely clean the project workspace.
# Removes node_modules and all lockfiles.
# Usage: n-clean
unalias n-clean &>/dev/null
unset -f n-clean &> /dev/null
n-clean() {
  read -p "This will remove node_modules/ and lockfiles. Are you sure? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf node_modules
    rm -f package-lock.json yarn.lock pnpm-lock.yaml
    echo "Project workspace cleaned."
  fi
}

# A shortcut for a clean reinstall, a common troubleshooting step.
# Usage: n-reinstall
n-reinstall() {
  n-clean && ni
}

# An inspector to find out why a package is installed.
# Usage: n-why <package_name>
unalias n-why &>/dev/null
unset -f n-why &> /dev/null
n-why() {
    local pm=$(_n_get_manager)
    if [ "$pm" = "npm" ]; then
        $pm ls "$1"
    else
        $pm why "$1"
    fi
}

# Global package management (these don't need detection).
alias nrlsg='npm list -g --depth=0'
alias nrig='npm install -g'
alias nrug='npm uninstall -g'

# -----------------------------------------------------------------------------
#  EXPLICIT PACKAGE MANAGER ALIASES (MANUAL OVERRIDE)
# -----------------------------------------------------------------------------

# Short aliases for direct access to a specific package manager,
# bypassing the auto-detection logic. Use these when you need to
# explicitly control which manager is used.
alias n='npm'
alias y='yarn'
alias p='pnpm'
