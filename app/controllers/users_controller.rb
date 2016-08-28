class UsersController < ApplicationController
    require 'bcrypt'

    def show
    if params[:username]
      @user = User.where(:username => params[:username]).first
    end

    if params[:ID]
      @user = User.find(params[:id])
    end

    @decks=Deck.where(user_id: @user.id)
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      log_in @user

      setting = Setting.new
      setting.user = @user
      setting.save

      redirect_to profile_url(@user.username)
    else
      render 'new'
    end
  end

  def edit
    @user = current_user
  end

  private
  def user_params
    params.require(:user).permit(:username, :email, :password,
                                 :password_confirmation)
  end
end
