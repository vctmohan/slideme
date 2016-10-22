class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :name
     # t.string :email
      t.text :description
      #t.string :password_digest
      #t.string :remember_digest

      #t.timestamps null: false
    end
  end
end
