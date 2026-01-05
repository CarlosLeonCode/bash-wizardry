#!/bin/bash
#
# bash-wizardry Initializer (Simple, Direct, and Compatible)
# This script loads all from bash wizardry.

# --- Robustly determine the script's directory (works in Bash & Zsh) ---
# This is the key fix. It checks which shell is running and uses the correct
# method to find the script's path.
if [ -n "$ZSH_VERSION" ]; then
    # We are in Zsh. Use Zsh's specific way to find the script's path.
    WIZARDRY_DIR=$(dirname "${(%):-%N}")
else
    # We are in Bash. Use the BASH_SOURCE variable.
    # The 'cd' and 'pwd' ensure we get a full, absolute path.
    WIZARDRY_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
fi

# --- Add 'scripts' directory to PATH ---
if [ -d "${WIZARDRY_DIR}/scripts" ]; then
    export PATH="${WIZARDRY_DIR}/scripts:${PATH}"
fi

# --- Load Configuration ---
if [ -f "${WIZARDRY_DIR}/config.env" ]; then
    source "${WIZARDRY_DIR}/config.env"
fi

# --- Load Modules ---
# Helper to check if a module should be loaded (default: true)
_bw_should_load() {
    local module_name=$(basename "$1" .sh)
    local var_name="BW_ENABLE_${module_name^^}" # Bash 4.0+ uppercasing
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

# --- Core Commands ---

bw-update() {
    echo "🧙‍♂️ Updating bash-wizardry..."
    (cd "$WIZARDRY_DIR" && git pull && source init.sh)
    echo "✨ Update complete!"
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
