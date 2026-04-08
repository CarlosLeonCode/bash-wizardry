#!/bin/bash
#
# Discovery Module for bash-wizardry
#
# Provides context-aware hints and auto-discovery when entering directories.

_bw_discover_context() {
    # Don't run discovery in the home directory to avoid noise
    if [[ "$PWD" == "$HOME" ]]; then
        return
    fi

    local hints=()

    # Node.js Discovery
    if [[ -f "package.json" ]]; then
        local script_count=$(grep -A 50 "\"scripts\":" package.json | grep -c "\":" || echo 0)
        hints+=("Detected Node.js project. Type 'nr' to manage scripts.")
    fi

    # Docker Discovery
    if [[ -f "docker-compose.yml" ]] || [[ -f "docker-compose.yaml" ]] || [[ -f "Dockerfile" ]]; then
        hints+=("Detected Docker environment. Type 'dkrinto' to jump into a container.")
    fi

    # Django Discovery
    if [[ -f "manage.py" ]]; then
        hints+=("Detected Django project. Type 'djshell' for interactive shell.")
    fi

    # Rails Discovery
    if [[ -f "Gemfile" ]] && grep -q "rails" Gemfile 2>/dev/null; then
        hints+=("Detected Rails project. Type 'rcs' for console.")
    fi


    # Display hints elegantly
    if [ ${#hints[@]} -gt 0 ]; then
        echo -e "\n\033[0;35m🧙‍♂️ Wizard Tips:\033[0m"
        for hint in "${hints[@]}"; do
            echo -e "  \033[0;34m-\033[0m $hint"
        done
        echo "" # Extra newline for spacing
    fi
}

# Register hook for Zsh
if [ -n "$ZSH_VERSION" ]; then
    # Ensure add-zsh-hook is available
    autoload -Uz add-zsh-hook 2>/dev/null
    if command -v add-zsh-hook >/dev/null 2>&1; then
        add-zsh-hook chpwd _bw_discover_context
    fi
fi

# For Bash users, we recommend adding this to their PROMPT_COMMAND if they want it auto,
# but for now we rely on the 'ws' command trigger and manual 'cd' won't trigger it 
# to keep Bash performance high.
