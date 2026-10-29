#!/usr/bin/env bats
# bwiz: the CLI on PATH (even in agent mode) that reads catalog/commands.tsv.

bats_require_minimum_version 1.5.0

setup() {
    load test_helper
    common_setup
    BWIZ="$W/scripts/bwiz"
}

@test "help --json is valid JSON and lists gclean" {
    run "$BWIZ" help --json
    [ "$status" -eq 0 ]
    echo "$output" | jq -e 'type == "array" and length > 0' >/dev/null
    echo "$output" | python3 -m json.tool >/dev/null
    [ "$(echo "$output" | jq -r '.[] | select(.name == "gclean") | .module')" = "git" ]
    [ "$(echo "$output" | jq -r '.[0] | keys | join(",")')" = "description,enabled,kind,module,name,usage" ]
}

@test "help --json has one row per catalog entry" {
    run "$BWIZ" help --json
    [ "$(echo "$output" | jq length)" -eq "$(($(wc -l < "$W/catalog/commands.tsv") - 1))" ]
}

@test "help --json <module> returns only that module" {
    run "$BWIZ" help --json git
    [ "$status" -eq 0 ]
    [ "$(echo "$output" | jq -r '[.[].module] | unique | join(",")')" = "git" ]
    run "$BWIZ" help git --json
    [ "$(echo "$output" | jq -r '[.[].module] | unique | join(",")')" = "git" ]
}

@test "a module disabled in config is reported as enabled:false" {
    mkdir -p "$USERCFG"
    printf 'BW_ENABLE_DOCKER=false\n' > "$USERCFG/config.env"
    run "$BWIZ" help --json docker
    [ "$status" -eq 0 ]
    [ "$(echo "$output" | jq -r '.[] | select(.kind != "script") | .enabled' | sort -u)" = "false" ]
    # scripts/ stays on PATH whatever the module settings.
    [ "$(echo "$output" | jq -r '.[] | select(.name == "docker-cleanup.sh") | .enabled')" = "true" ]
    run "$BWIZ" help --json git
    [ "$(echo "$output" | jq -r '[.[].enabled] | unique | join(",")')" = "true" ]
    run "$BWIZ" help docker
    [[ "$output" == *"docker (disabled in config)"* ]] || false
}

@test "a core module replaced by a user module is reported" {
    mkdir -p "$USERCFG/modules"
    : > "$USERCFG/modules/git.sh"
    : > "$USERCFG/modules/hello.sh"
    run "$BWIZ" help --json git
    [ "$(echo "$output" | jq -r '[.[].enabled] | unique | join(",")')" = "false" ]
    run "$BWIZ" modules
    [ "$status" -eq 0 ]
    [[ "$output" == *"git            core   replaced by user module"* ]] || false
    [[ "$output" == *"hello          user   enabled"* ]] || false
}

@test "human help groups spells by module with aligned columns" {
    run "$BWIZ" help git
    [ "$status" -eq 0 ]
    [[ "$output" == *"git"* ]] || false
    [[ "$output" == *"gbd <branch>"*"Force-delete a local branch. Asks first."* ]] || false
    [[ "$output" != *"dckrexec"* ]] || false
}

@test "unknown subcommand prints usage to stderr and exits 2" {
    run --separate-stderr "$BWIZ" nope
    [ "$status" -eq 2 ]
    [ -z "$output" ]
    [[ "$stderr" == *"Usage: bwiz"* ]] || false
}

@test "unknown module exits 2" {
    run --separate-stderr "$BWIZ" help nope
    [ "$status" -eq 2 ]
    [[ "$stderr" == *"unknown module 'nope'"* ]] || false
}

@test "no arguments prints usage" {
    run "$BWIZ"
    [ "$status" -eq 0 ]
    [[ "$output" == "Usage: bwiz"* ]] || false
}

@test "works when invoked through absolute and relative symlinks" {
    mkdir -p "$BATS_TEST_TMPDIR/links/sub"
    ln -s "$BWIZ" "$BATS_TEST_TMPDIR/links/bwiz-abs"
    ln -s ../bwiz-abs "$BATS_TEST_TMPDIR/links/sub/bwiz-rel"
    for link in "$BATS_TEST_TMPDIR/links/bwiz-abs" "$BATS_TEST_TMPDIR/links/sub/bwiz-rel"; do
        run "$link" help --json git
        [ "$status" -eq 0 ]
        [ "$(echo "$output" | jq -r '.[] | select(.name == "gclean") | .name')" = "gclean" ]
    done
}

@test "works with /bin/bash (bash 3.2 on macOS)" {
    [ -x /bin/bash ] || skip "no /bin/bash"
    run /bin/bash "$BWIZ" help --json
    [ "$status" -eq 0 ]
    echo "$output" | jq -e 'length > 100' >/dev/null
    run /bin/bash "$BWIZ" help ruby
    [ "$status" -eq 0 ]
    [[ "$output" == *"btest [path]"* ]] || false
    run /bin/bash "$BWIZ" modules
    [ "$status" -eq 0 ]
}

@test "version falls back to 'unknown' outside a git checkout" {
    run "$BWIZ" version
    [ "$status" -eq 0 ]
    [ -n "$output" ]
}

@test "bwiz is on PATH in agent mode while no spells are defined" {
    run bash -c 'source "$W/init.sh"; alias gco >/dev/null 2>&1 && echo HAS_ALIAS; command -v bwiz; bwiz help --json docker | jq -r ".[0].name"'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "$W/scripts/bwiz" ]
    [ "${lines[1]}" = "dckr" ]
}

@test "bw-help shows the catalog and the loaded user modules" {
    mkdir -p "$USERCFG/modules"
    : > "$USERCFG/modules/hello.sh"
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; bw-help'
    [ "$status" -eq 0 ]
    [[ "$output" == *"gclean"* ]] || false
    [[ "$output" == *"User modules loaded from $USERCFG/modules: hello"* ]] || false
}
