#!/bin/bash
#
# bash-wizardry Uninstaller
#
# Undoes what install.sh does:
#   - removes the "# bash-wizardry" comment and the "source .../init.sh" line
#     from ~/.zshrc, ~/.bashrc and ~/.bash_profile (a backup is kept),
#   - removes the install directory (~/.bash-wizardry by default).
# With --purge it also removes your user config directory
# (~/.config/bash-wizardry: config.env, user modules, trusted hooks).
# Nothing else is touched.
#
# Usage: uninstall.sh [-y|--yes] [--purge] [-h|--help]
#
# Environment:
#   BW_INSTALL_DIR       Install directory (default: ~/.bash-wizardry).
#   BW_CONFIG_HOME       User config directory removed by --purge
#                        (default: ${XDG_CONFIG_HOME:-~/.config}/bash-wizardry).
#   BW_UNINSTALL_NO_TTY  When set, never read answers from /dev/tty. Used by
#                        the test suite to simulate a machine without a
#                        terminal: without --yes the script then exits.

set -euo pipefail

usage() {
    cat <<'EOF'
Usage: uninstall.sh [options]

Removes bash-wizardry from your shell startup files and deletes the install
directory (~/.bash-wizardry, or $BW_INSTALL_DIR).

Options:
  -y, --yes    Do not ask for confirmation.
      --purge  Also delete your user config directory
               (~/.config/bash-wizardry: config.env, user modules,
               trusted hooks).
  -h, --help   Show this help and exit.

A backup of every edited file is saved as <file>.bw-backup.<timestamp>.
EOF
}

say() { printf '%s\n' "$*"; }
err() { printf 'Error: %s\n' "$*" >&2; }

# Where confirmations are read from: "stdin", "tty" or "" (none available).
INPUT=""

detect_input() {
    if [ -t 0 ]; then
        INPUT="stdin"
    elif [ -z "${BW_UNINSTALL_NO_TTY:-}" ] && (: </dev/tty) 2>/dev/null; then
        # Piped from curl: stdin is the script, but a terminal is attached.
        INPUT="tty"
    fi
}

confirm() {
    local answer=""
    printf '%s [y/N] ' "$1"
    case "$INPUT" in
        stdin) read -r answer || true ;;
        tty) read -r answer </dev/tty || true ;;
    esac
    case "$answer" in
        y|Y|yes|YES|Yes) return 0 ;;
        *) return 1 ;;
    esac
}

# Prints the absolute, symlink-free path of an existing directory.
abs_dir() {
    (cd -P -- "$1" 2>/dev/null && pwd)
}

# Refuses paths whose removal would be catastrophic.
is_dangerous_dir() {
    local resolved home
    resolved=$(abs_dir "$1") || return 1
    home=$(abs_dir "$HOME" || printf '%s' "$HOME")
    [ "$resolved" = "/" ] || [ "$resolved" = "$home" ]
}

# Lines this script removes from rc files (and only these):
#   - exactly "# bash-wizardry" (the marker install.sh writes),
#   - a line that only sources a path containing "bash-wizardry" and ending
#     in "/init.sh", e.g. "source ~/.bash-wizardry/init.sh".
# A single blank line right before the marker (also written by install.sh)
# is removed with it.
BW_UN_MARKER="# bash-wizardry"
# The quotes are part of the regex (an optionally quoted path), not shell syntax.
# shellcheck disable=SC2089
BW_UN_SOURCE_RE="^[[:space:]]*(source|\\.)[[:space:]]+[\"']?[^\"'[:space:]]*bash-wizardry[^\"'[:space:]]*/init\\.sh[\"']?[[:space:]]*\$"
# shellcheck disable=SC2090
export BW_UN_MARKER BW_UN_SOURCE_RE

# Prints the lines that would be removed from a file.
matching_lines() {
    awk '
        { line = $0; sub(/[[:space:]]+$/, "", line) }
        line == ENVIRON["BW_UN_MARKER"] || $0 ~ ENVIRON["BW_UN_SOURCE_RE"] { print }
    ' "$1"
}

# Writes the file without the bash-wizardry lines to stdout.
strip_lines() {
    awk '
        {
            line = $0; sub(/[[:space:]]+$/, "", line)
            if (line == ENVIRON["BW_UN_MARKER"]) { held = 0; next }
            if ($0 ~ ENVIRON["BW_UN_SOURCE_RE"]) { next }
            if (held) { print ""; held = 0 }
            if (line == "") { held = 1; next }
            print
        }
        END { if (held) print "" }
    ' "$1"
}

clean_rc_file() {
    local rc="$1" ts backup tmp
    ts=$(date +%Y%m%d%H%M%S)
    backup="$rc.bw-backup.$ts"
    [ -e "$backup" ] && backup="$backup.$$"
    if ! cp -p "$rc" "$backup"; then
        err "could not back up $rc (left unchanged)"
        return 1
    fi

    tmp=$(mktemp "${TMPDIR:-/tmp}/bw-uninstall.XXXXXX") || {
        err "could not create a temp file (left $rc unchanged)"
        return 1
    }
    # cp onto the existing file keeps its permissions (and follows a
    # symlinked rc file to its target), unlike mv or sed -i.
    if ! strip_lines "$rc" >"$tmp" || ! cp "$tmp" "$rc"; then
        rm -f "$tmp"
        err "could not edit $rc (backup: $backup)"
        return 1
    fi
    rm -f "$tmp"
    say "   backup: $backup"
}

main() {
    local assume_yes=0 purge=0 arg

    for arg in "$@"; do
        case "$arg" in
            -y|--yes) assume_yes=1 ;;
            --purge) purge=1 ;;
            -h|--help) usage; return 0 ;;
            *) err "unknown option: $arg"; usage >&2; return 2 ;;
        esac
    done

    local install_dir config_dir
    install_dir="${BW_INSTALL_DIR:-$HOME/.bash-wizardry}"
    config_dir="${BW_CONFIG_HOME:-${XDG_CONFIG_HOME:-$HOME/.config}/bash-wizardry}"

    say "bash-wizardry uninstaller"
    say ""

    # --- Safety checks (before anything is changed) ---
    local remove_install=0
    if [ -e "$install_dir" ] || [ -L "$install_dir" ]; then
        if [ ! -f "$install_dir/init.sh" ] || [ ! -d "$install_dir/modules" ]; then
            err "'$install_dir' does not look like a bash-wizardry install (no init.sh or modules/). Refusing to delete it."
            return 1
        fi
        if is_dangerous_dir "$install_dir"; then
            err "refusing to delete '$install_dir'."
            return 1
        fi
        remove_install=1
    fi

    local remove_config=0
    if [ "$purge" = 1 ] && [ -d "$config_dir" ]; then
        if is_dangerous_dir "$config_dir"; then
            err "refusing to delete '$config_dir'."
            return 1
        fi
        remove_config=1
    fi

    local rc_files="" rc
    for rc in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.bash_profile"; do
        [ -f "$rc" ] || continue
        if [ -n "$(matching_lines "$rc")" ]; then
            rc_files="$rc_files$rc
"
        fi
    done

    if [ -z "$rc_files" ] && [ "$remove_install" = 0 ] && [ "$remove_config" = 0 ]; then
        say "Nothing to do: bash-wizardry is not installed here."
        return 0
    fi

    # --- Plan ---
    say "This will:"
    if [ -n "$rc_files" ]; then
        while IFS= read -r rc; do
            [ -n "$rc" ] || continue
            say " - remove these lines from $rc:"
            matching_lines "$rc" | awk '{ print "     " $0 }'
        done <<EOF
$rc_files
EOF
    fi
    [ "$remove_install" = 1 ] && say " - delete $install_dir"
    [ "$remove_config" = 1 ] && say " - delete $config_dir (your config.env, user modules and trusted hooks)"
    if [ "$purge" = 0 ] && [ -d "$config_dir" ]; then
        say " - keep your config in $config_dir (use --purge to delete it)"
    fi
    say ""

    if [ "$assume_yes" = 0 ]; then
        detect_input
        if [ -z "$INPUT" ]; then
            err "no terminal to ask for confirmation. Re-run with --yes, e.g.:"
            err "  curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/uninstall.sh | bash -s -- --yes"
            return 1
        fi
        if ! confirm "Uninstall bash-wizardry?"; then
            say "Aborted. Nothing was changed."
            return 1
        fi
    fi

    # --- Do it ---
    local failed=0
    if [ -n "$rc_files" ]; then
        while IFS= read -r rc; do
            [ -n "$rc" ] || continue
            say "-> Cleaning $rc"
            clean_rc_file "$rc" || failed=1
        done <<EOF
$rc_files
EOF
    fi

    if [ "$remove_install" = 1 ]; then
        say "-> Deleting $install_dir"
        rm -rf -- "$install_dir"
    fi

    if [ "$remove_config" = 1 ]; then
        say "-> Deleting $config_dir"
        rm -rf -- "$config_dir"
    fi

    say ""
    if [ "$failed" = 1 ]; then
        err "some files could not be cleaned; see the messages above."
        return 1
    fi
    say "bash-wizardry has been uninstalled."
    say "Open a new terminal: spells already loaded in this one stay until it closes."
}

# Everything runs from main, so a partial download (curl | bash) does nothing,
# and deleting the install directory mid-run cannot cut the script short.
main "$@"
