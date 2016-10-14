class CreateMedia < ActiveRecord::Migration
  def change
    create_table :media do |t|
      t.timestamps null: false
      t.boolean :inline ,:default => false
      t.references :tags, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
    end
    #add_index :media, [:tags, :created_at]
  end
end
