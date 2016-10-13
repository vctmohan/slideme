class Media < ActiveRecord::Base
  has_attached_file :file,
                    :styles => {
                        :thumb => ['100x100#', :jpg, :quality => 70],
                        :preview => ['480x480#', :jpg, :quality => 70],
                        :large => ['600>', :jpg, :quality => 70],
                        :retina => ['1200>', :jpg, :quality => 30]
                    },
                    :convert_options => {
                        :thumb => '-set colorspace sRGB -strip',
                        :preview => '-set colorspace sRGB -strip',
                        :large => '-set colorspace sRGB -strip',
                        :retina => '-set colorspace sRGB -strip -sharpen 0x0.5'
                    }
  validates_attachment :file,
                       content_type: {content_type: /^image\/(jpeg|png|svg)$/}
end
