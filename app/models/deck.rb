class Deck < ActiveRecord::Base
  belongs_to :user
  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true

  has_attached_file :thumbnail
  validates_attachment :thumbnail, content_type: { content_type: "image/png" }

  def kudos
    Kudo.where(:deck_id=>self.id).count
  end

  def kudo_by_user(user_id)
    by_user = false
    if Kudo.where(:deck_id => self.id, :user => user_id).first
      by_user = true
    end
    by_user
  end

end
