class CreatePublishers < ActiveRecord::Migration
  def change
    create_table :publishers do |t|
      t.string  :state #estado de revealjs
      t.string  :status # status de la presentacion [initial, start, finish]
      t.string  :publisher_id
      t.references :deck, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
