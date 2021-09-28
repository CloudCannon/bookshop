Feature: Eleventy Bookshop CloudCannon Integration
  As a user of Eleventy with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Bookshop Live tag
    Given a site/components.html file containing:
      """
      ---
      ---
      {% bookshop_live _cloudcannon/bookshop-live.js %}
      """
    When I run "npm start" in the site directory
    Then stderr should be empty
    And site/_site/components/index.html should contain each row: 
      | text |
      | script.src = `/_cloudcannon/bookshop-live.js`; |
      | if (window.inEditorMode)                      |

  @skip # TODO: Eleventy does not yet support pulling data into bookshop
  Scenario: Site data extracted for live editing
    Given a site/_data/test.yml file containing "title: Zuchinni"
    When I run "npm start" in the site directory
    Then stderr should be empty
    And site/_site/_cloudcannon/bookshop-site-data.json should contain the text "Zuchinni"
