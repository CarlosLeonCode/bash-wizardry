#!/bin/bash
#
# Env Module for bash-wizardry
#
# Manage multiple environment files elegantly.

# Lists available environment files in the current directory.
# Usage: env-ls
env-ls() {
    local files=$(ls -1 .env.* 2>/dev/null)
    if [[ -z "$files" ]]; then
        echo "🧙‍♂️ No .env.* files found in this directory."
        return 0
    fi

    echo "🧙‍♂️ Available environment files:"
    echo "$files" | sed 's/\.env\.//g' | while read -r line; do
        # Check if current .env matches this specific env file
        if [[ -f ".env" ]] && cmp -s ".env" ".env.$line"; then
             echo -e "  \033[0;32m*\033[0m $line (active)"
        else
             echo -e "  \033[0;34m-\033[0m $line"
        fi
    done
}

# Swaps a .env.<name> file into .env safely.
# Usage: env-set staging
env-set() {
    local target="$1"
    
    # If no argument, try fzf or show list
    if [[ -z "$target" ]]; then
        if command -v fzf >/dev/null 2>&1; then
            target=$(ls -1 .env.* 2>/dev/null | sed 's/\.env\.//g' | fzf --height 40% --reverse --header "🧙‍♂️ Select Environment")
            [[ -z "$target" ]] && return 0
        else
            echo "Usage: env-set <environment_name>"
            env-ls
            return 1
        fi
    fi

    if [[ -f ".env.$target" ]]; then
        # Safety check: backup current .env if it's unique
        if [[ -f ".env" ]]; then
             local matched=false
             for f in .env.*; do
                 if cmp -s ".env" "$f"; then
                     matched=true
                     break
                 fi
             done
             
             if [ "$matched" = false ]; then
                 local timestamp=$(date +%Y%m%d%H%M%S)
                 cp ".env" ".env.backup.$timestamp"
                 echo "⚠️ Custom .env detected and backed up to .env.backup.$timestamp"
             fi
        fi

        cp ".env.$target" ".env"
        echo -e "✨ Environment set to: \033[0;32m$target\033[0m"
    else
        echo "Error: Environment file '.env.$target' not found."
        return 1
    fi
}
