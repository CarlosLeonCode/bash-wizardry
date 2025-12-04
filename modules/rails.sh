#!/bin/bash
#
# Ruby on Rails Module for bash-wizardry
#
# This module provides a robust set of functions and aliases for an efficient
# Ruby on Rails workflow. It adds safety checks for destructive database
# operations and includes essential shortcuts for Bundler, RSpec, and routing.

# -----------------------------------------------------------------------------
#  BUNDLER ESSENTIALS (HIGHLY RECOMMENDED)
# -----------------------------------------------------------------------------

# Bundler is core to any Rails project. These are indispensable.
alias bi='bundle install'
alias bu='bundle update'
alias be='bundle exec' # Crucial for running commands in the Gemfile's context

# -----------------------------------------------------------------------------
#  CORE RAILS COMMANDS
# -----------------------------------------------------------------------------

alias r='rails'
alias rc='rails console'
alias rcs='rails console --sandbox'
alias rs='rails server'
alias rg='rails generate'
alias rst='rails stats'

# -----------------------------------------------------------------------------
#  DATABASE OPERATIONS
# -----------------------------------------------------------------------------

# Basic, non-destructive database aliases.
alias rdbc='rails db:create'
alias rdbm='rails db:migrate'
alias rdbs='rails db:setup'
alias rdbseed='rails db:seed'
alias rdr='rails db:rollback'

# Destructive operations converted to safe functions with confirmation.
# Drops the database after asking for confirmation.
# Usage: rdbd
unalias rdbd &>/dev/null
unset -f rdbd &> /dev/null
rdbd() {
  read -p "Are you sure you want to drop the database? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    be rails db:drop
  fi
}

# A powerful function to completely reset the database.
# It drops, creates, migrates, and seeds. Very common in development.
# Usage: rdbreset
unalias rdbreset &>/dev/null
unset -f rdbreset &> /dev/null
rdbreset() {
  read -p "This will DROP, CREATE, MIGRATE, and SEED the database. Are you sure? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    be rails db:drop && be rails db:create && be rails db:migrate && be rails db:seed
  fi
}

# -----------------------------------------------------------------------------
#  ROUTING
# -----------------------------------------------------------------------------

alias rr='rails routes'

# A smart function to filter routes. It's case-insensitive.
# Usage: rrg <pattern> (e.g., rrg user)
unalias rrts &>/dev/null
unset -f rrts &> /dev/null
rrts() {
  if [ -z "$1" ]; then
    # Show all routes if no pattern is provided
    rails routes
  else
    rails routes | grep -i "$1"
  fi
}

# -----------------------------------------------------------------------------
#  TESTING
# -----------------------------------------------------------------------------

alias rtst='rails test'
alias rspec='bundle exec rspec' # Essential shortcut for projects using RSpec.

# -----------------------------------------------------------------------------
#  LOGGING & UTILITIES
# -----------------------------------------------------------------------------

# A flexible log tailer. Defaults to the development log but can accept
# an environment name as an argument.
# Usage: rlog | rlog test
unalias rlog &>/dev/null
unset -f rlog &> /dev/null
rlog() {
  local env=${1:-development}
  local log_file="log/${env}.log"

  if [ -f "$log_file" ]; then
    tail -f "$log_file"
  else
    echo "Error: Log file not found at '$log_file'" >&2
    return 1
  fi
}
