class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.references :user, index: true, foreign_key: true
      t.boolean :present_controls ,:default => true
      t.boolean :present_upsizing ,:default => false
      t.boolean :present_notes ,:default => true
      t.boolean :editor_grid ,:default => true
      t.boolean :editor_snap ,:default => false
      t.boolean :developer_mode ,:default => false

      t.timestamps null: false
    end
  end
end
