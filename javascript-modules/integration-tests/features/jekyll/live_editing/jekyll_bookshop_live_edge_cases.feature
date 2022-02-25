@jekyll @web @bespoke
Feature: Jekyll Bookshop CloudCannon Live Editing Edge Cases

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile.cloudcannon
        Gemfile.lock from starters/jekyll/Gemfile.cloudcannon.lock
        _layouts/
          default.html from starters/jekyll/default.html
      """
