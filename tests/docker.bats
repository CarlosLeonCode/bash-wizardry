#!/usr/bin/env bats
# _dckr_select_container: the menu goes to stderr, the choice to stdout.

setup() {
    load test_helper
    common_setup
    stub docker 'printf "abc123 web\ndef456 db\n"'
}

@test "bash: picking option 2 returns exactly the second container" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; out=$(_dckr_select_container <<< 2 2>/dev/null); echo "RESULT=[$out]"'
    [ "$status" -eq 0 ]
    [ "$output" = "RESULT=[def456 db]" ]
}

@test "zsh: picking option 2 returns exactly the second container" {
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh"; out=$(_dckr_select_container <<< 2 2>/dev/null); echo "RESULT=[$out]"'
    [ "$status" -eq 0 ]
    [ "$output" = "RESULT=[def456 db]" ]
}

@test "an invalid choice fails without output" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; out=$(_dckr_select_container <<< 9 2>/dev/null); echo "rc=$? RESULT=[$out]"'
    [ "$output" = "rc=1 RESULT=[]" ]
}
