class Deck < ActiveRecord::Base
  belongs_to :user
  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true

  has_attached_file :thumbnail
  validates_attachment :thumbnail, content_type: { content_type: "image/png" }

end
