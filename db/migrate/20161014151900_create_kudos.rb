class CreateKudos < ActiveRecord::Migration
  def change
    create_table :kudos do |t|
      t.references :user
      t.references :deck, index: true
      t.timestamps null: false
    end
    #add_index :kudos, [:deck_id]
  end
end