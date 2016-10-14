class SettingsController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def update
    if request.put?
      setting = Setting.where(user_id: current_user.id).first
      setting.update_attributes(setting_params)
      setting.save

    end

    render :nothing => true
  end

  private
  def setting_params
    params.permit(:present_controls, :present_upsizing, :present_notes, :editor_grid, :editor_snap, :developer_mode)
  end
end



