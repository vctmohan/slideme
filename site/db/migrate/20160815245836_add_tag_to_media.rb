class AddTagToMedia < ActiveRecord::Migration
  def change
    add_reference :media, :tag, index: true, foreign_key: true
  end
end
