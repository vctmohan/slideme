class Publisher < ActiveRecord::Base
  belongs_to :deck
  #status [initial, start, finish]
end
