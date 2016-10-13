IMGKit.configure do |config|
  #config.wkhtmltoimage = '/usr/local/bin/wkhtmltoimage'#'which wkhtmltoimage'
   config.default_options = {
      :quality => 60
  }
  config.default_format = :png
end