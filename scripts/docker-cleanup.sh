#!/bin/bash
#
# Docker Cleanup Utility
#
# A robust tool to selectively or completely clean Docker resources.
# It provides interactive confirmation by default and can be automated
# with a force flag.

# --- Configuration & Helpers ---

# Exit immediately if a command exits with a non-zero status.
set -eo pipefail

# Color definitions for better UX
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[0;93m'
readonly COLOR_NONE='\033[0m'

# --- Core Functions ---

show_help() {
  echo "Usage: $(basename "$0") [OPTIONS]"
  echo "A powerful interactive script to clean up Docker resources."
  echo
  echo "Options:"
  echo "  -c, --containers   Clean stopped containers"
  echo "  -i, --images       Clean dangling images"
  echo "  -v, --volumes      Clean unused volumes"
  echo "  -n, --networks     Clean unused networks"
  echo "      --deep         Clean all unused images, not just dangling ones (more aggressive)"
  echo "  -a, --all          Clean all of the above (default behavior)"
  echo "  -f, --force        Bypass confirmation prompt (for automation)"
  echo "  -h, --help         Display this help and exit"
}

clean_containers() {
  echo -e "${COLOR_BLUE}-> Pruning stopped containers...${COLOR_NONE}"
  docker container prune $FORCE_FLAG
}

clean_images() {
  local prune_args="-f"
  local description="dangling"
  if [ "$DEEP_CLEAN" = true ]; then
    prune_args="-af"
    description="all unused"
  fi
  echo -e "${COLOR_BLUE}-> Pruning ${description} images...${COLOR_NONE}"
  docker image prune $prune_args
}

clean_volumes() {
  echo -e "${COLOR_BLUE}-> Pruning unused volumes...${COLOR_NONE}"
  docker volume prune $FORCE_FLAG
}

clean_networks() {
  echo -e "${COLOR_BLUE}-> Pruning unused networks...${COLOR_NONE}"
  docker network prune $FORCE_FLAG
}

# --- Main Execution Logic ---

# Default values
CLEAN_ALL=false
CLEAN_CONTAINERS=false
CLEAN_IMAGES=false
CLEAN_VOLUMES=false
CLEAN_NETWORKS=false
DEEP_CLEAN=false
FORCE_FLAG="-f" # In the new logic, this is used inside the functions
CONFIRMATION_NEEDED=true

# If no arguments are provided, default to cleaning everything.
if [ $# -eq 0 ]; then
  CLEAN_ALL=true
fi

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -c|--containers) CLEAN_CONTAINERS=true ;;
    -i|--images) CLEAN_IMAGES=true ;;
    -v|--volumes) CLEAN_VOLUMES=true ;;
    -n|--networks) CLEAN_NETWORKS=true ;;
    --deep) DEEP_CLEAN=true ;;
    -a|--all) CLEAN_ALL=true ;;
    -f|--force) CONFIRMATION_NEEDED=false ;;
    -h|--help) show_help; exit 0 ;;
    *) echo "Unknown parameter passed: $1"; show_help; exit 1 ;;
  esac
  shift
done

if [ "$CLEAN_ALL" = true ]; then
  CLEAN_CONTAINERS=true
  CLEAN_IMAGES=true
  CLEAN_VOLUMES=true
  CLEAN_NETWORKS=true
fi

# --- Confirmation & Execution ---

if [ "$CONFIRMATION_NEEDED" = true ]; then
  echo -e "${COLOR_YELLOW}This script will perform the following actions:${COLOR_NONE}"
  [ "$CLEAN_CONTAINERS" = true ] && echo "  - Prune stopped containers"
  [ "$CLEAN_IMAGES" = true ] && { [ "$DEEP_CLEAN" = true ] && echo "  - Prune ALL unused images" || echo "  - Prune dangling images"; }
  [ "$CLEAN_VOLUMES" = true ] && echo "  - Prune unused volumes"
  [ "$CLEAN_NETWORKS" = true ] && echo "  - Prune unused networks"
  echo

  read -p "Are you sure you want to continue? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 0
  fi
else
  # If forced, we use the -f flag for the docker commands
  FORCE_FLAG="-f"
fi

# Execute the selected actions
echo -e "\n${COLOR_GREEN}🧹 Starting Docker cleanup...${COLOR_NONE}"
[ "$CLEAN_CONTAINERS" = true ] && clean_containers
[ "$CLEAN_IMAGES" = true ] && clean_images
[ "$CLEAN_VOLUMES" = true ] && clean_volumes
[ "$CLEAN_NETWORKS" = true ] && clean_networks

echo -e "\n${COLOR_GREEN}✨ Docker cleanup complete!${COLOR_NONE}"
