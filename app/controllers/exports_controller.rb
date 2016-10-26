class ExportsController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def export
    output ={}
    if params[:id]
      deck = Deck.find(params[:id])

      if request.post?
        if params[:export] and params[:export][:export_type]
          export = Export.new
          export.state = 'new'
          export.kind = params[:export][:export_type]
          export.deck = deck
          export.user = current_user
          export.save
          output = {:id => export.id}

          require 'export/zip'
          ZipJob.perform_async(export.id)
        end
      end

      if request.get? and params[:id_export]
        export = Export.find(params[:id_export])
        output = {:url => export.url}
      end
    end

    respond_to do |format|
      format.json {
        render json: output
      }

    end

  end

end
