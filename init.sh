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

# --- Load all modules ---
# This loop is safe and will not produce errors if the directory is empty.
if [ -d "${WIZARDRY_DIR}/modules" ]; then
    for module_file in "${WIZARDRY_DIR}"/modules/*.sh; do
        # Only source the file if it actually exists and is readable.
        [ -r "$module_file" ] && source "$module_file"
    done
fi
