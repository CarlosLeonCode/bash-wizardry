#!/usr/bin/env bats
# User config and user modules in BW_CONFIG_HOME: customize without forking.

bats_require_minimum_version 1.5.0

setup() {
    load test_helper
    common_setup
    mkdir -p "$USERCFG/modules"
    printf 'hello() { echo "hello from user"; }\n' > "$USERCFG/modules/hello.sh"
}

@test "a user module is loaded (bash and zsh)" {
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; hello; echo "loaded=$BW_USER_MODULES_LOADED"'
        [ "$status" -eq 0 ]
        [ "${lines[0]}" = "hello from user" ]
        [ "${lines[1]}" = "loaded=hello" ]
    done
}

@test "BW_CONFIG_HOME points to a custom config directory" {
    custom="$BATS_TEST_TMPDIR/custom"
    mkdir -p "$custom/modules"
    printf 'other() { echo other; }\n' > "$custom/modules/other.sh"
    BW_CONFIG_HOME="$custom" run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; other; type hello >/dev/null 2>&1 || echo NO_HELLO'
    [ "$status" -eq 0 ]
    [ "$output" = "$(printf 'other\nNO_HELLO')" ]
}

@test "a user git.sh replaces the core git module (bash and zsh)" {
    printf 'mygit() { echo mine; }\n' > "$USERCFG/modules/git.sh"
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"
            mygit
            type gclean >/dev/null 2>&1 && echo HAS_GCLEAN
            alias gco >/dev/null 2>&1 && echo HAS_GCO
            echo "loaded=$BW_USER_MODULES_LOADED"'
        [ "$status" -eq 0 ]
        [ "$output" = "$(printf 'mine\nloaded=git hello')" ]
    done
}

@test "the user config.env overrides the repo config.env" {
    printf 'BW_ENABLE_DOCKER=true\n' > "$W/config.env"
    printf 'BW_ENABLE_DOCKER=false\n' > "$USERCFG/config.env"
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; type dckrexec >/dev/null 2>&1 && echo HAS_DOCKER; alias gco >/dev/null && echo HAS_GIT'
        [ "$status" -eq 0 ]
        [ "$output" = "HAS_GIT" ]
    done
}

@test "BW_AGENT_MODE set in the user config.env is honored" {
    printf 'BW_AGENT_MODE=1\n' > "$USERCFG/config.env"
    run --separate-stderr zsh -f -i -c 'source "$W/init.sh"; echo "active=$BW_AGENT_ACTIVE"'
    [ "$output" = "active=1" ]
}

@test "agent mode loads no user modules (bash and zsh)" {
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'source "$W/init.sh"; type hello >/dev/null 2>&1 && echo HAS_HELLO; echo "active=$BW_AGENT_ACTIVE loaded=${BW_USER_MODULES_LOADED-}"'
        [ "$status" -eq 0 ]
        [ "$output" = "active=1 loaded=" ]
    done
}

@test "the collision guard never removes a user module's commands (bash and zsh)" {
    stub hello
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; hello; echo "skipped=$BW_SKIPPED_COMMANDS"'
        [ "$status" -eq 0 ]
        [ "${lines[0]}" = "hello from user" ]
        [[ " ${lines[1]#skipped=} " != *" hello "* ]] || false
    done
}

@test "BW_ENABLE_<NAME>=false skips a user module (bash and zsh)" {
    printf 'mytools() { echo tools; }\n' > "$USERCFG/modules/my-tools.sh"
    printf 'BW_ENABLE_HELLO=false\nBW_ENABLE_MY_TOOLS=false\n' > "$USERCFG/config.env"
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; type hello >/dev/null 2>&1 && echo HAS_HELLO; type mytools >/dev/null 2>&1 && echo HAS_TOOLS; echo "loaded=$BW_USER_MODULES_LOADED"'
        [ "$status" -eq 0 ]
        [ "$output" = "loaded=" ]
    done
}

@test "an empty user modules directory is fine in zsh and leaves no helpers behind" {
    rm -f "$USERCFG/modules/hello.sh"
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh" && echo OK; set | grep -E "^bw_" || echo CLEAN'
    [ "$status" -eq 0 ]
    [ "$output" = "$(printf 'OK\nCLEAN')" ]
}

@test "user modules can use _bw_confirm" {
    printf 'askme() { _bw_confirm "Sure?" && echo YES; }\n' > "$USERCFG/modules/ask.sh"
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; echo y | askme'
    [ "$status" -eq 0 ]
    [[ "$output" == *"YES"* ]] || false
}
