@generate
Feature: Bookshop Structure Generation
  As a user who is using a bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

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

  Scenario: Errors on old syntax
    Given a component-lib/components/nested/card/card.bookshop.toml file containing:
      """
      [props]
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "contains old (2.0) syntax"

  Scenario: Errors on invalid syntax
    Given a component-lib/components/nested/card/card.bookshop.js file containing:
      """
      garbage
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Encountered an error loading"

  Scenario: Generating structures parity test
    Given a component-lib/components/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - content_blocks
        label: Card
        description: Card component
        icon: nature_people
        tags:
          - Card

      blueprint:
        card_text: ""
        color: Blue
      
      preview:
        card_text: This is the card
      
      _inputs:
        color:
          type: select
          comment: Comment
          options:
            values:
              - Red
              - Blue
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.content_blocks.id_key | "_bookshop_name" |
      | _structures.content_blocks.values.0.label | "Card" |
      | _structures.content_blocks.values.0.value._bookshop_name | "card" |
      | _structures.content_blocks.values.0.value.card_text | "" |
      | _structures.content_blocks.values.0.value.color | "Blue" |
      | _structures.content_blocks.values.0._inputs.color.type | "select" |
      | _structures.content_blocks.values.0._inputs.color.comment | "Comment" |
      | _structures.content_blocks.values.0._inputs.color.options.values | ["Red", "Blue"] |

  Scenario: Generating structures carries through extra fields
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        color: "#034AD8"
      
      _comments:
        color: "Woo"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.blocks.values.0.label | "Nested / Card" |
      | _structures.blocks.values.0._comments.color | "Woo" |

  Scenario: Object arrays become structures
    Given a component-lib/components/card/card.bookshop.toml file containing:
      """
      [spec]
      structures = ["blocks"]

      [blueprint]
      title = "Hello World"
      [[blueprint.nested.my_links]]
      text = "My link"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.blocks.values.0.value._bookshop_name | "card" |
      | _structures.blocks.values.0.value.title | "Hello World" |
      | _structures.blocks.values.0.value.nested.my_links | [] |
      | _structures.blocks.values.0._inputs.my_links.type | "array" |
      | _structures.blocks.values.0._inputs.my_links.options.structures.values.0.label | "My Link" |
      | _structures.blocks.values.0._inputs.my_links.options.structures.values.0.icon | "add_box" |
      | _structures.blocks.values.0._inputs.my_links.options.structures.values.0.value.text | "My link" |

  Scenario: Object arrays do not become structures if otherwise configured
    Given a component-lib/components/card/card.bookshop.toml file containing:
      """
      [spec]
      structures = ["blocks"]

      [blueprint]
      title = "Hello World"
      [[blueprint.my_links]]
      text = "My link"

      [_inputs]
      my_links.type = "array"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.blocks.values.0.value._bookshop_name | "card" |
      | _structures.blocks.values.0.value.title | "Hello World" |
      | _structures.blocks.values.0.value.my_links.0.text | "My link" |
      | _structures.blocks.values.0._inputs.my_links.options | undefined |

  Scenario: Object array structures get a copy of any configured settings
    Given a component-lib/components/card/card.bookshop.toml file containing:
      """
      [spec]
      structures = ["blocks"]

      [blueprint]
      title = "Hello World"
      [[blueprint.nested.my_links]]
      text = "My link"

      [_inputs]
      text.comment = "Text comment"

      [_misc]
      something_else = true
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.blocks.values.0._inputs.text.comment | "Text comment" |
      | _structures.blocks.values.0._misc.something_else | true |
      | _structures.blocks.values.0._inputs.my_links.options.structures.values.0._inputs.text.comment | "Text comment" |
      | _structures.blocks.values.0._inputs.my_links.options.structures.values.0._misc.something_else | true |
