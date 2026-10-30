#!/usr/bin/env bats
# install.sh: lightweight (partial + sparse) clone, full clone, updates,
# fallback and rc-file setup.
#
# Every test runs against a temp HOME and a local source repository built from
# this repo's committed HEAD (no network). The source mimics GitHub: a bare
# repo whose default branch is "main" and that allows --filter over file://.

bats_require_minimum_version 1.5.0

setup_file() {
    local repo src
    repo="$(cd "$BATS_TEST_DIRNAME/.." && pwd)"
    src="$BATS_FILE_TMPDIR/src.git"
    git clone -q --bare "$repo" "$src"
    git -C "$src" update-ref refs/heads/main "$(git -C "$repo" rev-parse HEAD)"
    git -C "$src" symbolic-ref HEAD refs/heads/main
    allow_filter "$src"
}

# Lets a bare repo serve partial clones over file://.
allow_filter() {
    git -C "$1" config uploadpack.allowFilter true
    git -C "$1" config uploadpack.allowAnySHA1InWant true
}

setup() {
    load test_helper
    common_setup
    export GIT_CONFIG_NOSYSTEM=1
    SRC="$BATS_FILE_TMPDIR/src.git"
    INSTALL="$HOME/.bash-wizardry"
    export BW_REPO_URL="file://$SRC"
    export BW_INSTALL_DIR="$INSTALL"
    export SHELL=/bin/zsh
    touch "$HOME/.zshrc"
}

# Uses a private copy of the source repo, so the test can add commits to it.
private_source() {
    git clone -q --bare "$SRC" "$BATS_TEST_TMPDIR/src.git"
    allow_filter "$BATS_TEST_TMPDIR/src.git"
    SRC="$BATS_TEST_TMPDIR/src.git"
    export BW_REPO_URL="file://$SRC"
}

# Pushes a commit adding NEW_SPELL.txt and web/new-page.txt to the source.
push_new_commit() {
    local work="$BATS_TEST_TMPDIR/work"
    git clone -q "file://$SRC" "$work"
    echo 'new' > "$work/NEW_SPELL.txt"
    mkdir -p "$work/web"
    echo 'page' > "$work/web/new-page.txt"
    git -C "$work" add -A
    git -C "$work" -c user.name=test -c user.email=test@example.com commit -qm 'new spell'
    git -C "$work" push -q origin HEAD:main
}

assert_runtime_present() {
    [ -f "$INSTALL/init.sh" ]
    [ -f "$INSTALL/uninstall.sh" ]
    [ -f "$INSTALL/config.env.example" ]
    [ -d "$INSTALL/modules" ]
    [ -f "$INSTALL/catalog/commands.tsv" ]
    [ -d "$INSTALL/completions" ]
    [ -x "$INSTALL/scripts/bwiz" ]
}

@test "default install is a sparse partial clone without web/ and video/" {
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Lightweight install"* ]]

    assert_runtime_present
    [ ! -e "$INSTALL/web" ]
    [ ! -e "$INSTALL/video" ]
    [ "$(git -C "$INSTALL" config --bool core.sparseCheckout)" = "true" ]
    [ "$(git -C "$INSTALL" config remote.origin.partialclonefilter)" = "blob:none" ]
    [ "$(git -C "$INSTALL" rev-parse --abbrev-ref HEAD)" = "main" ]
    [ -z "$(git -C "$INSTALL" status --porcelain)" ]
}

@test "the rc file gets the source line once, also when run again" {
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [[ "$output" == *"already configured"* ]]

    [ "$(grep -cxF "source $INSTALL/init.sh" "$HOME/.zshrc")" -eq 1 ]
    [ "$(grep -cxF '# bash-wizardry' "$HOME/.zshrc")" -eq 1 ]
}

@test "the installed tree is valid: init.sh parses and bwiz help runs" {
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]

    run bash -n "$INSTALL/init.sh"
    [ "$status" -eq 0 ]
    run "$INSTALL/scripts/bwiz" help
    [ "$status" -eq 0 ]
    [[ "$output" == *"gup"* ]]
}

@test "BW_INSTALL_FULL=1 clones the whole repository" {
    BW_INSTALL_FULL=1 run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [[ "$output" == *"full bash-wizardry repository"* ]]

    assert_runtime_present
    [ -d "$INSTALL/web" ]
    [ "$(git -C "$INSTALL" config --bool core.sparseCheckout || echo unset)" != "true" ]
}

@test "running again on an existing install pulls new commits and keeps web/ out" {
    private_source
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]

    push_new_commit
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [[ "$output" == *"already exists. Updating"* ]]
    [ -f "$INSTALL/NEW_SPELL.txt" ]
    [ ! -e "$INSTALL/web" ]
}

@test "bw-update fast-forwards a sparse install and keeps web/ out" {
    private_source
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]

    push_new_commit
    run bash -c 'BW_AGENT_MODE=0; source "$1/init.sh"; bw-update' _ "$INSTALL"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Update complete"* ]]
    [ -f "$INSTALL/NEW_SPELL.txt" ]
    [ ! -e "$INSTALL/web" ]
}

@test "BW_INSTALL_FULL=1 on an existing sparse install restores the full tree" {
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [ ! -e "$INSTALL/web" ]

    BW_INSTALL_FULL=1 run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [ -d "$INSTALL/web" ]
    [ -d "$INSTALL/video" ]
    [ "$(git -C "$INSTALL" config --bool core.sparseCheckout)" = "false" ]
}

@test "an existing full install is updated, not converted to sparse" {
    BW_INSTALL_FULL=1 run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]

    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [ -d "$INSTALL/web" ]
}

@test "falls back to a full clone when sparse-checkout is unavailable" {
    local real_git
    real_git=$(command -v git)
    # A git without the sparse-checkout command (like git < 2.25).
    stub git "for a in \"\$@\"; do
    if [ \"\$a\" = sparse-checkout ]; then
        echo \"git: 'sparse-checkout' is not a git command.\" >&2
        exit 1
    fi
done
exec '$real_git' \"\$@\""

    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Note: lightweight download not supported"* ]]
    [[ "$output" == *"Full install complete"* ]]

    assert_runtime_present
    [ -d "$INSTALL/web" ]
    [ -z "$(git -C "$INSTALL" status --porcelain)" ]
    [ "$(grep -cxF "source $INSTALL/init.sh" "$HOME/.zshrc")" -eq 1 ]
}

@test "a server without --filter support still gives a working sparse install" {
    # git ignores the filter with a warning and downloads every object;
    # the checkout stays sparse.
    private_source
    git -C "$SRC" config uploadpack.allowFilter false

    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]
    [[ "$output" == *"filtering not recognized by server"* ]]
    assert_runtime_present
    [ ! -e "$INSTALL/web" ]
    [ -z "$(git -C "$INSTALL" status --porcelain)" ]
}

@test "uninstall.sh removes a sparse install and its rc lines" {
    run bash "$REPO/install.sh"
    [ "$status" -eq 0 ]

    BW_UNINSTALL_NO_TTY=1 run bash "$INSTALL/uninstall.sh" --yes
    [ "$status" -eq 0 ]
    [ ! -e "$INSTALL" ]
    run grep -c 'bash-wizardry' "$HOME/.zshrc"
    [ "$output" = "0" ]
}

@test "fails with a clear message when git is missing" {
    mkdir -p "$BATS_TEST_TMPDIR/nogit"
    PATH="$BATS_TEST_TMPDIR/nogit" run /bin/bash "$REPO/install.sh"
    [ "$status" -eq 1 ]
    [[ "$output" == *"git is required"* ]]
    [ ! -e "$INSTALL" ]
}
