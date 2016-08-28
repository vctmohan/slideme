class SettingSerializer < ActiveModel::Serializer
  attributes :id,  :present_controls, :present_upsizing, :present_notes, :editor_grid, :editor_snap, :developer_mode
end