class CreateExports < ActiveRecord::Migration
  def change
    create_table :Exports do |t|
      t.string  :state #[new, prececing, finish]
      t.string :kind # [zip, pdf]
      t.string :url
      t.references :deck, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
