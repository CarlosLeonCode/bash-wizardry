#!/usr/bin/env bats
# Collision guard: spells never shadow real commands, builtins or keywords.

setup() {
    load test_helper
    common_setup
    stub rs
}

@test "bash: an alias shadowing an executable on PATH is skipped" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; alias rs >/dev/null 2>&1 && echo HAS_RS; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" != "HAS_RS" ]
    [[ " ${lines[0]#skipped=} " == *" rs "* ]] || false
}

@test "zsh: an alias shadowing an executable on PATH is skipped" {
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh"; alias rs >/dev/null 2>&1 && echo HAS_RS; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" != "HAS_RS" ]
    [[ " ${lines[0]#skipped=} " == *" rs "* ]] || false
}

@test "bash: BW_ALLOW_OVERRIDE keeps a colliding alias" {
    run bash -c 'BW_AGENT_MODE=0; BW_ALLOW_OVERRIDE="x rs"; source "$W/init.sh"; alias rs; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "alias rs='rails server'" ]
    [[ " ${lines[1]#skipped=} " != *" rs "* ]] || false
}

@test "zsh: BW_ALLOW_OVERRIDE keeps a colliding alias" {
    run zsh -fc 'BW_AGENT_MODE=0; BW_ALLOW_OVERRIDE="x rs"; source "$W/init.sh"; alias rs; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "rs='rails server'" ]
    [[ " ${lines[1]#skipped=} " != *" rs "* ]] || false
}

@test "zsh: the 'r' alias is skipped because r is a zsh builtin" {
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh"; alias r >/dev/null 2>&1 && echo HAS_R; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "$status" -eq 0 ]
    [ "${lines[0]}" != "HAS_R" ]
    [[ " ${lines[0]#skipped=} " == *" r "* ]] || false
}

@test "bash: a user alias defined before loading is never touched" {
    run bash -c 'alias rs="echo mine"; BW_AGENT_MODE=0; source "$W/init.sh"; alias rs >/dev/null && echo HAS_RS; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "${lines[0]}" = "HAS_RS" ]
    [[ " ${lines[1]#skipped=} " != *" rs "* ]] || false
}

@test "zsh: a user alias defined before loading is never touched" {
    run zsh -fc 'alias rs="echo mine"; BW_AGENT_MODE=0; source "$W/init.sh"; alias rs >/dev/null && echo HAS_RS; echo "skipped=$BW_SKIPPED_COMMANDS"'
    [ "${lines[0]}" = "HAS_RS" ]
    [[ " ${lines[1]#skipped=} " != *" rs "* ]] || false
}

@test "builtins, keywords and functions are guarded in bash and zsh" {
    # A throwaway module that collides with a builtin (cd), a reserved word
    # (time) and a PATH executable via a function (bwtool), next to a safe name.
    # (Not 'rs': zsh would expand the earlier 'rs' alias inside 'rs() {...}'.)
    stub bwtool
    cat > "$W/modules/zz_fake.sh" <<'EOF'
alias time='echo hijacked'
cd() { echo hijacked; }
bwtool() { echo hijacked; }
bwsafe() { echo safe; }
EOF
    for sh in "bash -c" "zsh -fc"; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; echo "skipped=$BW_SKIPPED_COMMANDS"; bwsafe'
        [ "$status" -eq 0 ]
        [[ " ${lines[0]#skipped=} " == *" time "* ]] || false
        [[ " ${lines[0]#skipped=} " == *" cd "* ]] || false
        [[ " ${lines[0]#skipped=} " == *" bwtool "* ]] || false
        [[ " ${lines[0]#skipped=} " != *" bwsafe "* ]] || false
        [ "${lines[1]}" = "safe" ]
    done
}

@test "non-colliding spells are kept and re-sourcing keeps the same result" {
    run zsh -fc 'BW_AGENT_MODE=0; source "$W/init.sh"; a=$BW_SKIPPED_COMMANDS; source "$W/init.sh"; [ "$a" = "$BW_SKIPPED_COMMANDS" ] && echo SAME; alias gco'
    [ "${lines[0]}" = "SAME" ]
    [ "${lines[1]}" = "gco='git checkout'" ]
}

@test "bw-help lists skipped spells and how to allow them" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; bw-help'
    [ "$status" -eq 0 ]
    [[ "$output" == *"Skipped (would shadow an existing command): "*"rs"* ]] || false
    [[ "$output" == *'Allow with BW_ALLOW_OVERRIDE="name ..." in config.env'* ]] || false
}
