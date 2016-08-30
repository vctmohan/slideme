class LiveController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def live
    username = params[:user]
    slug = params[:slug]

    @user = User.where(:username => username).first
    @deck = Deck.where(:slug => slug, :user_id => @user.id).first
    render "live", :layout => false
  end

  def stream
    if params[:id]
      deck = Deck.find(params[:id])
    end

    if request.get? and params[:id]
      publisher = Publisher.where(:deck => deck).last
      if not publisher
        render :file => "#{Rails.root}/public/404.html", :status => 404
      end
    end

    if request.put? and params[:id] and params[:state]
      publisher = Publisher.new
      publisher.from_json(params[:state])
      publisher.deck = deck
      publisher.save
    end

    if publisher
      publisher_json = PublisherSerializer.new(publisher).to_json
      respond_to do |format|
        format.json { render json: {
            id: deck.user_id,
            deck_id: deck.id,
            state: publisher_json,
            created_at: deck.created_at,
            updated_at: deck.updated_at
          }
        }
      end
    end

  end

end
