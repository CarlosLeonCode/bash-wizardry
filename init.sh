#!/bin/bash
#
# bash-wizardry Initializer (Simple, Direct, and Compatible)
# This script loads all from bash wizardry.

# --- Robustly determine the script's directory (works in Bash & Zsh) ---
# This is the key fix. It checks which shell is running and uses the correct
# method to find the script's path.
if [ -n "$ZSH_VERSION" ]; then
    # We are in Zsh. %x is the sourced file; :A resolves it to an absolute,
    # symlink-free path and :h takes its directory.
    # shellcheck disable=SC2296,SC2298 # zsh-only expansion
    WIZARDRY_DIR=${${(%):-%x}:A:h}
else
    # We are in Bash. Use the BASH_SOURCE variable.
    # The 'cd' and 'pwd' ensure we get a full, absolute path.
    WIZARDRY_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
fi

# --- Add 'scripts' directory to PATH (idempotent on re-source) ---
if [ -d "${WIZARDRY_DIR}/scripts" ]; then
    case ":${PATH}:" in
        *":${WIZARDRY_DIR}/scripts:"*) ;;
        *) export PATH="${WIZARDRY_DIR}/scripts:${PATH}" ;;
    esac
fi

# --- Load Configuration ---
if [ -f "${WIZARDRY_DIR}/config.env" ]; then
    source "${WIZARDRY_DIR}/config.env"
fi

# --- Shared Helpers ---
# Shell-agnostic y/N confirmation. Returns 0 only on 'y' or 'Y'.
# Usage: _bw_confirm "Delete everything?" && rm -rf ...
_bw_confirm() {
    local reply
    if [ -n "$ZSH_VERSION" ]; then
        read -k 1 -r "reply?$1 [y/N] "
    else
        read -p "$1 [y/N] " -n 1 -r reply
    fi
    echo
    [[ "$reply" =~ ^[Yy]$ ]]
}

# --- Load Modules ---
# Helper to check if a module should be loaded (default: true)
_bw_should_load() {
    local module_name=$(basename "$1" .sh)
    local var_name="BW_ENABLE_$(echo "$module_name" | tr '[:lower:]' '[:upper:]')"
    if [ -z "${!var_name}" ]; then
        # If variable is unset, default to true
        return 0
    elif [ "${!var_name}" == "true" ]; then
        return 0
    else
        return 1
    fi
}

# Fallback for Zsh or older Bash upper-casing
if [ -n "$ZSH_VERSION" ]; then
    _bw_should_load() {
        local module_name=$(basename "$1" .sh)
        local var_name="BW_ENABLE_${module_name:u}" # Zsh uppercasing
        # shellcheck disable=SC2296 # zsh-only expansion
        local val=${(P)var_name}
        if [ -z "$val" ] || [ "$val" = "true" ]; then
             return 0
        else
             return 1
        fi
    }
fi

if [ -d "${WIZARDRY_DIR}/modules" ]; then
    for module_file in "${WIZARDRY_DIR}"/modules/*.sh; do
        if [ -r "$module_file" ]; then
            if _bw_should_load "$module_file"; then
                source "$module_file"
            fi
        fi
    done
fi

# --- Load Completions ---
# Completions use the 'complete' builtin: always present in Bash, and in Zsh
# only when the user has enabled bashcompinit. We never enable it ourselves.
if [ -d "${WIZARDRY_DIR}/completions" ] && type complete >/dev/null 2>&1; then
    for completion_file in "${WIZARDRY_DIR}"/completions/*.sh; do
        [ -r "$completion_file" ] || continue
        # Only load completions for enabled modules (git_completions.sh -> git.sh).
        completion_module=$(basename "$completion_file" _completions.sh)
        if _bw_should_load "${completion_module}.sh"; then
            source "$completion_file"
        fi
    done
    unset completion_file completion_module
fi

# --- Core Commands ---

bw-update() {
    echo "🧙‍♂️ Updating bash-wizardry..."
    if git -C "$WIZARDRY_DIR" pull --ff-only; then
        # Reload in the current shell so new functions take effect immediately.
        source "$WIZARDRY_DIR/init.sh"
        echo "✨ Update complete!"
    else
        echo "Error: update failed. Check for local changes or diverged history in '$WIZARDRY_DIR'." >&2
        return 1
    fi
}

bw-help() {
    echo "🧙‍♂️ bash-wizardry Help"
    echo "----------------------"
    echo "Available Modules:"
    ls "$WIZARDRY_DIR/modules" | sed 's/\.sh//g' | xargs -n1 echo "  -"
    echo ""
    echo "Run specific commands with --help or check the README for details."
    echo "Repo: https://github.com/CarlosLeonCode/bash-wizardry"
}
