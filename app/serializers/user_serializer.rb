class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :name, :description, :email , :thumbnail_url  #, pro, team_id , notify_on_receipt, billing_address, editor_tutorial_completed, manually_upgraded, deck_user_editor_limit
  belongs_to :setting , key: :settings

  attribute :thumbnail_url do
     object.avatar.url(:thumb)
  end

end
