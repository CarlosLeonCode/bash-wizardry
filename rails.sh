# Basic commands for Rails
alias r='rails'                                     # Rails <params>
alias rst='rails stats'                             # Rails show stats
alias rhlp='rails --help'                           # Rails help
alias rc='rails console'                            # Rails console
alias rs='rails server'                             # Rails server
alias rg='rails generate'                           # Rails generate <params>
alias rdr='rails db:rollback'                       # Rails rollback migrations
alias rdbs='rails db:setup'                         # Rails setup database
alias rdbm='rails db:migrate'                       # Rails execute migrations
alias rdbs='rails db:seed'                          # Rails run seed database
alias rt='rails test'                               # Rails run tests <params | optional>
alias rr='rails routes'                             # Rails show all routes
alias rrg='rails routes | grep'                     # Rails show filter routes <params>
alias rdbd='rails db:drop'                          # Rails drop database
alias rdbmrd='rails db:migrate:reset'               # Rails delete database and setup again
alias rlgs='tail -f "${1:-log/development.log}"'    # Rails log tail <params | optional>
