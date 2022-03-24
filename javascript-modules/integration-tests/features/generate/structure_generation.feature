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
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "id_key" : "_bookshop_name" |
      | "value" : { "_bookshop_name" : "card" , "card_text" : "", "color" : "Blue" } |
      | "label" : "Card" |
      | "_inputs" : { "color" : { "type" : "select" , "comment" : "Comment" , "options" : { "values" : [ "Red" , "Blue" ] } } } |

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
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "label" : "Nested / Card" |
      | "_comments" : { "color" : "Woo" } |

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
    # TODO: Bring over the JSON tests from Rosey
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "value" : { "_bookshop_name" : "card" , "title" : "Hello World", "nested" : { "my_links" : [ ] } } |
      | "_inputs" : { "my_links" : { "options" : { "structures" : { "values" : [ { "label" : "My Link" , "icon" : "add_box" , "value" : { "text" : "My link" } } ] } } , "type" : "array" } } |

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
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "value" : { "_bookshop_name" : "card" , "title" : "Hello World", "my_links" : [ { "text" : "My link" } ] } |
    And site/public/_cloudcannon/info.json should not contain the text "add_box"

  Scenario: JSON config is supported
    Given a component-lib/components/a/b/c/d/e/e.bookshop.json file containing:
      """
      {
        "spec": {
          "structures": ["anything"]
        },
        "blueprint": {
          "title": "Hello"
        }
      }
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "label" : "A / B / C / D / E" |
      | "value" : { "_bookshop_name" : "a/b/c/d/e" , "title" : "Hello" } |

  Scenario: JS object config is supported
    Given a component-lib/components/a/b/c/d/e/e.bookshop.js file containing:
      """
      module.exports = {
        spec: {
          structures: ["anything"]
        },
        blueprint: {
          title: `Hello`
        }
      }
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "label" : "A / B / C / D / E" |
      | "value" : { "_bookshop_name" : "a/b/c/d/e" , "title" : "Hello" } |

  Scenario: JS function config is supported
    Given a component-lib/components/a/b/c/d/e/e.bookshop.js file containing:
      """
      module.exports = () => {
        const spec = { structures : ["🤷‍♂️"] }
        const blueprint = {};
        blueprint.title = "Hello";

        return { spec, blueprint }
      }
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "label" : "A / B / C / D / E" |
      | "value" : { "_bookshop_name" : "a/b/c/d/e" , "title" : "Hello" } |

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