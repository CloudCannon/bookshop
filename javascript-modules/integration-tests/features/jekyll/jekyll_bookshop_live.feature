Feature: Jekyll Bookshop CloudCannon Integration
  As a user of Jekyll with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile
        Gemfile.lock from starters/jekyll/Gemfile.lock
      """

  Scenario: Bookshop Live tag
    Given a site/components.html file containing:
      """
      ---
      ---
      {% bookshop_live _cloudcannon/bookshop-live.js %}
      """
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/components.html should contain each row: 
      | text |
      | script.src = `/_cloudcannon/bookshop-live.js`; |
      | if (window.inEditorMode)                      |

  Scenario: Site data extracted for live editing
    Given a site/_data/test.yml file containing "title: Zuchinni"
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/_cloudcannon/bookshop-site-data.json should contain the text "Zuchinni"

  Scenario: Bookshop Live schema comments
    Given a component-lib/components/page/page.jekyll.html file containing:
      """
      {% for block in include.content_blocks %}
        {% assign b = block %}
        <p>{{ b._bookshop_name }}</p>
      {% endfor %}
      """
    Given a component-lib/components/single/single.jekyll.html file containing:
      """
      <span>{{ include._bookshop_name }}</span>
      """
    And a site/index.html file containing:
      """
      ---
      content_blocks:
        - _bookshop_name: fake
      ---
      {% bookshop page content_blocks=page.content_blocks %}
      {% for block in page.content_blocks %}
        {% bookshop single bind=block %}
      {% endfor %}
      """
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain each row: 
      | text |
      | <p>fake</p> |
      | <!--bookshop-live name(page/page.jekyll.html) params(content_blocks=page.content_blocks) context() -->  |
      | <span>fake</span> |
      | <!--bookshop-live name(single/single.jekyll.html) params(bind=block) context(block=page.content_blocks[0]) -->  |
