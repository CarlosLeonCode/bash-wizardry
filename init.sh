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
# The repo's config.env first, then the user's own config.env (outside the
# repo, so it survives updates). The user file wins. Both load before agent
# detection, so BW_AGENT_MODE can be set in either.
if [ -f "${WIZARDRY_DIR}/config.env" ]; then
    source "${WIZARDRY_DIR}/config.env"
fi
BW_CONFIG_HOME="${BW_CONFIG_HOME:-${XDG_CONFIG_HOME:-$HOME/.config}/bash-wizardry}"
if [ -f "${BW_CONFIG_HOME}/config.env" ]; then
    source "${BW_CONFIG_HOME}/config.env"
fi
# User modules: <name>.sh files here load after the core modules.
BW_USER_MODULES_DIR="${BW_USER_MODULES_DIR:-$BW_CONFIG_HOME/modules}"

# --- Agent Mode ---
# AI coding agents (Claude Code, Codex, Cursor, Gemini CLI...) often run their
# commands through the user's shell setup. In that context our aliases and
# functions only get in the way, so we stop here: scripts/ stays on PATH, but
# no aliases, functions, hooks or completions are defined.
#   BW_AGENT_MODE=auto  Agent mode when the shell is non-interactive or any
#                       variable in BW_AGENT_ENV_VARS is set (default).
#   BW_AGENT_MODE=1     Always agent mode.
#   BW_AGENT_MODE=0     Always load everything.
BW_AGENT_MODE=${BW_AGENT_MODE:-auto}
# Heuristic: variables that agent runtimes are known to export. Not exhaustive.
BW_AGENT_ENV_VARS=${BW_AGENT_ENV_VARS:-"CLAUDECODE CLAUDE_CODE_ENTRYPOINT CODEX_SANDBOX CODEX_THREAD_ID CURSOR_AGENT GEMINI_CLI AI_AGENT"}

bw_agent=0
case "$BW_AGENT_MODE" in
    1|true) bw_agent=1 ;;
    0|false) ;;
    *)
        case $- in
            *i*) ;;
            *) bw_agent=1 ;;
        esac
        # Walk the space-separated list portably (zsh does not word-split).
        bw_rest="$BW_AGENT_ENV_VARS "
        while [ "$bw_agent" = 0 ] && [ -n "$bw_rest" ]; do
            bw_var=${bw_rest%% *}
            bw_rest=${bw_rest#* }
            [ -n "$bw_var" ] || continue
            if [ -n "$ZSH_VERSION" ]; then
                # shellcheck disable=SC2296 # zsh-only expansion
                bw_val=${(P)bw_var}
            else
                bw_val=${!bw_var}
            fi
            [ -n "$bw_val" ] && bw_agent=1
        done
        ;;
esac

if [ "$bw_agent" = 1 ]; then
    unset bw_agent bw_rest bw_var bw_val
    export BW_AGENT_ACTIVE=1
    return 0
fi
unset bw_agent bw_rest bw_var bw_val BW_AGENT_ACTIVE

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
# Helper to check if a module should be loaded (default: true).
# The variable is BW_ENABLE_<NAME>: the file name without .sh, upper-cased,
# with anything other than letters, digits and '_' turned into '_'
# (my-tools.sh -> BW_ENABLE_MY_TOOLS).
_bw_should_load() {
    local module_name="${1##*/}"
    module_name="${module_name%.sh}"
    local var_name
    var_name=$(printf '%s' "$module_name" | tr '[:lower:]' '[:upper:]')
    var_name="BW_ENABLE_${var_name//[^A-Z0-9_]/_}"
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
        local module_name="${1##*/}"
        module_name="${module_name%.sh}"
        # shellcheck disable=SC2296,SC2299 # zsh-only expansion
        local var_name="BW_ENABLE_${${module_name:u}//[^A-Z0-9_]/_}" # Zsh uppercasing
        # shellcheck disable=SC2296 # zsh-only expansion
        local val=${(P)var_name}
        if [ -z "$val" ] || [ "$val" = "true" ]; then
             return 0
        else
             return 1
        fi
    }
fi

# Collision guard, part 1: remember which alias and function names exist
# before the modules load. Those belong to the user (or to a previous load)
# and are never touched.
bw_nl='
'
if [ -n "$ZSH_VERSION" ]; then
    # shellcheck disable=SC2296 # zsh-only expansion
    bw_names_before=" ${(k)aliases} ${(k)functions} "
else
    bw_names_before="${bw_nl}$(compgen -a; compgen -A function)${bw_nl}"
fi

if [ -d "${WIZARDRY_DIR}/modules" ]; then
    for bw_module_file in "${WIZARDRY_DIR}"/modules/*.sh; do
        [ -r "$bw_module_file" ] || continue
        # A user module with the same file name replaces the core one.
        [ -f "${BW_USER_MODULES_DIR}/${bw_module_file##*/}" ] && continue
        if _bw_should_load "$bw_module_file"; then
            source "$bw_module_file"
        fi
    done
fi

# Collision guard, part 2: drop any alias or function this load added that
# would shadow an executable on PATH, a builtin or a reserved word (e.g. 'rs'
# vs /usr/bin/rs, 'r' vs the zsh builtin). Names in BW_ALLOW_OVERRIDE are kept.
# Skipped names are listed in BW_SKIPPED_COMMANDS (see bw-help).
BW_SKIPPED_COMMANDS=""
if [ -n "$ZSH_VERSION" ]; then
    # Hash-table lookups only ($commands searches PATH): no subshell per name.
    # shellcheck disable=SC2296 # zsh-only expansion
    for bw_name in ${(k)aliases} ${(k)functions}; do
        case "$bw_names_before" in *" $bw_name "*) continue ;; esac
        case " $BW_ALLOW_OVERRIDE " in *" $bw_name "*) continue ;; esac
        # shellcheck disable=SC2154,SC2296 # zsh-only parameters
        if (( ${+commands[$bw_name]} || ${+builtins[$bw_name]} || ${reswords[(Ie)$bw_name]} )); then
            # shellcheck disable=SC2296 # zsh-only expansion
            (( ${+aliases[$bw_name]} )) && unalias -- "$bw_name"
            # shellcheck disable=SC2296 # zsh-only expansion
            (( ${+functions[$bw_name]} )) && unfunction -- "$bw_name"
            case " $BW_SKIPPED_COMMANDS " in
                *" $bw_name "*) ;;
                *) BW_SKIPPED_COMMANDS="${BW_SKIPPED_COMMANDS:+$BW_SKIPPED_COMMANDS }$bw_name" ;;
            esac
        fi
    done
else
    # Builtins and keywords in one string; 'type -P' checks PATH without output capture.
    bw_reserved="${bw_nl}$(compgen -b; compgen -k)${bw_nl}"
    while IFS= read -r bw_name; do
        [ -n "$bw_name" ] || continue
        case "$bw_names_before" in *"${bw_nl}${bw_name}${bw_nl}"*) continue ;; esac
        case " $BW_ALLOW_OVERRIDE " in *" $bw_name "*) continue ;; esac
        case "$bw_reserved" in
            *"${bw_nl}${bw_name}${bw_nl}"*) ;;
            *) type -P -- "$bw_name" >/dev/null 2>&1 || continue ;;
        esac
        unalias -- "$bw_name" 2>/dev/null
        unset -f -- "$bw_name" 2>/dev/null
        case " $BW_SKIPPED_COMMANDS " in
            *" $bw_name "*) ;;
            *) BW_SKIPPED_COMMANDS="${BW_SKIPPED_COMMANDS:+$BW_SKIPPED_COMMANDS }$bw_name" ;;
        esac
    done <<EOF
$(compgen -a; compgen -A function)
EOF
fi
unset bw_nl bw_names_before bw_name bw_reserved bw_module_file

# --- Load Completions ---
# Completions use the 'complete' builtin: always present in Bash, and in Zsh
# only when the user has enabled bashcompinit. We never enable it ourselves.
if [ -d "${WIZARDRY_DIR}/completions" ] && type complete >/dev/null 2>&1; then
    for completion_file in "${WIZARDRY_DIR}"/completions/*.sh; do
        [ -r "$completion_file" ] || continue
        # Only load completions for enabled modules (git_completions.sh -> git.sh).
        completion_module=$(basename "$completion_file" _completions.sh)
        # Skip it when a user module replaces the core module.
        [ -f "${BW_USER_MODULES_DIR}/${completion_module}.sh" ] && continue
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
    # The spell list comes from catalog/commands.tsv via bwiz (also on PATH).
    "$WIZARDRY_DIR/scripts/bwiz" help "$@" || return
    if [ -n "$BW_SKIPPED_COMMANDS" ]; then
        echo ""
        echo "Skipped (would shadow an existing command): $BW_SKIPPED_COMMANDS"
        echo "Allow with BW_ALLOW_OVERRIDE=\"name ...\" in config.env"
    fi
    if [ -n "$BW_USER_MODULES_LOADED" ]; then
        echo ""
        echo "User modules loaded from $BW_USER_MODULES_DIR: $BW_USER_MODULES_LOADED"
    fi
    echo ""
    echo "Run 'bwiz help --json' for machine-readable output."
    echo "Repo: https://github.com/CarlosLeonCode/bash-wizardry"
}

# --- User Modules ---
# <name>.sh files in BW_USER_MODULES_DIR load last, gated by BW_ENABLE_<NAME>
# like core modules. They are the user's own code: the collision guard above
# does not apply to them. Agent mode returned long before this point.
BW_USER_MODULES_LOADED=""
if [ -d "$BW_USER_MODULES_DIR" ]; then
    # Collect the files first: a glob with no match is an error in Zsh, and
    # nullglob must not leak into the modules, so it stays local to a function.
    _bw_list_user_modules() {
        # shellcheck disable=SC2034 # read by the caller
        bw_user_files=""
        [ -n "$ZSH_VERSION" ] && setopt localoptions nullglob
        local f
        for f in "$BW_USER_MODULES_DIR"/*.sh; do
            [ -r "$f" ] && bw_user_files="${bw_user_files}${f}
"
        done
        return 0
    }
    _bw_list_user_modules
    unset -f _bw_list_user_modules
    while [ -n "$bw_user_files" ]; do
        bw_module_file=${bw_user_files%%
*}
        bw_user_files=${bw_user_files#*
}
        if _bw_should_load "$bw_module_file"; then
            source "$bw_module_file"
            bw_module_file=${bw_module_file##*/}
            BW_USER_MODULES_LOADED="${BW_USER_MODULES_LOADED:+$BW_USER_MODULES_LOADED }${bw_module_file%.sh}"
        fi
    done
    unset bw_user_files bw_module_file
fi
