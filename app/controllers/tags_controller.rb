class TagsController < ApplicationController
  def get_tags
    #tags = Tag.all
    render json: {total: 1,type:"tags",results:[{id:63476,name:"Tag 1",medias:[]}]}
  end
end
