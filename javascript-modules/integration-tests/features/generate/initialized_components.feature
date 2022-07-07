@generate
Feature: Bookshop Initialized Components
  As a user who is using a bookshop
  I want to be able to provide default components in a blueprint
  So that the editor has with a useful starting

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
    And a component-lib/components/generic/tag/tag.bookshop.yml file containing:
      """
      spec:
        structures:
          - subcomponents

      blueprint:
        text: "My tag text"
        size: "Medium"
      """
    And a component-lib/components/interactive/button/button.bookshop.yml file containing:
      """
      spec:
        structures:
          - subcomponents

      blueprint:
        label: "My button label"
        href: "#"
      """
    When I run "hugo" in the site directory
    And I run "cloudcannon-hugo --baseurl /" in the site directory

  Scenario: Single components can be initialized
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        tag: bookshop:generic/tag!
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 4 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                 | value           |
      | _structures.blocks.values.0.label                    | "Nested / Card" |
      | _structures.blocks.values.0.value.tag._bookshop_name | "generic/tag"   |
      | _structures.blocks.values.0.value.tag.text           | "My tag text"   |
      | _structures.blocks.values.0.value.tag.size           | "Medium"        |

  Scenario: Single component arrays can be initialized
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        one_tag:
          - bookshop:generic/tag!
        two_tags:
          - bookshop:generic/tag!
          - bookshop:generic/tag!
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 4 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                        | value           |
      | _structures.blocks.values.0.label                           | "Nested / Card" |
      | _structures.blocks.values.0.value.one_tag.0._bookshop_name  | "generic/tag"   |
      | _structures.blocks.values.0.value.one_tag.0.text            | "My tag text"   |
      | _structures.blocks.values.0.value.one_tag.0.size            | "Medium"        |
      | _structures.blocks.values.0.value.two_tags.1._bookshop_name | "generic/tag"   |
      | _structures.blocks.values.0.value.two_tags.1.text           | "My tag text"   |
      | _structures.blocks.values.0.value.two_tags.1.size           | "Medium"        |

  Scenario: Structure components can be initialized
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        tag: "bookshop:structure:subcomponents!(generic/tag)"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 3 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                 | value           |
      | _structures.blocks.values.0.label                    | "Nested / Card" |
      | _structures.blocks.values.0.value.tag._bookshop_name | "generic/tag"   |
      | _structures.blocks.values.0.value.tag.text           | "My tag text"   |
      | _structures.blocks.values.0.value.tag.size           | "Medium"        |

  Scenario: Structure component arrays can be initialized
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        blocks:
          - "bookshop:structure:subcomponents!(generic/tag)"
          - "bookshop:structure:subcomponents!(interactive/button)"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 3 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                      | value                |
      | _structures.blocks.values.0.label                         | "Nested / Card"      |
      | _structures.blocks.values.0.value.blocks.0._bookshop_name | "generic/tag"        |
      | _structures.blocks.values.0.value.blocks.0.text           | "My tag text"        |
      | _structures.blocks.values.0.value.blocks.0.size           | "Medium"             |
      | _structures.blocks.values.0.value.blocks.1._bookshop_name | "interactive/button" |
      | _structures.blocks.values.0.value.blocks.1.label          | "My button label"    |
      | _structures.blocks.values.0.value.blocks.1.href           | "#"                  |

  Scenario: Nested components can be initialized
    Given a component-lib/components/nested/block/block.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        inner: bookshop:nested/card!
      """
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        tag: bookshop:generic/tag!
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 6 structures from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path                                                       | value         |
      | _structures.blocks.values.0.value.inner.tag._bookshop_name | "generic/tag" |

  Scenario: Errors referencing nonexistent component in a structure
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        inner: bookshop:structure:blocks!(generic/tag)
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "A blueprint referenced bookshop:structure:blocks!(generic/tag), but the component generic/tag does not exist in the blocks structure"

  Scenario: Errors mixing single components
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        two_tags:
          - bookshop:generic/tag!
          - bookshop:interactive/button!
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test contains an array that starts with bookshop:generic/tag!, but the following items do not match"
    Then stderr should contain "Any subsequent array entries must be of the form bookshop:generic/tag!"

  Scenario: Errors on mixed structures
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        inner:
          - bookshop:structure:blocks!(test)
          - bookshop:structure:subcomponents!(generic/tag)
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test contains an array that starts with bookshop:structure:blocks!(test), but the following items do not match"
    Then stderr should contain "Any subsequent array entries must be of the form bookshop:structure:blocks!(<component_name>)"

  Scenario: Errors on mixed components and structures
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        inner:
          - bookshop:structure:blocks!(test)
          - bookshop:generic/button!
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test contains an array that starts with bookshop:structure:blocks!(test), but the following items do not match"
    Then stderr should contain "Any subsequent array entries must be of the form bookshop:structure:blocks!(<component_name>)"

  Scenario: Errors on a single component with a parameter
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        tag: bookshop:generic/tag!(huh)
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test referenced bookshop:generic/tag!(huh)"
    Then stderr should contain "Single component shorthands cannot have parameters, did you mean to use the bookshop:structure: shorthand?"

  Scenario: Errors on a structure without a parameter
    Given a component-lib/components/test/test.bookshop.yml file containing:
      """
      blueprint:
        tag: bookshop:structure:blocks!
      """
    When I try run "npm start" in the . directory
    Then stderr should contain "Component test referenced bookshop:structure:blocks! but did not provide a component name as a parameter"
    Then stderr should contain "Expected bookshop:structure:blocks or bookshop:structure:blocks!(<component_name>)"
