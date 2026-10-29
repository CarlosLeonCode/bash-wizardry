#!/usr/bin/env bats
# gclean: deletes merged branches only, never protected/current/unmerged ones.

setup() {
    load test_helper
    common_setup
    export GIT_AUTHOR_NAME="bats" GIT_AUTHOR_EMAIL="bats@example.com"
    export GIT_COMMITTER_NAME="bats" GIT_COMMITTER_EMAIL="bats@example.com"
    export GIT_CONFIG_NOSYSTEM=1

    local t="$BATS_TEST_TMPDIR"
    git -c init.defaultBranch=main init -q --bare "$t/origin.git"
    git -c init.defaultBranch=main init -q "$t/seed"
    git -C "$t/seed" commit -q --allow-empty -m "root"
    git -C "$t/seed" push -q "$t/origin.git" main
    git clone -q "$t/origin.git" "$t/work"

    REPO_DIR="$t/work"
    export REPO_DIR
    git -C "$REPO_DIR" branch stage
    # feat-a: merged into main and pushed.
    git -C "$REPO_DIR" checkout -q -b feat-a
    git -C "$REPO_DIR" commit -q --allow-empty -m "feat a"
    git -C "$REPO_DIR" checkout -q main
    git -C "$REPO_DIR" merge -q --ff-only feat-a
    git -C "$REPO_DIR" push -q origin main
    # feat-b: never merged.
    git -C "$REPO_DIR" checkout -q -b feat-b
    git -C "$REPO_DIR" commit -q --allow-empty -m "feat b"
    # feat-cur: merged, but it is the current branch.
    git -C "$REPO_DIR" checkout -q main
    git -C "$REPO_DIR" checkout -q -b feat-cur
}

@test "gclean deletes only merged, unprotected, non-current branches (bash and zsh)" {
    for sh in "bash -c" "zsh -fc"; do
        # Recreate the merged branch so each shell has something to clean.
        git -C "$REPO_DIR" branch feat-a main 2>/dev/null || true
        run $sh 'BW_AGENT_MODE=0; source "$W/init.sh"; _bw_confirm() { return 0; }
            cd "$REPO_DIR" && gclean >/dev/null 2>&1
            git branch --format="%(refname:short)" | tr "\n" " "'
        [ "$status" -eq 0 ]
        [ "$output" = "feat-b feat-cur main stage " ]
    done
}

@test "gclean asks first and keeps everything when declined" {
    run bash -c 'BW_AGENT_MODE=0; source "$W/init.sh"; _bw_confirm() { return 1; }
        cd "$REPO_DIR" && gclean >/dev/null 2>&1
        git branch --format="%(refname:short)" | tr "\n" " "'
    [ "$output" = "feat-a feat-b feat-cur main stage " ]
}
