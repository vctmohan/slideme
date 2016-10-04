class UsersController < ApplicationController
  skip_before_filter :verify_authenticity_token
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
    @user = User.find(current_user.id)
    if request.put?
      @user.name = user_params[:name]
      @user.description = user_params[:description]
      @user.username = user_params[:username]
      @user.email = user_params[:email]
      if user_params[:avatar]
      @user.avatar = user_params[:avatar]
      end

      #Falta editar la contraseña
=begin
      if user_params[:password] and @user.authenticate(user_params[:current_password])
        @user.password = user_params[:password]
      end
=end

      if @user.save
        redirect_to profile_url(@user.username)
      end
    end

    if request.get?
      render 'edit'
    end
  end

  def update
    if request.put?
      respond_to do |format|
        format.json {
          render json: {
               }
        }
      end
    end
  end

  def delete
    current_user.destroy
    redirect_to root
  end

  private
  def user_params
    params.require(:user).permit(:name,:description,:username, :email, :password,
                                 :password_confirmation, :avatar, :current_password)
  end
end
