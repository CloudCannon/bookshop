Feature: Jekyll Bookshop CloudCannon Live Editing

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

  Scenario: Bookshop Live browser update
    Given a component-lib/components/single/single.bookshop.toml file containing:
      """
      [component]
      structures = [ "content_blocks" ]

      [props]
      title = "Hello World"
      """
    And a component-lib/components/single/single.jekyll.html file containing:
      """
      <h1>{{ include.title }}</h1>
      """
    And a site/index.html file containing:
      """
      ---
      layout: default
      content_blocks:
        - _bookshop_name: single
          title: "Hello There"
      ---
      {% for block in page.content_blocks %}
        {% bookshop {{block._bookshop_name}} bind=block %}
      {% endfor %}
      """
    # Building the site
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    Then site/_site/index.html should contain each row: 
      | text |
      | <!--bookshop-live name(single/single.jekyll.html) params(bind=block) context(block=page.content_blocks[0]) -->  |
    # Running Bookshop Generate
    When I run "npm start" in the . directory
    Then stderr should be empty
    Then stdout should contain "Modifying built site at ./site/_site"
    Then stdout should contain "Added live editing to 1 page containing Bookshop components"
    # Testing CloudCannon initialising
    When I serve the site/_site directory
    When 🌐 I load http://localhost:__PORT__
    Then 🌐 The selector h1 should contain "Hello There"
    When 🌐 CloudCannon is ready with the data:
      """
      {
        content_blocks: [ {
          _bookshop_name: "single",
          title: "Gidday"
        } ]
      }
      """
    Then 🌐 There should be no errors
    Then 🌐 The selector h1 should contain "Gidday"
    # Testing CloudCannon data changing
    When 🌐 CloudCannon pushes new data:
      """
      {
        content_blocks: [ {
          _bookshop_name: "single",
          title: "Rerendered"
        } ]
      }
      """
    Then 🌐 There should be no errors
    Then 🌐 The selector h1 should contain "Rerendered"