require 'net/ldap'
class ActiveDirectory
  ldap = nil
  attribute = nil
  def initialize(host="localhost",port=389)
    config = YAML.load_file(Rails.root.join('config/ldap.yml'))[Rails.env]
    @ldap = Net::LDAP.new(
        :host => config['host'],
        :port => config['port'],
        :base => config['base'],
        :auth => {
            :method => :simple,
            :username => config['admin_user'],
            :password => config['admin_password']
        }
    )
    @attribute = config['attribute']
  end

  def valid_credentials?(login, password)
    filter = Net::LDAP::Filter.eq(@attribute, login)
    if @ldap.bind_as(:filter => filter, :password => password)
      true
    else
      Rails.logger.error("Active Directory validation failed for '#{login}': #{@ldap.get_operation_result.message}")
      false
    end
  end

  def get_object_by_mail(mail)
    filter = Net::LDAP::Filter.eq('mail', mail)
    user = @ldap.search(:filter => filter).first
    user
  end
end