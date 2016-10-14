class CreateDecks < ActiveRecord::Migration
  def change
    create_table :decks do |t|
      t.string :title
      t.string :description
      t.text :data
      t.boolean :comments_enabled ,:default => true
      t.boolean :forking_enabled, :default => true
      t.integer :auto_slide_interval
      t.string :transition
      t.string :background_transition
      t.string :theme_font
      t.string :theme_color
      t.boolean :should_loop
      t.boolean :rtl
      t.boolean :share_notes
      t.boolean :slide_number
      t.boolean :rolling_links
      t.boolean :center
      t.string :visibility ,:default => 'all'
      t.string :slug

      t.timestamps null: false
    end
  end
end
