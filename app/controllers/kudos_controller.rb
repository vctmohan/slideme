class KudosController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def kudo
    if logged_in? and params[:id]
      kudo = Kudo.where(:deck_id => params[:id],:user => current_user).first
      if request.post? and not kudo
        kudo = Kudo.new
        kudo.deck_id = params[:id]
        kudo.user = current_user
        kudo.save
      end

      if request.delete?
        kudo.delete
      end

    end
    render :nothing => true
  end
end
