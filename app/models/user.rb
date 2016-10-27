class User < ActiveRecord::Base
  has_many :decks, dependent: :destroy
  has_one :setting , dependent: :destroy
  attr_accessor :remember_token
  before_save { self.email = email.downcase }

  validates :username, presence: true, length: {maximum: 50}

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: {maximum: 255},
                    format: {with: VALID_EMAIL_REGEX},
                    uniqueness: { case_sensitive: false }

  has_secure_password
  validates :password, length: { minimum: 6 }, allow_blank: true

  has_attached_file :avatar,
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
                    },
                    default_url: "/images/user-default.png"
  validates_attachment :avatar,
                       content_type: {content_type: /^image\/(jpeg|png|svg)$/}

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
        BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token.
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Returns true if the given token matches the digest.
  def authenticated?(remember_token)
    if remember_digest.nil?
      false
    else
      BCrypt::Password.new(remember_digest).is_password?(remember_token)
    end
  end

  # Forgets a user.
  def forget
    update_attribute(:remember_digest, nil)
  end

  def get_name
    if name
      name
    else
      username
    end
  end
end
