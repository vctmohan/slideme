# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160831114157) do

  create_table "decks", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.text     "data"
    t.boolean  "comments_enabled",       default: true
    t.boolean  "forking_enabled",        default: true
    t.integer  "auto_slide_interval"
    t.string   "transition"
    t.string   "background_transition"
    t.string   "theme_font"
    t.string   "theme_color"
    t.boolean  "should_loop"
    t.boolean  "rtl"
    t.boolean  "share_notes"
    t.boolean  "slide_number"
    t.boolean  "rolling_links"
    t.boolean  "center"
    t.string   "visibility",             default: "all"
    t.string   "slug"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.integer  "user_id"
    t.string   "thumbnail_file_name"
    t.string   "thumbnail_content_type"
    t.integer  "thumbnail_file_size"
    t.datetime "thumbnail_updated_at"
  end

  add_index "decks", ["user_id"], name: "index_decks_on_user_id"

  create_table "media", force: :cascade do |t|
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.boolean  "inline",            default: false
    t.integer  "tags_id"
    t.integer  "user_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
  end

  add_index "media", ["tags_id"], name: "index_media_on_tags_id"
  add_index "media", ["user_id"], name: "index_media_on_user_id"
  add_index "media", [nil, "created_at"], name: "index_media_on_tag_id_and_created_at"

  create_table "publishers", force: :cascade do |t|
    t.integer  "indexh"
    t.integer  "indexv"
    t.boolean  "paused"
    t.boolean  "overview"
    t.string   "publisher_id"
    t.integer  "deck_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "publishers", ["deck_id"], name: "index_publishers_on_deck_id"

  create_table "settings", force: :cascade do |t|
    t.integer  "user_id"
    t.boolean  "present_controls", default: true
    t.boolean  "present_upsizing", default: false
    t.boolean  "present_notes",    default: true
    t.boolean  "editor_grid",      default: true
    t.boolean  "editor_snap",      default: false
    t.boolean  "developer_mode",   default: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  add_index "settings", ["user_id"], name: "index_settings_on_user_id"

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "name"
    t.string   "email"
    t.text     "description"
    t.string   "password_digest"
    t.string   "remember_digest"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true

end
