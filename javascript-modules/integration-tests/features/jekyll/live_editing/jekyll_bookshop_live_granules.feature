Feature: Jekyll Bookshop CloudCannon Live Editing Granular Steps

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
    And a component-lib/components/single/single.jekyll.html file containing:
      """
      <h1>{{ include.title }}</h1>
      """
    And a component-lib/components/card/card.jekyll.html file containing:
      """
      <div class="card">{{ include.card.title }}</div>
      """
    And a site/index.html file containing:
      """
      ---
      layout: default
      block:
        title: "Hello There"
      ---
      {% bookshop single bind=page.block %}
      """

  Scenario: Bookshop adds live editing markup
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    *    stdout should contain "Bookshop site data generated"
    *    site/_site/index.html should contain each row: 
      | text |
      | <!--bookshop-live name(single/single.jekyll.html) params(bind=page.block) context() -->  |

  Scenario: Bookshop Generate hydrates live editing
    Given I run "bundle exec jekyll build --trace" in the site directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying built site at ./site/_site"
    *    stdout should contain "Added live editing to 1 page containing Bookshop components"

  Scenario: Bookshop live renders when CloudCannon initialises
    Given I run "bundle exec jekyll build --trace" in the site directory
    *     I run "npm start" in the . directory
    *     I serve the site/_site directory
    *    🌐 I load http://localhost:__PORT__
    When 🌐 CloudCannon is ready with the data:
      """
      { block: { title: "Gidday" } } 
      """
    And  🌐 "window.bookshopLive.hasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Gidday"

  Scenario: Bookshop live renders when CloudCannon pushes new data
    Given I run "bundle exec jekyll build --trace" in the site directory
    *     I run "npm start" in the . directory
    *     I serve the site/_site directory
    *    🌐 I load http://localhost:__PORT__
    *    🌐 CloudCannon is ready with the data:
      """
      { block: { title: "Hello There" } } 
      """
    *    🌐 "window.bookshopLive.hasRendered === true" evaluates
    When 🌐 CloudCannon pushes new data:
      """
      { block: { title: "Rerendered" } } 
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Rerendered"
