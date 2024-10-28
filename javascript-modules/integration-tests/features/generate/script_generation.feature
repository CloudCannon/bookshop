@generate
Feature: Bookshop Structure Generation
  As a user who is using a bookshop
  I want the generate command to configure all live editing for me
  So that I don't have to configure it myself

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
    And a component-lib/components/card/card.hugo.html file containing:
      """
      <p class="{{ .card_color }}">{{ .card_text }}</p>
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `(dict "card_text" .Params.card_text "card_color" .Params.card_color)` }}
      {{ partial "bookshop" (slice "card" (dict "card_text" .Params.card_text "card_color" .Params.card_color)) }}
      </body>
      </html>
      """
    And a site/content/_index.md file containing:
      """
      ---
      card_text: "Hello Card"
      card_color: "Red"
      ---
      """
    When I run "hugo" in the site directory
    And I run "cloudcannon-hugo --baseurl /" in the site directory

  Scenario: Connecting live editing
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added live editing to 1 page containing Bookshop components"
    And stdout should contain "Built Bookshop live javascript to site"
    And stdout should contain "bookshop-live.js"
    And site/public/index.html should leniently contain each row:
      | text |
      | script.src = `/_cloudcannon/bookshop-live.js`; |
    And site/public/_cloudcannon/bookshop-live.js should leniently contain each row:
      | text |
      | {{ .card_text }} |

  Scenario: Can skip live editing
    When I run "npm run generate-no-live --scripts-prepend-node-path" in the . directory
    Then stderr should be empty
    And stdout should contain "Skipping live editing generation"
    And site/public/index.html should not contain the text "_cloudcannon"
    And site/public/_cloudcannon/bookshop-live.js should not exist

  Scenario: Can skip data binding
    When I run "npm run generate-no-bindings --scripts-prepend-node-path" in the . directory
    Then stderr should be empty
    And stdout should contain "Added live editing to 1 page containing Bookshop components"
    And stdout should contain "Disabled data binding panels when live editing"
    And stdout should contain "Built Bookshop live javascript to site"
    And stdout should contain "bookshop-live.js"
    And site/public/index.html should leniently contain each row:
      | text |
      | script.src = `/_cloudcannon/bookshop-live.js`; |
      | window.bookshopDataBindings = false; |
    And site/public/_cloudcannon/bookshop-live.js should leniently contain each row:
      | text |
      | {{ .card_text }} |
