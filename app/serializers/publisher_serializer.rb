class PublisherSerializer < ActiveModel::Serializer
  attributes :publisher_id, :state, :status

=begin
  attribute :publisher_status do
    object.status
  end
=end

end