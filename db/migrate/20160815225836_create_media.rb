class CreateMedia < ActiveRecord::Migration
  def change
    create_table :media do |t|
      t.timestamps null: false
      t.boolean :inline ,:default => false
      t.attachment :file
    end
  end
end
