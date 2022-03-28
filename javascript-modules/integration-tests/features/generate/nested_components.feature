@generate
Feature: Bookshop Nested Components
  As a user who is using a bookshop
  I want to be able to nest components within each other
  So that I don't have to respecify all of their fields

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

  Scenario: Referencing a single component creates a bespoke object structure
    Given a component-lib/components/tag/tag.bookshop.yml file containing:
      """
      spec:
        label: "Little Tag"
        structures:
          - subcomponents

      blueprint:
        text: "My tag text"
        size: "Medium"
      
      _inputs:
        size:
          type: select
          options:
            values:
              - Small
              - Medium
              - Large
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        color: "#034AD8"
        tag: "bookshop:tag"
      
      _inputs:
        color:
          type: "color"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 2 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                 | value        |
      | _structures.subcomponents.values.0.label             | "Little Tag" |
      | _structures.subcomponents.values.0.value.size        | "Medium"     |
      | _structures.subcomponents.values.0._inputs.size.type | "select"     |

      | _structures.blocks.values.0.label       | "Nested / Card" |
      | _structures.blocks.values.0.value.color | "#034AD8"       |
      | _structures.blocks.values.0.value.tag   | {}              |

      | _structures.blocks.values.0._inputs.color.type                                                  | "color"                      |
      | _structures.blocks.values.0._inputs.tag.type                                                    | "object"                     |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0.label                       | "Little Tag"                 |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0.value.size                  | "Medium"                     |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0._inputs.size.type           | "select"                     |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0._inputs.size.options.values | ["Small", "Medium", "Large"] |

  Scenario: Referencing a single component in an array creates a bespoke array structure
    Given a component-lib/components/tag/tag.bookshop.yml file containing:
      """
      spec:
        label: "Little Tag"
        structures:
          - subcomponents

      blueprint:
        text: "My tag text"
        size: "Medium"
      
      _inputs:
        size:
          type: select
          options:
            values:
              - Small
              - Medium
              - Large
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        color: "#034AD8"
        tag: 
          - bookshop:tag
      
      _inputs:
        color:
          type: "color"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 2 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                 | value        |
      | _structures.subcomponents.values.0.label             | "Little Tag" |
      | _structures.subcomponents.values.0.value.size        | "Medium"     |
      | _structures.subcomponents.values.0._inputs.size.type | "select"     |

      | _structures.blocks.values.0.label       | "Nested / Card" |
      | _structures.blocks.values.0.value.color | "#034AD8"       |
      | _structures.blocks.values.0.value.tag   | []              |

      | _structures.blocks.values.0._inputs.color.type                                                  | "color"                      |
      | _structures.blocks.values.0._inputs.tag.type                                                    | "array"                      |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0.label                       | "Little Tag"                 |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0.value.size                  | "Medium"                     |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0._inputs.size.type           | "select"                     |
      | _structures.blocks.values.0._inputs.tag.options.structures.values.0._inputs.size.options.values | ["Small", "Medium", "Large"] |

  Scenario: Referencing a structure configures a linked-structure object input
    Given a component-lib/components/tag/tag.bookshop.yml file containing:
      """
      spec:
        label: "Little Tag"
        structures:
          - subcomponents

      blueprint:
        text: "My tag text"
        size: "Medium"
      
      _inputs:
        size:
          type: select
          options:
            values:
              - Small
              - Medium
              - Large
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        color: "#034AD8"
        tag: "bookshop:structure:subcomponents"
      
      _inputs:
        color:
          type: "color"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 2 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                 | value        |
      | _structures.subcomponents.values.0.label             | "Little Tag" |
      | _structures.subcomponents.values.0.value.size        | "Medium"     |
      | _structures.subcomponents.values.0._inputs.size.type | "select"     |

      | _structures.blocks.values.0.label       | "Nested / Card" |
      | _structures.blocks.values.0.value.color | "#034AD8"       |
      | _structures.blocks.values.0.value.tag   | {}              |

      | _structures.blocks.values.0._inputs.color.type             | "color"         |
      | _structures.blocks.values.0._inputs.tag.type               | "object"        |
      | _structures.blocks.values.0._inputs.tag.options.structures | "_structures.subcomponents" |

  Scenario: Referencing a structure in an array configures a linked-structure array input
    Given a component-lib/components/tag/tag.bookshop.yml file containing:
      """
      spec:
        label: "Little Tag"
        structures:
          - subcomponents

      blueprint:
        text: "My tag text"
        size: "Medium"

      _inputs:
        size:
          type: select
          options:
            values:
              - Small
              - Medium
              - Large
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        color: "#034AD8"
        tag: ["bookshop:structure:subcomponents"]

      _inputs:
        color:
          type: "color"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 2 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                 | value        |
      | _structures.subcomponents.values.0.label             | "Little Tag" |
      | _structures.subcomponents.values.0.value.size        | "Medium"     |
      | _structures.subcomponents.values.0._inputs.size.type | "select"     |

      | _structures.blocks.values.0.label       | "Nested / Card" |
      | _structures.blocks.values.0.value.color | "#034AD8"       |
      | _structures.blocks.values.0.value.tag   | []              |

      | _structures.blocks.values.0._inputs.color.type             | "color"         |
      | _structures.blocks.values.0._inputs.tag.type               | "array"         |
      | _structures.blocks.values.0._inputs.tag.options.structures | "_structures.subcomponents" |

  Scenario: Errors referencing nonexistent component in an object
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        inner: bookshop:inner
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test referenced bookshop:inner, but the component inner does not exist"

  Scenario: Errors referencing nonexistent component in an array
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        inner: [bookshop:inner]
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test referenced bookshop:inner, but the component inner does not exist"

  Scenario: Errors on invalid shorthand
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        inner: [bookshop:inner, bookshop:structure:something]
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Bookshop shorthand arrays can only contain a single element"
