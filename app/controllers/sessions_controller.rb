class SessionsController < ApplicationController
  def new
  end

  def create
    email = params[:session][:email].downcase
    password = params[:session][:password]
    authenticate = false
    user = User.find_by(email: email)

    ldap_yml = Rails.root.join('config/ldap.yml')
    use_ldap = false
    if File.exist?(ldap_yml)
    config = YAML.load_file(ldap_yml)[Rails.env]
    use_ldap = config['use_ldap']
    end
    #si esta habilitado intentar autenticar en ldap
    if use_ldap
      require 'ldap/active_directory'
      ad = ActiveDirectory.new
      if ad.valid_credentials?(email, password)
        authenticate = true
        if not user
          ldap_user = ad.get_object_by_mail(email)
          if ldap_user
            #create new user from ldap
            user = User.new
            user.email = email
            user.name = ldap_user.cn.first
            user.username = ldap_user.samaccountname.first
            user.save
          end
        end
      end

    else
      #autenticacion en la aplicacion
      if user && user.authenticate(password)
        authenticate = true
      end
    end

    if authenticate
      log_in user
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      redirect_to profile_url(user.username)
    else
      # Create an error message.
      render 'new'
    end
  end

  def destroy
    log_out
    redirect_to root_url
  end

end
