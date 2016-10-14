# config valid only for current version of Capistrano
lock '3.6.1'

set :application, 'slideme'
set :repo_url, 'git@gitd7.datys.cu:devops/slideme.git'

#ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call
set :branch, "master"

set :use_sudo, false
set :bundle_binstubs, nil
set :linked_files, fetch(:linked_files, []).push('config/database.yml')
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
set :bundle_env_variables, { SSL_CERT_FILE: "/home/master/.cert/nexus.pem" }

before "bundler:install", "deploy:export_cert"
after 'deploy:publishing', 'deploy:restart'

namespace :deploy do
  task :restart do
    invoke 'unicorn:reload'
  end

  task :export_cert do
    on roles(:app) do
      execute "export SSL_CERT_FILE=/home/master/.cert/nexus.pem"
    end
  end
end