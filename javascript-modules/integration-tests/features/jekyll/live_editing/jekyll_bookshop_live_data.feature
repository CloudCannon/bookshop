@jekyll @web
Feature: Jekyll Bookshop CloudCannon Live Editing Site Data

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
    Given a site/cloudcannon.config.yml file containing:
      """
      data_config: true
      """
    * [front_matter]:
      """
      layout: default
      show: false
      """
    * a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop block show=page.show %}
      """

  Scenario: Bookshop live renders website data
    Given a site/_data/cat.yml file containing:
      """
      name: Cheeka
      """
    * a component-lib/components/block/block.jekyll.html file containing:
      """
      <h1>{% if include.show %}{{ site.data.cat.name }}{% endif %}</h1>
      """
    * 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      show: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Cheeka"

  Scenario: Bookshop live renders special website config
    Given a site/_config.yml file containing:
      """
      title: "My Site"
      baseurl: "/documentation"

      bookshop_locations:
        - ../component-lib

      plugins:
        - jekyll-bookshop
      """
    Given a component-lib/components/block/block.jekyll.html file containing:
      """
      {% if include.show %}
      <h1>{{ site.baseurl }}</h1>
      <h2>{{ site.title }}</h2>
      {% endif %}
      """
    * 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      show: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "/documentation"
    *    🌐 The selector h2 should contain "My Site"