#!/bin/bash
#
# Ruby Ecosystem Module for bash-wizardry
#
# This module provides a streamlined interface for Ruby, Bundler, and common
# version managers (ASDF, Rbenv, RVM). It favors unified commands that adapt to
# the user's environment.

# -----------------------------------------------------------------------------
#  CORE RUBY & GEM ALIASES
# -----------------------------------------------------------------------------

alias rb='ruby'
alias irb='irb'
alias gemi='gem install'
alias gemr='gem uninstall'
alias gemu='gem update'
alias geml='gem list --local'

# -----------------------------------------------------------------------------
#  BUNDLER WORKFLOW
# -----------------------------------------------------------------------------

# These aliases are fundamental for nearly every Ruby project.
alias bi='bundle install'
alias bu='bundle update'
alias bo='bundle open'
alias be='bundle exec'

# A more versatile test runner.
# It automatically detects if RSpec or Minitest is in the bundle and runs the correct command.
# Usage: btest [path_to_spec_or_test_file]
unalias btest &>/dev/null
unset -f btest &> /dev/null
btest() {
  if bundle list | grep -q 'rspec-core'; then
    echo "-> RSpec detected. Running 'bundle exec rspec $@'..."
    bundle exec rspec "$@"
  else
    echo "-> RSpec not found. Running 'bundle exec rails test $@'..."
    bundle exec rails test "$@"
  fi
}

# -----------------------------------------------------------------------------
#  UNIFIED VERSION MANAGEMENT
# -----------------------------------------------------------------------------

# Helper function to detect the active version manager.
_rb_get_manager() {
  if command -v asdf &> /dev/null; then
    echo "asdf"
  elif command -v rbenv &> /dev/null; then
    echo "rbenv"
  elif command -v rvm &> /dev/null; then
    echo "rvm"
  else
    echo "none"
  fi
}

# Unified command to list installed Ruby versions.
# Usage: rb-v
unalias rb-v &>/dev/null
unset -f rb-v &> /dev/null
rb-v() {
  case $(_rb_get_manager) in
    "asdf") asdf list ruby ;;
    "rbenv") rbenv versions ;;
    "rvm") rvm list ;;
    *) echo "No recognized Ruby version manager (asdf, rbenv, rvm) found." >&2 ;;
  esac
}

# Unified command to set the global Ruby version.
# Usage: rb-glo <version>
unalias rb-glo &>/dev/null
unset -f rb-glo &> /dev/null
rb-glo() {
  if [ -z "$1" ]; then
    echo "Usage: rb-global <version>" >&2
    return 1
  fi
  case $(_rb_get_manager) in
    "asdf") asdf global ruby "$1" ;;
    "rbenv") rbenv global "$1" ;;
    "rvm") rvm use "$1" --default ;;
    *) echo "No recognized Ruby version manager found to set global version." >&2 ;;
  esac
}

# Unified command to set the local (project-specific) Ruby version.
# Usage: rb-local <version>
unalias rb-lcl &>/dev/null
unset -f rb-lcl &> /dev/null
rb-lcl() {
  if [ -z "$1" ]; then
    echo "Usage: rb-local <version>" >&2
    return 1
  fi
  case $(_rb_get_manager) in
    "asdf") asdf local ruby "$1" ;;
    "rbenv") rbenv local "$1" ;;
    "rvm")
      # RVM uses a .ruby-version file, which we can create.
      local gemset=$(rvm-prompt g)
      echo "$1@$gemset" > .ruby-version
      echo "Created .ruby-version file. Please 'cd .' to activate."
      ;;
    *) echo "No recognized Ruby version manager found to set local version." >&2 ;;
  esac
}

# -----------------------------------------------------------------------------
#  VERSION & ENVIRONMENT INFO
# -----------------------------------------------------------------------------

# A single command to show all relevant versions.
# Usage: rb-info
unalias rb-info &>/dev/null
unset -f rb-info &> /dev/null
rb-info() {
  echo -e "Ruby Version:"
  ruby -v
  echo -e "\nBundler Version:"
  bundle -v
  echo -e "\nRubyGems Version:"
  gem -v
}
