set :port, 22
set :user, 'master'
set :deploy_via, :remote_cache
set :use_sudo, false

server 'slideme.datys.cu',
       roles: [:web, :app, :db],
       port: fetch(:port),
       user: fetch(:user),
       primary: true

set :deploy_to, "/var/www/#{fetch(:application)}"

set :ssh_options, {
    forward_agent: true,
    auth_methods: %w(publickey),
    user: 'deployer',
}

set :rails_env, :production
set :rails_env, :development
set :conditionally_migrate, true