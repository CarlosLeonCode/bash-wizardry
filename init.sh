#!/bin/bash
#
# bash-wizardry Initializer
# This script loads all modules and sets up the environment.

# Robustly determine the script's directory, compatible with both Bash and Zsh.
WIZARDRY_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]:-$N}")" &> /dev/null && pwd)

# Add the 'scripts' directory to the user's PATH if it exists.
if [ -d "${WIZARDRY_DIR}/scripts" ]; then
    export PATH="${WIZARDRY_DIR}/scripts:${PATH}"
fi

# Source all .sh files in the 'modules' directory.
# This loop is safe and will not produce errors if the directory is empty.
if [ -d "${WIZARDRY_DIR}/modules" ]; then
    for module_file in "${WIZARDRY_DIR}"/modules/*.sh; do
        # Check if the file exists before sourcing to handle empty directories
        [ -e "$module_file" ] && source "$module_file"
    done
fi
