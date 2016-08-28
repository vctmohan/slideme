class AddAttachmentThumbnailToDecks < ActiveRecord::Migration
  def self.up
    change_table :decks do |t|
      t.attachment :thumbnail
    end
  end

  def self.down
    remove_attachment :decks, :thumbnail
  end
end
