# Basic Ruby Commands
alias rb='ruby'                        # Short alias for ruby command
alias irb='irb'                        # Start IRB (Interactive Ruby Bash)
alias gemi='gem install'               # Install gem with short alias <params>
alias gemr='gem uninstall'             # More intuitive alias for gem removal <params>
alias gemu='gem update'                # Update gems with an easy alias <params>
alias geml='gem list --local'          # List locally installed gems
alias rbver='ruby -v'                  # Show ruby version
alias gemver='gem -v'                  # Show gem version <params>

# Bundler
alias bi='bundle install'              # Install gems from Gemfile <params>
alias bx='bundle exec'                 # Execute bundle exec <params>
alias bxrspc='bundle exec rspec'       # Run RSpec tests through bundle exec <params | optional>

# Version Manager (assuming you're using rbenr, rvm o asdf)
alias rbnver='rbenv versions'          # List rbenv versions
alias rbnvgl='rbenv global'            # Show current global ruby version in rbenv
alias rvmver='rvm list'                # List installed ruby versions for rvm
alias rvmuse='rvm use'                 # Use specific ruby version in rvma <params>

# asdf Version Manager (for Ruby, Node.js, Elixir, etc.)
alias asdfver='asdf list'               # List all installed versions via asdf
alias asdfgl='asdf global'              # Show current global version for asdf
alias asdfplgadd='asdf plugin-add'      # Add a plugin to asdf <params>
alias asdfplgls='asdf plugin-list'      # List all plugins installed in asdf <params>
alias asdfup='asdf update'              # Update asdf and plugins <params>
alias asdfi='asdf install'              # Install all versions specified in `.tool-versions` <params>
