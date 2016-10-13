class DeckSerializer < ActiveModel::Serializer
  attributes :id, :slug,:title, :description, :comments_enabled, :forking_enabled, :auto_slide_interval, :transition,
             :background_transition,:theme_font, :theme_color, :should_loop, :rtl, :share_notes,  :slide_number,
             :rolling_links, :center, :visibility
  belongs_to :user

  attribute :title do
    title = object.title
    if object.title == nil
      title = ""
    end
    title
  end

  attribute :rtl do
    false
  end
end

=begin
thumbnail_url,
    view_count
    :published_at => 'null',
    :sanitize_messages => 'null',
    :view_count => 0,
:version => 2,
    :collaborative => 'null',
    :deck_user_editor_limit => 1,
    :data_updated_at => 'null',
    :access_token => 'null'=end

:theme_id => no se de donde salio
=end