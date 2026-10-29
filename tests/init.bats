#!/usr/bin/env bats
# Loading flow: full load, agent mode detection, PATH handling.

bats_require_minimum_version 1.5.0

setup() {
    load test_helper
    common_setup
}

# Prints which bash-wizardry names exist, one marker per line.
PROBE_BASH='alias gco >/dev/null 2>&1 && echo HAS_ALIAS; type ws >/dev/null 2>&1 && echo HAS_WS; echo "active=${BW_AGENT_ACTIVE:-}"'
PROBE_ZSH='alias gco >/dev/null 2>&1 && echo HAS_ALIAS; whence -w ws >/dev/null 2>&1 && echo HAS_WS; echo "active=${BW_AGENT_ACTIVE:-}"'

@test "bash: BW_AGENT_MODE=0 loads aliases and functions" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; alias gco; type -t ws'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "alias gco='git checkout'" ]
    [ "${lines[1]}" = "function" ]
}

@test "zsh: BW_AGENT_MODE=0 loads aliases and functions" {
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh"; alias gco; whence -w ws'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "gco='git checkout'" ]
    [ "${lines[1]}" = "ws: function" ]
}

@test "bash: auto mode in a non-interactive shell defines nothing" {
    run bash -c 'source "$W/init.sh"; '"$PROBE_BASH"
    [ "$status" -eq 0 ]
    [ "$output" = "active=1" ]
}

@test "zsh: auto mode in a non-interactive shell defines nothing" {
    run zsh -fc 'source "$W/init.sh"; '"$PROBE_ZSH"
    [ "$status" -eq 0 ]
    [ "$output" = "active=1" ]
}

@test "bash: interactive shell without agent variables loads everything" {
    run --separate-stderr bash --norc -i -c 'source "$W/init.sh"; '"$PROBE_BASH"
    [ "$status" -eq 0 ]
    [ "$output" = "$(printf 'HAS_ALIAS\nHAS_WS\nactive=')" ]
}

@test "zsh: interactive shell without agent variables loads everything" {
    run --separate-stderr zsh -f -i -c 'source "$W/init.sh"; '"$PROBE_ZSH"
    [ "$status" -eq 0 ]
    [ "$output" = "$(printf 'HAS_ALIAS\nHAS_WS\nactive=')" ]
}

@test "bash: CLAUDECODE=1 triggers agent mode in an interactive shell" {
    CLAUDECODE=1 run --separate-stderr bash --norc -i -c 'source "$W/init.sh"; '"$PROBE_BASH"
    [ "$status" -eq 0 ]
    [ "$output" = "active=1" ]
}

@test "zsh: CLAUDECODE=1 triggers agent mode in an interactive shell" {
    CLAUDECODE=1 run --separate-stderr zsh -f -i -c 'source "$W/init.sh"; '"$PROBE_ZSH"
    [ "$status" -eq 0 ]
    [ "$output" = "active=1" ]
}

@test "zsh: a custom BW_AGENT_ENV_VARS list is honored" {
    MY_AGENT=yes BW_AGENT_ENV_VARS="  OTHER   MY_AGENT " \
        run --separate-stderr zsh -f -i -c 'source "$W/init.sh"; '"$PROBE_ZSH"
    [ "$status" -eq 0 ]
    [ "$output" = "active=1" ]
}

@test "bash: a custom BW_AGENT_ENV_VARS list is honored" {
    MY_AGENT=yes BW_AGENT_ENV_VARS="  OTHER   MY_AGENT " \
        run --separate-stderr bash --norc -i -c 'source "$W/init.sh"; '"$PROBE_BASH"
    [ "$status" -eq 0 ]
    [ "$output" = "active=1" ]
}

@test "BW_AGENT_MODE=1 forces agent mode in interactive bash and zsh" {
    BW_AGENT_MODE=1 run --separate-stderr bash --norc -i -c 'source "$W/init.sh"; '"$PROBE_BASH"
    [ "$output" = "active=1" ]
    BW_AGENT_MODE=1 run --separate-stderr zsh -f -i -c 'source "$W/init.sh"; '"$PROBE_ZSH"
    [ "$output" = "active=1" ]
}

@test "BW_AGENT_MODE=0 wins over agent variables" {
    CLAUDECODE=1 BW_AGENT_MODE=0 run bash -c 'source "$W/init.sh"; '"$PROBE_BASH"
    [ "$output" = "$(printf 'HAS_ALIAS\nHAS_WS\nactive=')" ]
}

@test "agent mode leaves no helper variables behind" {
    run bash -c 'source "$W/init.sh"; set | grep -E "^bw_" || echo CLEAN'
    [ "$output" = "CLEAN" ]
    run zsh -fc 'source "$W/init.sh"; set | grep -E "^bw_" || echo CLEAN'
    [ "$output" = "CLEAN" ]
}

@test "full load leaves no helper variables behind" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; set | grep -E "^bw_" || echo CLEAN'
    [ "$output" = "CLEAN" ]
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh"; set | grep -E "^bw_" || echo CLEAN'
    [ "$output" = "CLEAN" ]
}

@test "scripts/ is on PATH in agent mode (bash and zsh)" {
    run bash -c 'source "$W/init.sh"; command -v docker-cleanup.sh'
    [ "$status" -eq 0 ]
    [ "$output" = "$W/scripts/docker-cleanup.sh" ]
    run zsh -fc 'source "$W/init.sh"; echo "$PATH"'
    [ "${output%%:*}" = "$(cd "$W/scripts" && pwd -P)" ]
}

@test "zsh: WIZARDRY_DIR is absolute when sourced as ./init.sh" {
    run zsh -fc 'cd "$W" && source ./init.sh && echo "$WIZARDRY_DIR"'
    [ "$status" -eq 0 ]
    [ "$output" = "$(cd "$W" && pwd -P)" ]
}

@test "re-sourcing does not duplicate the scripts/ PATH entry" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; source "$W/init.sh"; echo "$PATH" | tr : "\n" | grep -c "/scripts$"'
    [ "$output" = "1" ]
    run zsh -fc 'source "$W/init.sh"; source "$W/init.sh"; echo "$PATH" | tr : "\n" | grep -c "/scripts$"'
    [ "$output" = "1" ]
}
