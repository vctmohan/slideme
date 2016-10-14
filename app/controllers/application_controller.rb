class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper

  def index
    @recently_decks = Deck.order('created_at desc').take(8)
    @popular_decks = Deck.order('created_at desc').take(8)
    render "explore"
  end

end