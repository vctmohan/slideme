class LiveController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def live
    username = params[:user]
    slug = params[:slug]

    @user = User.where(:username => username).first
    @deck = Deck.where(:slug => slug, :user_id => @user.id).first
    @preview = false
    if request.get? and params[:preview]
      @preview = true
    end
    render "deck/live", :layout => false
  end

  def stream

    if params[:id]
      deck = Deck.find(params[:id])
      if params[:publisher_id]
        publisher = Publisher.where(:publisher_id => params[:publisher_id]).last
      else
        publisher = Publisher.where(:deck => deck).last
      end

      if request.get?
        if not publisher or publisher.status == "finish"
          publisher = Publisher.new
          publisher.status = "initial"
          publisher.state = "{\"indexh\":0,\"indexv\":0}"

          d = DateTime.new(2007,11,19,8,37,48,"-06:00")
          prng = Random.new
          publisher.publisher_id = d.strftime("%Y%m%d") + "-" + prng.rand(1000000).to_s
          publisher.deck = deck
          #render :file => "#{Rails.root}/public/404.html", :status => 404
        end
      end

      if request.put?
        if params[:state]
          publisher.state = params[:state]
        end
        if params[:status]
          publisher.status = params[:status]
        end
      end

      publisher.save
      render json: publisher, serializer: PublisherSerializer
=begin
      publisher_json = PublisherSerializer.new(publisher).to_json
      respond_to do |format|
        format.json { render json: {
            id: publisher.id,
            deck_id: deck.id,
            state: publisher_json,
            created_at: deck.created_at,
            updated_at: deck.updated_at
          }
        }
      end
=end
    end

  end

end
