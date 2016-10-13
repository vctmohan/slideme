class EditorController < ApplicationController

  def new
    @deck = Deck.new
    @deck.user = current_user
    @title = "New deck"
    render 'index', :layout => false
  end

  def edit
    username = params[:user]
    slug = params[:slug]

    @user = User.where(:username=> username).first
    @deck = Deck.where(:slug => slug, :user_id => @user.id).first
    @title = "Edit " + @deck.title

    render "index" , :layout => false

  end

end
