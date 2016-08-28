class MediaSerializer < ActiveModel::Serializer
  attributes :id, :url, :label,:inline,:thumb_url, :content_type

  attribute :label do
    object.file_file_name
  end

  attribute :url do
    request.protocol + request.host_with_port + object.file.url
  end

  attribute :thumb_url do
    request.protocol + request.host_with_port + object.file.url(:thumb)
  end

  attribute :content_type do
    object.file_content_type
    end
end