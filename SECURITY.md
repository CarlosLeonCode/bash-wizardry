# Security Policy

bash-wizardry is sourced into your shell on every start, so a bug here can run code you did not intend to run. Thank you for helping keep it safe.

## Supported versions

Security fixes land on `main` and ship in the next release. Only the latest release (and `main`) is supported. If you installed with the installer, `bw-update` brings you to the latest version.

## Reporting a vulnerability

**Please don't open public issues, discussions or pull requests for vulnerabilities.**

Report them privately through GitHub's private vulnerability reporting:

**https://github.com/CarlosLeonCode/bash-wizardry/security/advisories/new**

Please include:

- What the problem is and what an attacker could do with it.
- Steps to reproduce, or a minimal proof of concept (a `.bw-on-enter` file, a crafted directory, a `config.env` snippet...).
- Your shell and version (`zsh --version` or `bash --version`), your OS, and the output of `bwiz version`.
- Relevant settings from your `config.env` (for example `BW_AGENT_MODE`, `BW_ALLOW_OVERRIDE`, enabled modules).
- Whether it needs a non-default setting or user interaction to trigger.

## What to expect

This is a project maintained in spare time, so responses are best effort:

- We aim to acknowledge your report within 7 days.
- We will keep you posted while we confirm the issue and work on a fix.
- Once a fix is released, we will publish an advisory. If you want, we will credit you in the advisory and the release notes.

Please give us a reasonable amount of time to release a fix before disclosing the issue publicly.

## Scope

In scope, for example:

- Anything that makes `init.sh` or a core module execute code the user did not write or approve (for example, simply entering a directory or listing workspaces runs something).
- Bypassing hook trust: a `.bw-on-enter` hook that runs without `ws-trust`, or keeps running after it was edited.
- Bypassing agent-mode detection so aliases, functions or hooks load into an AI agent's shell when they should not.
- Bypassing the collision guard so a spell silently shadows a system command, builtin or keyword.
- Destructive spells that act without the confirmation they promise.
- Issues in `install.sh`, `uninstall.sh`, `bw-update` or `bwiz` (for example, writing or deleting files outside what they document, or unsafe handling of paths or input).
- The website ([bashwizardry.com](https://bashwizardry.com)), source in `web/`.

Out of scope:

- Code you wrote yourself in your own user modules (`~/.config/bash-wizardry/modules/`) or in `config.env`.
- Hooks you reviewed and approved with `ws-trust`: approving a hook means you trust what it runs.
- Vulnerabilities in third-party tools that spells call (`git`, `docker`, `npm`, `fzf`...). Please report those to their maintainers.
- Issues that need an attacker who can already write to your home directory or shell profile.
