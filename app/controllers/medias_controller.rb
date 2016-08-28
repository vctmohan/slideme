class MediasController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def media
    if request.get?
      medias = Media.all
      medias_json = []
      medias.each do |media|
        media_json = MediaSerializer.new(media).as_json
        medias_json.push(media_json)
      end

      render json: {total: medias.count, type: "medias", results: medias_json}
      #, serializer:  ActiveModel::Serializer::CollectionSerializer, each_serializer: MediaSerializer
      #render json: medias, serializer:  ActiveModel::Serializer::CollectionSerializer, each_serializer: MediaSerializer
    end

    if request.post? and params[:file]
      @media = Media.new
      @media.file = params[:file]
      @media.inline = false
      @media.save
      render json: @media, serializer: MediaSerializer
    end
  end

  def edit_media
    if request.delete? and params[:id]
      media = Media.find(params[:id])
      media.delete
      render :nothing => true
    end
  end
end
