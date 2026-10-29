# Shared setup for the bash-wizardry test suite.
#
# Every test gets:
#   W        A private copy of the runtime files (init.sh, modules/,
#            completions/, scripts/, catalog/). The developer's gitignored
#            config.env is never copied, so results do not depend on local
#            settings.
#   HOME     An empty temp dir, so real config/trust files are never touched.
#   USERCFG  "$HOME/.config/bash-wizardry", the default BW_CONFIG_HOME
#            (not created).
#   STUBBIN  A temp dir at the front of PATH for stub executables.
#   PATH     "$STUBBIN:/usr/bin:/bin" plus the dirs holding zsh, git and jq.
#
# Tests run the code in a fresh 'bash -c' or 'zsh -fc' subprocess.

REPO="$(cd "$BATS_TEST_DIRNAME/.." && pwd)"

AGENT_VARS="CLAUDECODE CLAUDE_CODE_ENTRYPOINT CODEX_SANDBOX CODEX_THREAD_ID CURSOR_AGENT GEMINI_CLI AI_AGENT"

common_setup() {
    local zsh_bin git_bin jq_bin var
    zsh_bin=$(command -v zsh || true)
    git_bin=$(command -v git || true)
    jq_bin=$(command -v jq || true)

    export W="$BATS_TEST_TMPDIR/wizardry"
    mkdir -p "$W"
    cp -R "$REPO/init.sh" "$REPO/modules" "$REPO/completions" "$REPO/scripts" "$REPO/catalog" "$W/"

    export HOME="$BATS_TEST_TMPDIR/home"
    mkdir -p "$HOME"
    export USERCFG="$HOME/.config/bash-wizardry"

    export STUBBIN="$BATS_TEST_TMPDIR/bin"
    mkdir -p "$STUBBIN"

    PATH="$STUBBIN:/usr/bin:/bin"
    for var in "${zsh_bin%/*}" "${git_bin%/*}" "${jq_bin%/*}"; do
        [ -n "$var" ] || continue
        case ":$PATH:" in *":$var:"*) ;; *) PATH="$PATH:$var" ;; esac
    done
    export PATH

    # Agent detection, user config and rc-file hooks must not leak in.
    # shellcheck disable=SC2086 # intentional word splitting
    unset $AGENT_VARS BASH_ENV ENV ZDOTDIR XDG_CONFIG_HOME
    for var in $(compgen -v BW_); do unset "$var"; done
}

# Creates an executable stub in STUBBIN: stub <name> [body]
stub() {
    printf '#!/bin/sh\n%s\n' "${2:-exit 0}" > "$STUBBIN/$1"
    chmod +x "$STUBBIN/$1"
}
