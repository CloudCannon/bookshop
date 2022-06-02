@generate
Feature: Bookshop Thumbnail Convention
  As a user who is using a bookshop
  I want to be able to set custom thumnails on components
  So that my editors can see an example of the component they're selecting

  Background:
    Given the file tree:
      """
      component-lib/
        go.mod from starters/hugo/components.go.mod
        config.toml from starters/hugo/components.config.toml
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.js
      site/
        go.mod from starters/hugo/site.go.mod
        config.toml from starters/hugo/site.config.toml
      package.json from starters/generate/package.json  # <-- this .json line hurts my syntax highlighting
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      </body>
      </html>
      """
    And a site/content/_index.md file containing:
      """
      ---
      ---
      """
    When I run "hugo" in the site directory
    And I run "cloudcannon-hugo --baseurl /" in the site directory

  Scenario: Generated structures connect the thumbnail and icon
    Given a component-lib/components/nested/card/card.thumb.png file containing:
      """
      I am a thumbnail
      """
    Given a component-lib/components/nested/card/card.icon.png file containing:
      """
      I am an icon
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        title: "Hello World"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then "site/public/_cloudcannon/bookshop_thumbs/nested/card.thumb.png" should contain the text "I am a thumbnail"
    Then "site/public/_cloudcannon/bookshop_thumbs/nested/card.icon.png" should contain the text "I am an icon"
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                      | value                                                 |
      | _structures.blocks.values.0.label         | "Nested / Card"                                       |
      | _structures.blocks.values.0.preview_image | "/_cloudcannon/bookshop_thumbs/nested/card.thumb.png" |
      | _structures.blocks.values.0.image         | "/_cloudcannon/bookshop_thumbs/nested/card.icon.png"  |
      | _structures.blocks.values.0.value.title   | "Hello World"                                         |
