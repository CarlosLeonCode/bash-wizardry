#!/bin/bash
#
# Workspaces Module for bash-wizardry
#
# Provides the 'ws' command for fast project navigation and automation hooks.

# Default workspace directory if not set in config.env
# You can define multiple roots separated by colon, e.g., BW_WORKSPACE_ROOTS="$HOME/Dev:$HOME/Work"
BW_WORKSPACE_ROOTS=${BW_WORKSPACE_ROOTS:-"$HOME/Dev"}

# Allowlist of trusted .bw-on-enter hooks (one "<sha256> <path>" per line).
BW_TRUST_FILE="${BW_TRUST_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/bash-wizardry/trusted_hooks}"

# Prints the trust id of a hook file: "<sha256> <absolute path>".
# The hash covers the content, so any edit to the hook requires re-trusting it.
# Always called from the project dir, so $PWD gives the absolute path.
_bw_hook_id() {
  local file="$1" hash
  if command -v sha256sum >/dev/null 2>&1; then
    hash=$(sha256sum "$file" | awk '{print $1}')
  else
    hash=$(shasum -a 256 "$file" | awk '{print $1}')
  fi
  echo "$hash $PWD/$file"
}

ws() {
  local search_query="$1"
  local target_dir

  # Split colon-separated roots into an array (works in bash and zsh)
  local -a valid_roots=()
  local rest="${BW_WORKSPACE_ROOTS}:" r
  while [[ -n "$rest" ]]; do
      r="${rest%%:*}"
      rest="${rest#*:}"
      [[ -d "$r" ]] && valid_roots+=("$r")
  done

  if [[ ${#valid_roots[@]} -eq 0 ]]; then
      echo "Error: No valid workspace roots found. Please check BW_WORKSPACE_ROOTS in config.env"
      return 1
  fi

  # 1. Selection logic
  if [[ -z "$search_query" ]]; then
    # No query provided, use interactive selector if fzf is available
    if command -v fzf >/dev/null 2>&1; then
      # Find directories one level deep in workspace roots
      target_dir=$(find "${valid_roots[@]}" -maxdepth 1 -type d -not -path '*/.*' | fzf --height 40% --reverse --header "🧙‍♂️ Select Workspace")
    else
      echo "Error: fzf is not installed. Please provide a workspace name or install fzf."
      return 1
    fi
  else
    # Search for matching directory name exactly
    local root
    for root in "${valid_roots[@]}"; do
      if [[ -d "$root/$search_query" ]]; then
        target_dir="$root/$search_query"
        break
      fi
    done

    # If not found exactly, try a partial match/fuzzy search if fzf is available
    if [[ -z "$target_dir" ]] && command -v fzf >/dev/null 2>&1; then
        # Find matches and use fzf to select if multiple
        target_dir=$(find "${valid_roots[@]}" -maxdepth 1 -type d -name "*$search_query*" -not -path '*/.*' | fzf --height 40% --reverse --header "🧙‍♂️ Select matching workspace" -1 -0 -q "$search_query")
    fi
  fi

  # 2. Transition logic
  if [[ -n "$target_dir" && -d "$target_dir" ]]; then
    cd "$target_dir" || return
    echo "✨ Entered workspace: $(basename "$target_dir")"

    # 3. Hook logic (On-enter script), only for hooks trusted via 'ws-trust'
    if [[ -f ".bw-on-enter" ]]; then
      if grep -qxF "$(_bw_hook_id ".bw-on-enter")" "$BW_TRUST_FILE" 2>/dev/null; then
        echo "🪄 Running workspace hook..."
        # Source so the hook can set env vars/aliases in the current shell.
        source ".bw-on-enter"
      else
        echo "⚠️  Untrusted .bw-on-enter found. Review it and run 'ws-trust' to allow it."
      fi
    fi

    # Trigger discovery if available
    if command -v _bw_discover_context >/dev/null 2>&1; then
        _bw_discover_context
    fi
  else
    if [[ -n "$search_query" ]]; then
        echo "Error: Workspace matching '$search_query' not found."
    fi
  fi
}

# Reviews and trusts the .bw-on-enter hook in the current directory.
# Trust is tied to the file content: after any edit, run 'ws-trust' again.
# Usage: ws-trust
ws-trust() {
  if [[ ! -f ".bw-on-enter" ]]; then
    echo "Error: No .bw-on-enter found in $PWD" >&2
    return 1
  fi

  echo "----- .bw-on-enter -----"
  cat ".bw-on-enter"
  echo "------------------------"

  if _bw_confirm "Trust and run this hook in future visits?"; then
    mkdir -p "$(dirname "$BW_TRUST_FILE")"
    _bw_hook_id ".bw-on-enter" >> "$BW_TRUST_FILE"
    echo "✅ Hook trusted. It will run on your next 'ws' visit."
  fi
}
