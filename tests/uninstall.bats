#!/usr/bin/env bats
# uninstall.sh: rc-file cleanup, install/config removal and safety checks.
#
# Every test runs against a temp HOME. BW_UNINSTALL_NO_TTY=1 stops the script
# from falling back to /dev/tty for confirmations, so a test run from a real
# terminal behaves like a machine without one.

bats_require_minimum_version 1.5.0

setup() {
    load test_helper
    common_setup
    export BW_UNINSTALL_NO_TTY=1
    UNINSTALL="$REPO/uninstall.sh"
    INSTALL="$HOME/.bash-wizardry"
}

# Octal permissions of a file (GNU or BSD stat).
mode() {
    stat -c %a "$1" 2>/dev/null || stat -f %Lp "$1"
}

# A fake install: init.sh + modules/.
make_install() {
    mkdir -p "$INSTALL/modules"
    echo '# init' > "$INSTALL/init.sh"
    echo '# git' > "$INSTALL/modules/git.sh"
}

# rc files with what install.sh (and the manual guide) writes, plus unrelated lines.
make_rc_files() {
    printf '%s\n' 'export EDITOR=nvim' 'alias ll="ls -l"' '' '# bash-wizardry' \
        "source $INSTALL/init.sh" > "$HOME/.zshrc"
    chmod 600 "$HOME/.zshrc"

    printf '%s\n' '# my bashrc' 'source ~/.bash-wizardry/init.sh' \
        'source ~/other-tool/init.sh' '# bash-wizardry notes' 'export A=1' > "$HOME/.bashrc"
    chmod 640 "$HOME/.bashrc"
}

@test "--help prints usage and exits 0" {
    run bash "$UNINSTALL" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"Usage: uninstall.sh"* ]]
    [[ "$output" == *"--purge"* ]]
}

@test "an unknown option exits 2" {
    run bash "$UNINSTALL" --nope
    [ "$status" -eq 2 ]
}

@test "--yes removes the install lines, keeps the rest, backs up and deletes the install dir" {
    make_install
    make_rc_files

    run bash "$UNINSTALL" --yes
    [ "$status" -eq 0 ]
    [[ "$output" == *"Open a new terminal"* ]]

    [ "$(cat "$HOME/.zshrc")" = "$(printf '%s\n' 'export EDITOR=nvim' 'alias ll="ls -l"')" ]
    [ "$(cat "$HOME/.bashrc")" = "$(printf '%s\n' '# my bashrc' 'source ~/other-tool/init.sh' '# bash-wizardry notes' 'export A=1')" ]

    [ "$(mode "$HOME/.zshrc")" = "600" ]
    [ "$(mode "$HOME/.bashrc")" = "640" ]

    # One backup per edited file, identical to the original.
    run bash -c 'ls "$HOME"/.zshrc.bw-backup.* | wc -l'
    [ "$output" -eq 1 ]
    grep -qx '# bash-wizardry' "$HOME"/.zshrc.bw-backup.*
    grep -qx 'source ~/.bash-wizardry/init.sh' "$HOME"/.bashrc.bw-backup.*

    [ ! -e "$INSTALL" ]
    [ ! -e "$HOME/.bash_profile" ]
}

@test "rc files without bash-wizardry lines are not touched or backed up" {
    make_install
    printf '%s\n' 'export A=1' > "$HOME/.zshrc"

    run bash "$UNINSTALL" --yes
    [ "$status" -eq 0 ]
    [ "$(cat "$HOME/.zshrc")" = "export A=1" ]
    run bash -c 'ls "$HOME"/.zshrc.bw-backup.* 2>/dev/null'
    [ -z "$output" ]
}

@test "without --purge the user config directory is kept" {
    make_install
    mkdir -p "$USERCFG/modules"
    echo 'BW_AGENT_MODE=0' > "$USERCFG/config.env"

    run bash "$UNINSTALL" --yes
    [ "$status" -eq 0 ]
    [[ "$output" == *"use --purge"* ]]
    [ -f "$USERCFG/config.env" ]
    [ -d "$USERCFG/modules" ]
}

@test "--purge also removes the user config directory" {
    make_install
    mkdir -p "$USERCFG/modules"
    echo 'BW_AGENT_MODE=0' > "$USERCFG/config.env"
    echo 'abc  /some/hook' > "$USERCFG/trusted_hooks"

    run bash "$UNINSTALL" --yes --purge
    [ "$status" -eq 0 ]
    [ ! -e "$USERCFG" ]
    [ -d "$HOME/.config" ]
}

@test "--purge honors BW_CONFIG_HOME" {
    make_install
    mkdir -p "$HOME/custom-cfg"
    echo 'x' > "$HOME/custom-cfg/config.env"

    BW_CONFIG_HOME="$HOME/custom-cfg" run bash "$UNINSTALL" --yes --purge
    [ "$status" -eq 0 ]
    [ ! -e "$HOME/custom-cfg" ]
}

@test "refuses to delete an install dir without init.sh, and changes nothing" {
    mkdir -p "$INSTALL/modules"
    echo 'keep me' > "$INSTALL/notes.txt"
    make_rc_files
    cp "$HOME/.zshrc" "$BATS_TEST_TMPDIR/zshrc.orig"

    run bash "$UNINSTALL" --yes
    [ "$status" -ne 0 ]
    [[ "$output" == *"does not look like a bash-wizardry install"* ]]
    [ -f "$INSTALL/notes.txt" ]
    cmp -s "$HOME/.zshrc" "$BATS_TEST_TMPDIR/zshrc.orig"
    run bash -c 'ls "$HOME"/.zshrc.bw-backup.* 2>/dev/null'
    [ -z "$output" ]
}

@test "refuses BW_INSTALL_DIR pointing at a dir without modules/" {
    mkdir -p "$HOME/elsewhere"
    echo '# init' > "$HOME/elsewhere/init.sh"

    BW_INSTALL_DIR="$HOME/elsewhere" run bash "$UNINSTALL" --yes
    [ "$status" -ne 0 ]
    [ -f "$HOME/elsewhere/init.sh" ]
}

@test "without a terminal and without --yes it exits non-zero and changes nothing" {
    make_install
    make_rc_files
    cp "$HOME/.zshrc" "$BATS_TEST_TMPDIR/zshrc.orig"

    run bash "$UNINSTALL" </dev/null
    [ "$status" -ne 0 ]
    [[ "$output" == *"--yes"* ]]
    [ -d "$INSTALL" ]
    cmp -s "$HOME/.zshrc" "$BATS_TEST_TMPDIR/zshrc.orig"
    run bash -c 'ls "$HOME"/.zshrc.bw-backup.* 2>/dev/null'
    [ -z "$output" ]
}

@test "piped into bash (curl | bash style) without --yes and no terminal exits non-zero" {
    make_install

    run bash -c 'bash < "$1"' _ "$UNINSTALL"
    [ "$status" -ne 0 ]
    [ -d "$INSTALL" ]
}

@test "nothing installed: exits 0 and says so" {
    run bash "$UNINSTALL" --yes
    [ "$status" -eq 0 ]
    [[ "$output" == *"Nothing to do"* ]]
}
