#!/bin/bash
#
# bash-wizardry Installer
#
# Installs bash-wizardry to ~/.bash-wizardry and configures your shell.
#
# By default only the tool is downloaded: a partial, sparse clone skips the
# website (web/) and the film (video/), which are most of the repository.
# Updates (`bw-update`, or running this script again) keep it that way.
#
# Environment:
#   BW_REPO_URL      Repository to install from (default: the official one).
#                    Useful to install from your fork.
#   BW_INSTALL_DIR   Install directory (default: ~/.bash-wizardry).
#   BW_INSTALL_FULL  Set to 1 to download the whole repository. On an
#                    existing lightweight install it restores the full tree.

set -e

REPO_URL="${BW_REPO_URL:-https://github.com/CarlosLeonCode/bash-wizardry.git}"
INSTALL_DIR="${BW_INSTALL_DIR:-$HOME/.bash-wizardry}"

echo "🧙‍♂️ Welcome to the bash-wizardry installer!"

if ! command -v git >/dev/null 2>&1; then
    echo "Error: git is required to install bash-wizardry. Install git and run this again." >&2
    exit 1
fi

# Partial + sparse clone: only the files outside web/ and video/ are
# downloaded. Each step must succeed; any failure (old git without
# sparse-checkout or --no-cone, a server without --filter support, a network
# error) returns 1 so the caller can fall back to a full clone.
# Called from an 'if', where 'set -e' is off, hence the explicit returns.
clone_lightweight() {
    local branch
    git clone --filter=blob:none --no-checkout "$REPO_URL" "$INSTALL_DIR" || return 1
    git -C "$INSTALL_DIR" sparse-checkout set --no-cone '/*' '!/web/' '!/video/' || return 1
    branch=$(git -C "$INSTALL_DIR" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null) || branch=""
    branch="${branch#origin/}"
    [ -n "$branch" ] || branch="main"
    git -C "$INSTALL_DIR" checkout -q "$branch" || return 1
    [ -f "$INSTALL_DIR/init.sh" ] || return 1
}

# 1. Clone the repository
if [ -d "$INSTALL_DIR" ]; then
    echo "-> '$INSTALL_DIR' already exists. Updating..."
    git -C "$INSTALL_DIR" pull
    if [ "${BW_INSTALL_FULL:-}" = "1" ] &&
        [ "$(git -C "$INSTALL_DIR" config --bool core.sparseCheckout 2>/dev/null)" = "true" ]; then
        echo "-> BW_INSTALL_FULL=1: downloading the full repository (website and film included)..."
        git -C "$INSTALL_DIR" sparse-checkout disable
    fi
elif [ "${BW_INSTALL_FULL:-}" = "1" ]; then
    echo "-> Cloning the full bash-wizardry repository to '$INSTALL_DIR'..."
    git clone "$REPO_URL" "$INSTALL_DIR"
else
    echo "-> Cloning bash-wizardry to '$INSTALL_DIR' (tool only, without the website)..."
    if clone_lightweight; then
        echo "-> Lightweight install: web/ and video/ were skipped. Set BW_INSTALL_FULL=1 for the full repository."
    else
        echo "-> Note: lightweight download not supported here (needs git 2.35+ and a server with partial clone); doing a full clone instead."
        rm -rf -- "$INSTALL_DIR"
        git clone "$REPO_URL" "$INSTALL_DIR"
        echo "-> Full install complete."
    fi
fi

# 2. Detect Shell and Config File
SHELL_NAME=$(basename "$SHELL")
RC_FILE=""

if [ "$SHELL_NAME" = "zsh" ]; then
    RC_FILE="$HOME/.zshrc"
elif [ "$SHELL_NAME" = "bash" ]; then
    if [ -f "$HOME/.bash_profile" ]; then
        RC_FILE="$HOME/.bash_profile"
    else
        RC_FILE="$HOME/.bashrc"
    fi
else
    echo "-> Warning: Unknown shell '$SHELL_NAME'. You might need to manually configure it."
    RC_FILE="$HOME/.bashrc"
fi

# 3. Add to RC file if not present
SOURCE_CMD="source $INSTALL_DIR/init.sh"

if [ -f "$RC_FILE" ]; then
    if grep -q "$SOURCE_CMD" "$RC_FILE"; then
        echo "-> bash-wizardry is already configured in $RC_FILE"
    else
        echo "-> Adding bash-wizardry to $RC_FILE..."
        echo "" >> "$RC_FILE"
        echo "# bash-wizardry" >> "$RC_FILE"
        echo "$SOURCE_CMD" >> "$RC_FILE"
        echo "-> Configured!"
    fi
else
    echo "-> Warning: Configuration file $RC_FILE not found."
    echo "-> Please add the following line to your shell configuration manually:"
    echo "   $SOURCE_CMD"
fi

echo ""
echo "✨ Installation complete! Please restart your terminal or run:"
echo "   source $RC_FILE"
