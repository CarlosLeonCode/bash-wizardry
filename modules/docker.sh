#!/bin/bash
#
# Docker & Docker Compose Module for bash-wizardry
#
# This module enhances the Docker CLI experience with interactive functions,
# safety nets for destructive commands, and powerful shortcuts for daily workflows.

# -----------------------------------------------------------------------------
#  CORE ALIASES & BASIC COMMANDS
# -----------------------------------------------------------------------------

# Keep simple aliases for the main executables and most common commands.
alias dckr='docker'
alias dckrc='docker-compose'
alias dckrup='docker-compose up -d'
alias dckrdown='docker-compose down'
alias dckrps='docker ps --format="table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}"'
alias dckrpsa='docker ps -a'
alias dckrimgs='docker images'
alias dckrvols='docker volume ls'

# -----------------------------------------------------------------------------
#  INTERACTIVE & INTELLIGENT FUNCTIONS
# -----------------------------------------------------------------------------

# Helper function (not for direct use) to select a running container.
_dckr_select_container() {
  local containers=$(docker ps --format "{{.ID}} {{.Names}}")
  if [ -z "$containers" ]; then
    echo "No running containers found." >&2
    return 1
  fi
  echo "Please select a container:"
  select container_info in $containers; do
    if [ -n "$container_info" ]; then
      echo "$container_info" # Return ID and break
      return 0
    else
      echo "Invalid selection." >&2
      return 1
    fi
  done
}

# Builds a Docker image. If no tag is provided, it uses the current
# directory name as the image name.
# Usage: dckrbuild my-image:latest | dckrbuild
unalias dckrbuild &>/dev/null
unset -f dckrbuild &> /dev/null
dckrbuild() {
  local tag=${1:-$(basename "$PWD"):latest}
  docker build . -t "$tag"
}

# Executes a command in a container. If no container ID is given,
# it presents an interactive menu to choose one. Defaults to /bin/bash.
# Usage: dckrexec <container_id> [command] | dckrexec
unalias dckrexec &>/dev/null
unset -f dckrexec &> /dev/null
dckrexec() {
  local container_id=$1
  local command_to_run=${2:-/bin/bash} # Default to a bash shell

  if [ -z "$container_id" ]; then
    local selection=$(_dckr_select_container) || return 1
    container_id=$(echo "$selection" | awk '{print $1}')
  fi

  docker exec -it "$container_id" "$command_to_run"
}

# Shows logs for a container. Presents an interactive menu if no ID is given.
# Usage: dckrlogs <container_id> | dckrlogs
unalias dckrlogs &>/dev/null
unset -f dckrlogs &> /dev/null
dckrlogs() {
  local container_id=$1
  if [ -z "$container_id" ]; then
    local selection=$(_dckr_select_container) || return 1
    container_id=$(echo "$selection" | awk '{print $1}')
  fi
  docker logs -f "$container_id"
}

# -----------------------------------------------------------------------------
#  CONTAINER LIFECYCLE MANAGEMENT
# -----------------------------------------------------------------------------

# A single function to manage containers (stop, start, restart, rm).
# This avoids creating multiple interactive functions that do the same thing.
_dckr_manage_container() {
  local action=$1
  local container_id=$2
  if [ -z "$container_id" ]; then
    local selection=$(_dckr_select_container) || return 1
    container_id=$(echo "$selection" | awk '{print $1}')
  fi
  docker "$action" "$container_id"
}

dckrstop() { _dkr_manage_container "stop" "$1"; }
dckrstart() { _dkr_manage_container "start" "$1"; }
dckrrestart() { _dkr_manage_container "restart" "$1"; }
dckrrm() { _dkr_manage_container "rm" "$1"; }

# -----------------------------------------------------------------------------
#  CLEANUP & UTILITY FUNCTIONS
# -----------------------------------------------------------------------------

# Safely prunes the Docker system. It explains what it does and asks for confirmation.
# The original alias used '-af' which can be too aggressive without confirmation.
# Usage: dckrprune
unalias dckrprune &>/dev/null
unset -f dckrprune &> /dev/null
dckrprune() {
  read -p "This will remove all stopped containers, unused networks, and dangling images. Are you sure? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -a
  fi
}

# It asks for confirmation before cleaning each resource type.
# Usage: dckrclean
unalias dckrclean &>/dev/null
unset -f dckrclean &> /dev/null
dckrclean() {
  echo "This script will help you clean up Docker resources."

  read -p "-> Remove all stopped containers? [y/N] " -n 1 -r; echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then docker container prune -f; fi

  read -p "-> Remove all unused images? [y/N] " -n 1 -r; echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then docker image prune -a -f; fi

  read -p "-> Remove all unused volumes? [y/N] " -n 1 -r; echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then docker volume prune -f; fi

  echo "✨ Docker cleanup complete."
}

# Quickly list the IP addresses of all running containers.
# Very useful for development and debugging.
# Usage: dckrip
dckrip() {
  docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q)
}
