#!/usr/bin/env bats
# _bw_confirm: y/N prompt shared by every destructive spell.
#
# Bash only: the zsh branch uses 'read -k', which reads from the terminal
# rather than from piped stdin, so it cannot be driven without a TTY.

setup() {
    load test_helper
    common_setup
}

confirm() {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; printf "%s" "$1" | _bw_confirm "Proceed?"' _ "$1"
}

@test "bash: 'y' confirms" {
    confirm y
    [ "$status" -eq 0 ]
}

@test "bash: 'Y' confirms" {
    confirm Y
    [ "$status" -eq 0 ]
}

@test "bash: 'n' declines" {
    confirm n
    [ "$status" -eq 1 ]
}

@test "bash: empty input declines" {
    confirm ""
    [ "$status" -eq 1 ]
}

@test "bash: Enter alone declines" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; echo | _bw_confirm "Proceed?"'
    [ "$status" -eq 1 ]
}
