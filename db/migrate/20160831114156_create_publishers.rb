class CreatePublishers < ActiveRecord::Migration
  def change
    create_table :publishers do |t|
      t.integer :indexh
      t.integer :indexv
      t.boolean :paused
      t.boolean :overview
      t.string  :identifier
      t.references :deck, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
