# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
For a friendlier tour of each release, see What's New? in
[English](docs/en/changelog.md) or [Spanish](docs/es/cambios.md).

## [Unreleased]

## [2.0.0] - Unreleased

<!-- The date is set when the v2.0.0 tag is created. -->

Agent-safe core: a sturdier shell setup that stays out of the way of AI coding agents.

### Breaking changes

- `rails generate` moved from `rg` to `rgen`, so ripgrep's `rg` is no longer shadowed.
- `.bw-on-enter` hooks run only after you approve them with `ws-trust`. Approval is pinned to the file's sha256, so any edit needs a new approval. Existing hooks stop running until trusted.
- Spells that would shadow an installed command, a builtin or a keyword (for example `rs`, `gs` with Ghostscript, `r` in Zsh) are skipped at load time. `bw-help` lists them; keep any with `BW_ALLOW_OVERRIDE`.

### Added

- Agent mode: in non-interactive shells, or when an agent variable such as `CLAUDECODE` is set, `init.sh` only adds `scripts/` to `PATH`. Controlled with `BW_AGENT_MODE=auto|1|0` and `BW_AGENT_ENV_VARS`.
- Collision guard with `BW_ALLOW_OVERRIDE` and `BW_SKIPPED_COMMANDS`.
- `bwiz` CLI: `bwiz help [--json] [module]`, `bwiz modules`, `bwiz version`.
- Command catalog (`catalog/commands.tsv`, `catalog/commands.es.tsv`) as the single source of truth for `bw-help`, `bwiz` and the website.
- User config and user modules in `~/.config/bash-wizardry/` (`BW_CONFIG_HOME`); a user module named like a core one replaces it.
- `uninstall.sh` (`--yes`, `--purge`), with a backup of every edited shell startup file.
- Bats test suite for Bash and Zsh, and CI with ShellCheck on Ubuntu and macOS.
- New website at [bashwizardry.com](https://bashwizardry.com) in English and Spanish, with a product film.
- Community files: security policy, code of conduct, issue forms, pull request template, `.editorconfig`, `.gitattributes`, Dependabot.

### Fixed

- Confirmation prompts (`greset`, `n-clean`, `dckrprune`, `rdbreset`...) work in Zsh.
- `ws` works in Zsh and with multiple roots; the Docker container picker returns the right ID.
- `gclean` never deletes the default, current or protected branches (`BW_GIT_PROTECTED_BRANCHES`) and asks first.
- `bw-update` reloads the shell and reports failures; `djstartapp` works on macOS; completions load; `docker-cleanup.sh` is executable.
- Docs and hints use the real Docker commands (`dckrexec`, `dckrlogs`, `dckrclean`).

### Changed

- Re-sourcing `init.sh` no longer duplicates the `scripts/` entry in `PATH`.
- The roadmap moved from `planning.md` to [docs/roadmap.md](docs/roadmap.md).

## [1.0.0]

Deep context and workspaces.

### Added

- `ws` (Magic Workspaces): fuzzy navigation between projects with `fzf`, multiple roots in `BW_WORKSPACE_ROOTS`, and `.bw-on-enter` hooks.
- Auto-discovery: detects the project type (Node, Docker, Django, Rails) on `cd` and shows a short tip.
- `env-set`: switches `.env.<name>` files into `.env`, backing up manual changes first.
- Documentation in English and Spanish, with per-module guides.

### Changed

- `init.sh` supports older Bash versions, such as macOS's default Bash 3.2.

<!--
Compare links are added once release tags exist, for example:
[Unreleased]: https://github.com/CarlosLeonCode/bash-wizardry/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/CarlosLeonCode/bash-wizardry/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/CarlosLeonCode/bash-wizardry/releases/tag/v1.0.0
-->
