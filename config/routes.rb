Rails.application.routes.draw do

  root 'application#index'

  get 'users/sign_up' => 'users#new', :as => :signup
  get ':username' => 'users#show', as: :profile
  post 'users' => 'users#create'
  match 'users/edit' => 'users#edit', :via => [:post, :get]
  get 'users/sign_in' => 'sessions#new'
  post 'users/sign_in' => 'sessions#create'
  get 'users/sign_out' => 'sessions#destroy'

  match ':username/new', :controller => 'editor', :action => 'new', :via => [:get], as: :new_deck
  match ':user/:slug/edit', :controller => 'editor', :action => 'edit', :via => [:get]
  match ':user/:slug/live', :controller => 'deck', :action => 'live', :via => [:get], as: :live
  match ':user/:slug', :controller => 'deck', :action => 'show', :via => [:get], as: :show_deck

  match 'api/v1/decks', :controller => 'deck', :action => 'decks', :via => [:post]
  match 'api/v1/decks/:id', :controller => 'deck', :action => 'decks', :via => [:put, :get, :delete]
  match 'api/v1/decks/:id/thumbnails', :controller => 'deck', :action => 'thumbnails', :via => [:get, :post]
  match 'api/v1/decks/:id/fork', :controller => 'deck', :action => 'fork', :via => [:post]
  match 'api/v1/decks/:id/publish', :controller => 'deck', :action => 'publish', :via => [:post]
  match 'api/v1/decks/:id/stream', :controller => 'deck', :action => 'stream', :via => [:get,:put]
  match 'api/v1/status', :controller => 'deck', :action => 'status', :via => [:get]
  match 'api/v1/slide_templates', :controller => 'template', :action => 'slide_templates', :via => [:get]
  match 'api/v1/user_settings' , :controller => 'settings', :action => 'update', :via => [:put]
  match 'api/v1/media', :controller => 'medias', :action => 'media', :via => [:get,:post]
  match 'api/v1/media/:id', :controller => 'medias', :action => 'edit_media', :via => [:delete]
  match 'api/v1/tags', :controller => 'tags', :action => 'get_tags', :via => [:get]

end
