class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.boolean :opening_player

      t.timestamps
    end
  end
end