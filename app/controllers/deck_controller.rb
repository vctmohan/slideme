class DeckController < ApplicationController
  skip_before_filter :verify_authenticity_token
  include ApplicationHelper

  def decks
    if request.post?
      create
    end
    if request.put?
      update
    end

    if request.get?
      get_deck
    end

    if request.delete? and params[:id]
      deck = Deck.find(params[:id])
      deck.delete
      render :nothing => true
    end
  end

  def fork
    if request.post? and params[:id]
      deck = Deck.find(params[:id])
      deck_forking = deck.dup
      deck_forking.title = "Copy of " + deck.title
      deck_forking.save

      redirect_to profile_url(current_user.username)
    end
  end

  def status
    if request.get?
      respond_to do |format|
        format.json {
          render json: {
              :user_signed_in => true,
              :app_version => "2457ee0"
              #:user=> {"id" : 546872, "username" : "ruby232", "name" : null, "description" : null, "thumbnail_url" : "https://www.gravatar.com/avatar/d56b941ba90e3d9ea677a36aa3823260?s=140\u0026d=https%3A%2F%2Fs3.amazonaws.com%2Fstatic.slid.es%2Fimages%2Fdefault-profile-picture.png", "pro" : false, "team_id" : null, "settings" : {"id" : 390818, "present_controls" : true, "present_upsizing" : true, "present_notes" : true, "editor_grid" : true, "editor_snap" : true, "developer_mode" : false }, "email" : "rubiselprieto@gmail.com", "notify_on_receipt" : true, "billing_address" : null, "editor_tutorial_completed" : true, "manually_upgraded" : false, "deck_user_editor_limit" : 1}
          }
        }
      end
    end
  end

  def create
    deck_param = params[:deck]
    @deck = Deck.new()
    @deck.title = deck_param[:title]
    @deck.slug = to_slug(deck_param[:title])
    @deck.description = deck_param[:description]
    @deck.data = deck_param[:data]
    @deck.comments_enabled= deck_param[:comments_enabled]
    @deck.forking_enabled = deck_param[:forking_enabled]
    @deck.auto_slide_interval = deck_param[:auto_slide_interval]
    @deck.transition = deck_param[:transition]
    @deck.background_transition = deck_param[:background_transition]
    @deck.theme_font = deck_param[:theme_font]
    @deck.theme_color = deck_param[:theme_color]
    @deck.should_loop = deck_param[:should_loop]
    @deck.rtl = deck_param[:rtl]
    @deck.share_notes = deck_param[:share_notes]
    @deck.slide_number = deck_param[:slide_number]
    @deck.rolling_links = deck_param[:rolling_links]
    @deck.center = deck_param[:center]
    @deck.user = current_user

    respond_to do |format|
      if @deck.save()
        format.json { render json: deck_json_response(@deck) }
      else
        format.json { render json: @deck.errors, status: :unprocessable_entity }
      end
    end

  end

  def update
    deck_param = params[:deck]

    @deck = Deck.find(params[:id])
    @deck.title = deck_param[:title]
    @deck.description = deck_param[:description]
    @deck.data = deck_param[:data]
    @deck.comments_enabled= deck_param[:comments_enabled]
    @deck.forking_enabled = deck_param[:forking_enabled]
    @deck.auto_slide_interval = deck_param[:auto_slide_interval]
    @deck.transition = deck_param[:transition]
    @deck.background_transition = deck_param[:background_transition]
    @deck.theme_font = deck_param[:theme_font]
    @deck.theme_color = deck_param[:theme_color]
    @deck.should_loop = deck_param[:should_loop]
    @deck.rtl = deck_param[:rtl]
    @deck.share_notes = deck_param[:share_notes]
    @deck.slide_number = deck_param[:slide_number]
    @deck.rolling_links = deck_param[:rolling_links]
    @deck.center = deck_param[:center]

    if deck_param[:custom_slug]
      @deck.slug = deck_param[:custom_slug]
    end


    respond_to do |format|
      if @deck.save()
        format.json { render json: deck_json_response(@deck) }
      else
        format.json { render json: @deck.errors, status: :unprocessable_entity }
      end
    end

  end

  def get_deck
    @deck = Deck.find(params[:id])
    respond_to do |format|
      format.json { render json: deck_json_response(@deck) }
    end
  end

  def thumbnails
    deck = Deck.find(params[:id])
    html = deck.data

    kit = IMGKit.new(html, :width => 240, :height => 230)
    img = kit.to_img(:png)

    if request.get?
      send_data(img, :type => "image/png", :disposition => 'inline')
    end

    if request.post?

      file = Tempfile.new(["thumbnail_#{deck.id}", 'png'], 'tmp',
                          :encoding => 'ascii-8bit')
      file.write(img)
      file.flush
      deck.thumbnail = file
      deck.save
      file.unlink
    end

    render :nothing => true
  end

  def publish
    if request.post? and params[:visibility] and params[:id]
      deck = Deck.find(params[:id])
      deck.visibility = params[:visibility]
      deck.save
      respond_to do |format|
        format.json { render json: {deck: deck_json_response(deck)} }
      end
    end
  end

  def live
    username = params[:user]
    slug = params[:slug]

    @user = User.where(:username => username).first
    @deck = Deck.where(:slug => slug, :user_id => @user.id).first
    render "live", :layout => false
  end

  def stream
    if request.get? and params[:id]
      deck = Deck.find(params[:id])
      respond_to do |format|
        format.json { render json: {
            id: deck.user_id,
            deck_id: deck.id,
            state: "{\"indexh\":0,\"indexv\":0,\"paused\":false,\"overview\":false,\"publisher_id\":\"1471433970558-425119\"}",
            created_at: deck.created_at,
            updated_at: deck.updated_at
          }
        }
      end
    end
  end

  def show
    if request.get? and params[:user] and params[:slug]
      @user = User.where(:username => params[:user]).first
      @deck = Deck.where(:slug => params[:slug], :user_id => @user.id).first
    end
  end

  private
  def deck_json_response(deck)
    return DeckSerializer.new(deck).to_json
  end

  def decks_params
    params.require(:deck).permit(:deck, :version)
  end

  def to_slug(ret)
    #strip the string
    ret = ret.strip

    #blow away apostrophes
    ret.gsub! /['`]/, ""

    # @ --> at, and & --> and
    ret.gsub! /\s*@\s*/, " at "
    ret.gsub! /\s*&\s*/, " and "

    #replace all non alphanumeric, underscore or periods with underscore
    ret.gsub! /\s*[^A-Za-z0-9\.\-]\s*/, '_'

    #convert double underscores to single
    ret.gsub! /_+/, "_"

    #strip off leading/trailing underscore
    ret.gsub! /\A[_\.]+|[_\.]+\z/, ""

    ret
  end

end
