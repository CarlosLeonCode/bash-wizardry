# Contributing to bash-wizardry

Thank you for your interest in contributing! We want to make the terminal a more magical place for everyone.

## How to Contribute

> Just want spells for yourself? Put them in a user module in `~/.config/bash-wizardry/modules/`, no fork needed. See [Customization](docs/en/customization.md).

1.  **Fork the repo** to your own GitHub account.
2.  **Clone your fork** locally.
3.  **Create a branch** for your feature or fix (`git checkout -b my-new-spell`).
4.  **Add your magic**.
    *   If you are adding a new module, create a `.sh` file in `modules/`.
    *   Ensure your functions have prefixes (like `g` for git, `dckr` for docker) to avoid collisions.
    *   Add comments explaining what each function does.
    *   **Add a row to `catalog/commands.tsv`** for every new public alias or function (`module`, `name`, `kind`, `usage`, `description`; tab-separated, no double quotes or backslashes). End the description with `Asks first.` when the command confirms before acting. The test suite fails when the catalog and the modules disagree. Add the matching Spanish description (without `Asks first.`) to `catalog/commands.es.tsv`, in the same order.
    *   Regenerate the website's copy of the catalog: `bash tools/gen-catalog.sh`.
5.  **Test your changes**. Run `source init.sh` to load them into your shell, then run the suite with `bats tests/` (needs [bats-core](https://github.com/bats-core/bats-core), `zsh` and `jq`).
6.  **Commit your changes** (`git commit -m 'Add a spell for Kubernetes'`).
7.  **Push to your branch** (`git push origin my-new-spell`).
8.  **Open a Pull Request**.

## Guidelines

*   **Keep it Simple:** One alias/function should do one thing well.
*   **Safety First:** If a command is destructive (deletes files, drops DBs), ALWAYS ask for confirmation.
*   **Interactivity:** Use `select` or menus for complex tasks.
*   **English:** Please keep code comments and output messages in English.

## Reporting Bugs

If you find a bug, please open an issue describing the problem and how to reproduce it.

Happy hacking! 🧙‍♂️
