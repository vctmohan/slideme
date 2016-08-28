class TemplateController < ApplicationController
  def slide_templates
    if request.get?
      render json: []
    end
  end
end
