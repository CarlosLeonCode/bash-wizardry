## Summary

<!-- What does this PR change, and why? -->

## Type of change

- [ ] Bug fix
- [ ] New feature or spell
- [ ] Breaking change (renames or removes a spell, changes default behavior)
- [ ] Documentation
- [ ] Website (`web/`)

## How was it tested?

<!-- Commands you ran, shells you tried (bash/zsh, versions), OS. -->

## Checklist

- [ ] `bats tests/` passes.
- [ ] ShellCheck passes (same command as CI):
      `shellcheck -s bash -S error init.sh install.sh uninstall.sh modules/*.sh completions/*.sh scripts/*.sh scripts/bwiz tools/*.sh`
- [ ] New public spells have a row in `catalog/commands.tsv` and in `catalog/commands.es.tsv`, and I ran `bash tools/gen-catalog.sh`.
- [ ] Destructive spells ask first with `_bw_confirm`.
- [ ] Docs are updated in English (`docs/en`) and Spanish (`docs/es`).
- [ ] For `web/` changes: `npm run lint`, `npx tsc --noEmit` and `npm run build` pass in `web/`.

## Related issue

Closes #
