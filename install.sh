#!/bin/bash
#
# bash-wizardry Installer
#
# Installs bash-wizardry to ~/.bash-wizardry and configures your shell.

set -e

REPO_URL="https://github.com/CarlosLeonCode/bash-wizardry.git"
INSTALL_DIR="$HOME/.bash-wizardry"

echo "🧙‍♂️ Welcome to the bash-wizardry installer!"

# 1. Clone the repository
if [ -d "$INSTALL_DIR" ]; then
    echo "-> '$INSTALL_DIR' already exists. Updating..."
    cd "$INSTALL_DIR" && git pull
else
    echo "-> Cloning bash-wizardry to '$INSTALL_DIR'..."
    git clone "$REPO_URL" "$INSTALL_DIR"
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
