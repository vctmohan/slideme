class AddIndexToUsersEmail < ActiveRecord::Migration
  def change
    add_index :users, :email, unique: true, length: {:users => 50, :email => 50 }
  end
end
