#!/usr/bin/env bats
# ws: exact-match navigation across several roots and trusted on-enter hooks.

setup() {
    load test_helper
    common_setup
    ROOTS="$BATS_TEST_TMPDIR/roots"
    mkdir -p "$ROOTS/a/other" "$ROOTS/b/proj"
    printf 'echo HOOK_RAN\n' > "$ROOTS/b/proj/.bw-on-enter"
    # A missing root first, then two real ones; 'proj' only lives in the second.
    export BW_WORKSPACE_ROOTS="$ROOTS/missing:$ROOTS/a:$ROOTS/b"
    export ROOTS
}

shells() { printf '%s\n' "bash -c" "zsh -fc"; }

@test "ws <name> cds into the exact match (bash and zsh)" {
    while IFS= read -r sh; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; ws proj >/dev/null; echo "$PWD"'
        [ "$status" -eq 0 ]
        [ "${lines[${#lines[@]}-1]}" = "$ROOTS/b/proj" ]
    done < <(shells)
}

@test "an untrusted .bw-on-enter never runs (bash and zsh)" {
    while IFS= read -r sh; do
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; ws proj'
        [ "$status" -eq 0 ]
        [[ "$output" != *"HOOK_RAN"* ]] || false
        [[ "$output" == *"Untrusted .bw-on-enter found"* ]] || false
    done < <(shells)
}

@test "a trusted .bw-on-enter runs (bash and zsh)" {
    while IFS= read -r sh; do
        rm -f "$HOME/.config/bash-wizardry/trusted_hooks"
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"
            mkdir -p "${BW_TRUST_FILE%/*}"
            (cd "$ROOTS/b/proj" && _bw_hook_id .bw-on-enter >> "$BW_TRUST_FILE")
            ws proj'
        [ "$status" -eq 0 ]
        [[ "$output" == *"HOOK_RAN"* ]] || false
    done < <(shells)
}

@test "editing a trusted hook revokes trust" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"
        mkdir -p "${BW_TRUST_FILE%/*}"
        (cd "$ROOTS/b/proj" && _bw_hook_id .bw-on-enter >> "$BW_TRUST_FILE")
        echo "echo EDITED" >> "$ROOTS/b/proj/.bw-on-enter"
        ws proj'
    [[ "$output" != *"HOOK_RAN"* ]] || false
    [[ "$output" == *"Untrusted .bw-on-enter found"* ]] || false
}
