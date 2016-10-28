**I need help with this project, any help is welcome**

This is open source clone of site [slides.com](https://slides.com/). Any similarity with reality is purely coincidental. 1
The goal of this project is supplied the GUI open source for [reveal.js](http://lab.hakim.se/reveal-js) and create one offline editor in the future, using [Electron](http://electron.atom.io/) y javascript.

For install see [INSTALL.md](https://github.com/ruby232/slideme/blob/master/INSTALL.md)

#Dependencies
- Rails 4.2.6
- wkhtmltoimage

#Deploy with capistrano and unicorn 
cap production deploy

### Up Unicorn
bundle exec unicorn -c /var/www/slideme/current/config/unicorn/production.rb -E deployment -D