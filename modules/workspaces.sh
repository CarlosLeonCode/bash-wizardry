#!/bin/bash
#
# Workspaces Module for bash-wizardry
#
# Provides the 'ws' command for fast project navigation and automation hooks.

# Default workspace directory if not set in config.env
# You can define multiple roots separated by colon, e.g., BW_WORKSPACE_ROOTS="$HOME/Dev:$HOME/Work"
BW_WORKSPACE_ROOTS=${BW_WORKSPACE_ROOTS:-"$HOME/Dev"}

ws() {
  local search_query="$1"
  local target_dir
  local roots

  # Convert colon-separated roots to space-separated for find/loop
  roots=$(echo "$BW_WORKSPACE_ROOTS" | tr ':' ' ')

  # Validate roots exist
  local valid_roots=""
  for r in $roots; do
      if [[ -d "$r" ]]; then
          valid_roots="$valid_roots $r"
      fi
  done

  if [[ -z "$valid_roots" ]]; then
      echo "Error: No valid workspace roots found. Please check BW_WORKSPACE_ROOTS in config.env"
      return 1
  fi

  # 1. Selection logic
  if [[ -z "$search_query" ]]; then
    # No query provided, use interactive selector if fzf is available
    if command -v fzf >/dev/null 2>&1; then
      # Find directories one level deep in workspace roots
      target_dir=$(find $valid_roots -maxdepth 1 -type d -not -path '*/.*' | fzf --height 40% --reverse --header "🧙‍♂️ Select Workspace")
    else
      echo "Error: fzf is not installed. Please provide a workspace name or install fzf."
      return 1
    fi
  else
    # Search for matching directory name exactly
    for root in $valid_roots; do
      if [[ -d "$root/$search_query" ]]; then
        target_dir="$root/$search_query"
        break
      fi
    done

    # If not found exactly, try a partial match/fuzzy search if fzf is available
    if [[ -z "$target_dir" ]] && command -v fzf >/dev/null 2>&1; then
        # Find matches and use fzf to select if multiple
        target_dir=$(find $valid_roots -maxdepth 1 -type d -name "*$search_query*" -not -path '*/.*' | fzf --height 40% --reverse --header "🧙‍♂️ Select matching workspace" -1 -0 -q "$search_query")
    fi
  fi

  # 2. Transition logic
  if [[ -n "$target_dir" && -d "$target_dir" ]]; then
    cd "$target_dir" || return
    echo "✨ Entered workspace: $(basename "$target_dir")"

    # 3. Hook logic (On-enter script)
    if [[ -f ".bw-on-enter" ]]; then
      echo "🪄 Running workspace hook..."
      # Use a subshell or source? Source allows setting env vars/aliases in the current shell.
      source ".bw-on-enter"
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
