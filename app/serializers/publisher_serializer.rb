class PublisherSerializer < ActiveModel::Serializer
  attributes :indexh, :indexv, :paused, :overview, :publisher_id

  attribute :publisher_id do
    object.identifier
  end
end