@generate
Feature: Bookshop Global config
  As a user who is using a bookshop
  I want to configure some inputs across all components
  So that I don't have to repeat common input types in every component

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

  Scenario: Globals are merged into components from JS files
    Given a component-lib/bookshop/bookshop.config.js file containing:
      """
      module.exports = {
          engines: {
              "@bookshop/hugo-engine": {}
          },
          globals: {
            _inputs: {
              text: {
                type: "markdown"
              }
            }
          }
      }
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        text: Hello World
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                          | value           |
      | _structures.blocks.values.0.label             | "Nested / Card" |
      | _structures.blocks.values.0._inputs.text.type | "markdown"      |

  Scenario: Globals are merged into components from JSON files
    Given a component-lib/bookshop/bookshop.config.json file containing:
      """
      {
        "engines": {
          "@bookshop/hugo-engine": {}
        },
        "globals": {
          "_inputs": {
            "text": {
              "type": "markdown"
            }
          }
        }
      }
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        text: Hello World
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                          | value           |
      | _structures.blocks.values.0.label             | "Nested / Card" |
      | _structures.blocks.values.0._inputs.text.type | "markdown"      |

  Scenario: Globals are merged into components from YML files
    Given a component-lib/bookshop/bookshop.config.yml file containing:
      """
      engines:
        "@bookshop/hugo-engine": {}

      globals:
        _inputs:
          text:
            type: markdown
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        text: Hello World
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                          | value           |
      | _structures.blocks.values.0.label             | "Nested / Card" |
      | _structures.blocks.values.0._inputs.text.type | "markdown"      |

  Scenario: Globals are merged into components from TOML files
    Given a component-lib/bookshop/bookshop.config.toml file containing:
      """
      ["engines.@bookshop/hugo-engine"]

      [globals]
      _inputs.text.type = "markdown"
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        text: Hello World

      _inputs:
        nonexistent:
          type: text
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                          | value           |
      | _structures.blocks.values.0.label             | "Nested / Card" |
      | _structures.blocks.values.0._inputs.text.type | "markdown"      |

  Scenario: Component config takes precedence over globals
    Given a component-lib/bookshop/bookshop.config.toml file containing:
      """
      ["engines.@bookshop/hugo-engine"]

      [globals]
      _inputs.text.type = "markdown"
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        text: Hello World

      _inputs:
        text:
          type: text
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                          | value           |
      | _structures.blocks.values.0.label             | "Nested / Card" |
      | _structures.blocks.values.0._inputs.text.type | "text"          |

  Scenario: Globals can deep merge anything if you so desire 🤷
    Given a component-lib/bookshop/bookshop.config.yml file containing:
      """
      engines:
        "@bookshop/hugo-engine": {}

      globals:
        spec:
          structures:
            - default
        blueprint:
          lorem: ipsum
        _inputs:
          text:
            options:
              blockquote: true
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        label: "Card"

      blueprint:
        text: Hello World

      _inputs:
        text:
          type: markdown
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                         | value         |
      | _structures.default.values.0.label                           | "Card"        |
      | _structures.default.values.0.value.lorem                     | "ipsum"       |
      | _structures.default.values.0.value.text                      | "Hello World" |
      | _structures.default.values.0._inputs.text.type               | "markdown"    |
      | _structures.default.values.0._inputs.text.options.blockquote | true          |
