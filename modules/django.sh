#!/bin/bash
#
# Django Module for bash-wizardry
#
# This module centralizes Django management commands, adds intelligent
# helpers for common tasks, and includes safety checks for destructive operations.

# -----------------------------------------------------------------------------
#  CORE MANAGEMENT FUNCTION
# -----------------------------------------------------------------------------

# The main entry point for all manage.py commands.
# This avoids repeating 'python manage.py' and checks if the file exists.
# All other aliases and functions should use this as their base.
# Usage: djm <command> [args]
unalias djm &>/dev/null
unset -f djm &> /dev/null
djm() {
  if [ ! -f "manage.py" ]; then
    echo "Error: 'manage.py' not found in the current directory." >&2
    return 1
  fi
  python manage.py "$@"
}

# -----------------------------------------------------------------------------
#  SERVER & DATABASE
# -----------------------------------------------------------------------------

# Runs the development server. If an argument is provided, it's used as the port.
# Usage: djrs | djrs 8080
unalias djrs &>/dev/null
unset -f djrs &> /dev/null
djrs() {
  local port=${1:-8000} # Default to port 8000
  djm runserver "0.0.0.0:${port}"
}

# Creates migrations. If an app name is provided, it targets that app.
# If a second argument is provided, it's used to auto-name the migration file.
# Usage: djmm | djmm users | djmm users "add_user_profile"
unalias djmm &>/dev/null
unset -f djmm &> /dev/null
djmm() {
  if [ -z "$1" ]; then
    djm makemigrations
  elif [ -z "$2" ]; then
    djm makemigrations "$1"
  else
    djm makemigrations "$1" --name "$2"
  fi
}

alias djdbm='djm migrate'
alias djdbs='djm dbshell'
alias djlsm='djm showmigrations'
alias djcsu='djm createsuperuser'

# -----------------------------------------------------------------------------
#  DEVELOPMENT & UTILITY
# -----------------------------------------------------------------------------

# Runs tests. If an argument is provided, it targets a specific app or test case.
# Usage: djt | djt my_app.tests.test_views
unalias djt &>/dev/null
unset -f djt &> /dev/null
djt() {
  if [ -z "$1" ]; then
    djm test
  else
    djm test "$1"
  fi
}

# Opens the enhanced Django shell from django-extensions if available.
# This shell auto-imports all your models, which is a huge time-saver.
# Usage: djshell
unalias djshell &>/dev/null
unset -f djshell &> /dev/null
djshell() {
  if djm shell_plus --version &> /dev/null; then
    echo "Found django-extensions. Starting shell_plus..."
    djm shell_plus
  else
    echo "django-extensions not found. Starting standard shell..."
    djm shell
  fi
}

alias djchk='djm check'
alias djcll='djm collectstatic'
alias djldt='djm loaddata'
alias djddt='djm dumpdata'

# -----------------------------------------------------------------------------
#  ADVANCED & DESTRUCTIVE OPERATIONS
# -----------------------------------------------------------------------------

# Starts an app and automatically tries to add it to INSTALLED_APPS
# in the most common settings file patterns ('settings.py' or 'base.py').
# Usage: djstartapp <app_name>
unalias djstartapp &>/dev/null
unset -f djstartapp &> /dev/null
djstartapp() {
  if [ -z "$1" ]; then
    echo "Error: App name must be provided." >&2
    return 1
  fi

  djm startapp "$1"

  # Attempt to find the settings file
  local settings_file=$(find . -name "settings.py" -o -name "base.py" | head -n 1)

  if [ -n "$settings_file" ]; then
    echo "-> Found settings file: $settings_file"
    # Add the app name to INSTALLED_APPS (works on most standard formats)
    if ! grep -q "'$1'," "$settings_file"; then
        sed -i "/^INSTALLED_APPS = \[/a \ \ \ \ '$1'," "$settings_file"
        echo "-> Successfully added '$1' to INSTALLED_APPS."
    else
        echo "-> '$1' already found in INSTALLED_APPS."
    fi
  else
    echo "Warning: Could not find settings file. Please add '$1' to INSTALLED_APPS manually."
  fi
}

# Deletes migration files for a specific app.
# Extremely useful in early development but very destructive. Requires confirmation.
# Usage: djflushmigrations <app_name>
unalias djflushmigrations &>/dev/null
unset -f djflushmigrations &> /dev/null
djflushmigrations() {
  if [ -z "$1" ]; then
    echo "Error: App name must be provided." >&2
    return 1
  fi
  local migration_dir="$1/migrations/"
  if [ ! -d "$migration_dir" ]; then
    echo "Error: Directory '$migration_dir' not found." >&2
    return 1
  fi

  read -p "Are you sure you want to delete all migrations in '$migration_dir' (except __init__.py)? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    find "$migration_dir" -type f -name "*.py" -not -name "__init__.py" -delete
    find "$migration_dir" -type f -name "*.pyc" -delete
    echo "Migration files for app '$1' have been deleted."
  fi
}
