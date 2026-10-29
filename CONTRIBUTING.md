# Contributing to bash-wizardry

Thank you for your interest in contributing! We want to make the terminal a more magical place for everyone.

By taking part in this project you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

> Just want spells for yourself? Put them in a user module in `~/.config/bash-wizardry/modules/`, no fork needed. See [Customization](docs/en/customization.md).

Development happens on the `stage` branch; `stage` is merged into `main` for releases.

1.  **Fork the repo** to your own GitHub account.
2.  **Clone your fork** locally.
3.  **Create a branch from `stage`** for your feature or fix (`git checkout stage && git checkout -b my-new-spell`).
4.  **Add your magic**.
    *   If you are adding a new module, create a `.sh` file in `modules/`.
    *   Ensure your functions have prefixes (like `g` for git, `dckr` for docker) to avoid collisions.
    *   Add comments explaining what each function does.
    *   **Add a row to `catalog/commands.tsv`** for every new public alias or function (`module`, `name`, `kind`, `usage`, `description`; tab-separated, no double quotes or backslashes). End the description with `Asks first.` when the command confirms before acting. The test suite fails when the catalog and the modules disagree. Add the matching Spanish description (without `Asks first.`) to `catalog/commands.es.tsv`, in the same order.
    *   Regenerate the website's copy of the catalog: `bash tools/gen-catalog.sh`.
5.  **Test your changes**. Run `source init.sh` to load them into your shell, then run the suite with `bats tests/` (needs [bats-core](https://github.com/bats-core/bats-core), `zsh` and `jq`), and ShellCheck with the same command CI uses:
    ```bash
    shellcheck -s bash -S error init.sh install.sh uninstall.sh modules/*.sh completions/*.sh scripts/*.sh scripts/bwiz tools/*.sh
    ```
    For changes in `web/`, run `npm run lint`, `npx tsc --noEmit` and `npm run build` in `web/`.
6.  **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat(git): add a spell for interactive cherry-pick'`).
7.  **Push to your branch** (`git push origin my-new-spell`).
8.  **Open a Pull Request against `stage`** and fill in the checklist in the template. If you opened it against `main` by mistake, don't worry: the maintainer can retarget it.

## Guidelines

*   **Keep it Simple:** One alias/function should do one thing well.
*   **Safety First:** If a command is destructive (deletes files, drops DBs), ALWAYS ask for confirmation with `_bw_confirm`.
*   **Interactivity:** Use `select` or menus for complex tasks.
*   **English:** Please keep code comments and output messages in English. User docs live in both `docs/en` and `docs/es`; update both when you change behavior.
*   **Formatting:** The repo has an [`.editorconfig`](.editorconfig) (UTF-8, LF line endings, final newline, spaces in shell scripts). Most editors pick it up automatically.

## Reporting Bugs and Requesting Features

Open an [issue](https://github.com/CarlosLeonCode/bash-wizardry/issues/new/choose) and pick the bug report or feature request form. The bug form asks for your shell, OS, `bwiz version` and relevant `config.env` settings, which makes bugs much faster to reproduce.

## Security Issues

Please **don't** open public issues for vulnerabilities. Report them privately as described in [SECURITY.md](SECURITY.md).

Happy hacking! 🧙‍♂️
