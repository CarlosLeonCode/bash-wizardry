# Contributing to bash-wizardry

Thank you for your interest in contributing! We want to make the terminal a more magical place for everyone.

## How to Contribute

1.  **Fork the repo** to your own GitHub account.
2.  **Clone your fork** locally.
3.  **Create a branch** for your feature or fix (`git checkout -b my-new-spell`).
4.  **Add your magic**.
    *   If you are adding a new module, create a `.sh` file in `modules/`.
    *   Ensure your functions have prefixes (like `g` for git, `dckr` for docker) to avoid collisions.
    *   Add comments explaining what each function does.
5.  **Test your changes**. Run `source init.sh` to load them into your shell.
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
