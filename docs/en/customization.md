# 🎛️ Customization

Make bash-wizardry yours without forking it. Your settings and your own spells live outside the repository, so `bw-update` never touches them.

## 📁 Where your files live

| Path | What it is |
| :--- | :--- |
| `~/.config/bash-wizardry/config.env` | Your settings. Loads after the repo's `config.env` and wins. |
| `~/.config/bash-wizardry/modules/*.sh` | Your own modules. Load after the core modules. |

The folder is `$BW_CONFIG_HOME`, which defaults to `${XDG_CONFIG_HOME:-$HOME/.config}/bash-wizardry`. Set `BW_CONFIG_HOME` in your environment (or in the repo's `config.env`) to move it, and `BW_USER_MODULES_DIR` to move only the modules folder.

Start from the template:

```bash
mkdir -p ~/.config/bash-wizardry/modules
cp ~/.bash-wizardry/config.env.example ~/.config/bash-wizardry/config.env
```

Every setting works there: `BW_ENABLE_<MODULE>`, `BW_WORKSPACE_ROOTS`, `BW_GIT_PROTECTED_BRANCHES`, `BW_ALLOW_OVERRIDE`, even `BW_AGENT_MODE` (config loads before agent detection).

## 🧩 Your own modules

A module is a `.sh` file in `~/.config/bash-wizardry/modules/`. Its file name is the module name.

```bash
# ~/.config/bash-wizardry/modules/k8s.sh
# Personal Kubernetes spells.

_k8s_context() {
    kubectl config current-context
}

kctx() {
    echo "Context: $(_k8s_context)"
}

kdel() {
    _bw_confirm "Delete pod '$1' in $(_k8s_context)?" && kubectl delete pod "$1"
}
```

Rules of thumb:

- **Toggle it** with `BW_ENABLE_<NAME>=false`. The name is the file name upper-cased, with anything other than letters, digits and `_` turned into `_`: `k8s.sh` → `BW_ENABLE_K8S`, `my-tools.sh` → `BW_ENABLE_MY_TOOLS`.
- **Confirm destructive actions** with `_bw_confirm "Question?"`. It works in Bash and Zsh and returns success only on `y`/`Y`.
- **Prefix helpers** with `_<module>_` (like `_k8s_context`) so they never clash with other modules.
- **Print nothing at load time.** Modules load on every new shell; output there slows startup and breaks tools that parse shell output.
- **Your code, your call:** the collision guard only checks core modules. A user module may define a name that shadows a real command (for example `kubectl`) and it is kept.
- **Agent mode skips everything:** when an AI agent drives the shell, no user modules load either.

`bw-help` lists the user modules that loaded. `bwiz modules` shows every module, its source (`core` or `user`) and whether it is enabled.

## 🔁 Replacing a core module

A user module with the same file name as a core module replaces it. For example, `~/.config/bash-wizardry/modules/git.sh` means the core `modules/git.sh` (and its completions) is not loaded; only your version is. `bwiz help` marks the core spells of a replaced module.

Copy the core file as a starting point if you only want to tweak a few spells:

```bash
cp ~/.bash-wizardry/modules/git.sh ~/.config/bash-wizardry/modules/git.sh
```

From then on, updates to the core `git.sh` no longer reach you, so keep the copy small.

## 🧙 Adding a command to core

Spells shared with everyone go into `modules/` through a pull request. Every public alias or function needs a row in `catalog/commands.tsv`, the single source of truth that feeds `bw-help`, `bwiz help --json` and the website:

```text
module	name	kind	usage	description
git	gclean	function		Delete local branches merged into ... Asks first.
```

- Tab-separated, five columns. `kind` is `alias`, `function` or `script`. `usage` may be empty (the name is used).
- No double quotes or backslashes in the description. End it with `Asks first.` when the command confirms before acting.
- Add the Spanish description for the website to `catalog/commands.es.tsv` (`name`, `description`), in the same order and without `Asks first.`. The generator fails if a row is missing.
- Run `bash tools/gen-catalog.sh` to refresh the website copy, then `bats tests/`. The tests fail if the catalog and the modules disagree.

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the full workflow.

---
[Return to Documentation Index](README.md)
