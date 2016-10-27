# Install slideme
This instruction only apply in Linux, and had been test in Ubuntu 16.04  

#Dependencies
- Ruby on Rails 
- wkhtmltoimage

# wkhtmltoimage
This tools are use for convert HTML to image for create thumbnail to slide (deck) 
```sh
    sudo apt install wkhtmltopdf
```
Download [wkhtmltox-0.12.3_linux-generic-amd64.tar.xz](http://)  
```sh
    wget 
    descomprimir 
    cd wkhtmltox
    sudo cp wkhtmltoimage /usr/bin/wkhtmltoimage
```

# Install dependencies
```sh
    gem install bundle
    bundle install
    #Install bower
    bower install
```
# Create configurations
Create file for database configuration
```sh
    touch config/database.yml
```

Set your database values depending on environment
```yml
default: &default
  adapter: sqlite3
  pool: 5
  timeout: 5000

development:
  <<: *default
  database: db/development.sqlite3

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: db/test.sqlite3

production:
  adapter: mysql2
  database: slideme
  host: localhost
  username: root
  password: pass
  encoding: utf8
```


# Development
```sh
    rails server
```
Open web browser with url **http://localhost:300** 

# Production 
To Do 
