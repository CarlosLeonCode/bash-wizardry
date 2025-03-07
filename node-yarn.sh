# Basic commands for Node and Yarn
alias ni='npm install'                      # Install dependencies <params>
alias nig='npm install --global'            # Install global package <params>
alias nidv='npm install --save-dev'         # Install dev dependencies <params>
alias nu='npm uninstall'                    # Uninstall dependencies <params>
alias nug='npm uninstall --global'          # Uninstall global package <params>
alias nr='npm run'                          # Run script
alias ns='npm start'                        # Start project
alias nb='npm run build'                    # Build project
alias nt='npm test'                         # Test project <params | optional>
alias niu='npm install && npm update'       # Install and update dependencies
alias ncl='npm cache clean --force'         # Clean npm cache
alias nlsg='npm list --global --depth=0'    # List global packages
alias yrn='yarn'                            # Yarn <params>
alias yrna='yarn add'                       # Add dependencies <params>
alias yrnadv='yarn add --dev'               # Add dev dependencies <params>
alias yrnb='yarn build'                     # Build project
alias yrns='yarn start'                     # Start project
alias yrnu='yarn upgrade'                   # Upgrade dependencies

# Basic commands for NPM
alias ndver='npm -v'                        # Show npm version
alias ndrdev='npm run dev -- -H 0.0.0.0'    # Run dev server with host <params>
