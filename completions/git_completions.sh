#!/bin/bash
#
# Bash Completion for Git Wizardry Module
#
# This script provides intelligent autocompletion for the custom git functions
# defined in git.sh. It suggests branches for commands like gco, gp, and gbd,
# and suggests git-tracked files for commands like ga and grstr.

# -----------------------------------------------------------------------------
#  HELPER FUNCTIONS (COMPLETERS)
# -----------------------------------------------------------------------------

# A reusable completer function that suggests both local and remote branch names.
# This follows the DRY principle, as the same logic is used for multiple commands.
_git_branch_completer() {
    # COMP_WORDS: An array of the words in the current command line.
    # COMP_CWORD: The index of the word where the cursor is.
    # current_word: The specific word the user is currently typing.
    local current_word="${COMP_WORDS[COMP_CWORD]}"

    # Get a unique, sorted list of all local and remote branches.
    # The 'sed' command strips the 'origin/' prefix from remote branches.
    local branches=$(git branch --all --format='%(refname:short)' | sed 's|origin/||' | sort -u)

    # COMPREPLY is the special array variable that Bash uses to store the suggestions.
    # 'compgen' is a Bash builtin that generates possible completions.
    COMPREPLY=($(compgen -W "${branches}" -- "${current_word}"))
}

# A reusable completer function that suggests files currently tracked by Git.
# This is more useful than suggesting all files in the directory.
_git_file_completer() {
    local current_word="${COMP_WORDS[COMP_CWORD]}"
    # 'git ls-files' lists all files in the index and the working tree.
    local files=$(git ls-files)
    COMPREPLY=($(compgen -W "${files}" -- "${current_word}"))
}

# -----------------------------------------------------------------------------
#  COMMAND REGISTRATIONS
# -----------------------------------------------------------------------------

# Here, we tell Bash which function to use for which command.
# This is the "glue" that connects our completer logic to our aliases.

# Use the branch completer for all commands that operate on branches.
complete -F _git_branch_completer gco
complete -F _git_branch_completer gbd
complete -F _git_branch_completer gm
complete -F _git_branch_completer gp

# Use the file completer for commands that operate on files.
complete -F _git_file_completer ga
complete -F _git_file_completer grstr
