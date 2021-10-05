Feature: Generating Bookshop Components
  As a user who is using a bookshop
  I want a CLI to make new components
  So that I don't have to create all the files myself.

  @skip
  Scenario: Creating a new Jekyll component from the bookshop
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/jekyll/bookshop.config.js
      """
    When I run "npx @bookshop/gen --name button" in the src/component-lib directory
    Then stderr should be empty
    And stdout should contain "Created component button in components/button"
    And src/component-lib/components/button/button.jekyll.html should contain the text "c-button"
    And src/component-lib/components/button/button.scss should contain the text ".c-button"
    And src/component-lib/components/button/button.bookshop.toml should contain the text "button"

  @skip
  Scenario: Creating a new Jekyll component from the root
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/jekyll/bookshop.config.js
      """
    When I run "npx @bookshop/gen --name button" in the src directory
    Then stderr should be empty
    And stdout should contain "Created component button in component-lib/components/button"
    And src/component-lib/components/button/button.jekyll.html should contain the text "c-button"
    And src/component-lib/components/button/button.scss should contain the text ".c-button"
    And src/component-lib/components/button/button.bookshop.toml should contain the text "button"

  @skip
  Scenario: Creating a new Eleventy component from the bookshop
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/eleventy/bookshop.config.js
      """
    When I run "npx @bookshop/gen --name button" in the src/component-lib directory
    Then stderr should be empty
    And stdout should contain "Created component button in components/button"
    And src/component-lib/components/button/button.eleventy.liquid should contain the text "c-button"
    And src/component-lib/components/button/button.scss should contain the text ".c-button"
    And src/component-lib/components/button/button.bookshop.toml should contain the text "button"

  @skip
  Scenario: Creating a new deep nested component
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/eleventy/bookshop.config.js
      """
    When I run "npx @bookshop/gen --name deep/nested/component" in the src/component-lib directory
    Then stderr should be empty
    And stdout should contain "Created component deep-nested-component in components/deep/nested/component"
    And src/component-lib/components/deep/nested/component/component.eleventy.liquid should contain the text "c-deep-nested-component"
    And src/component-lib/components/deep/nested/component/component.scss should contain the text ".c-deep-nested-component"
    And src/component-lib/components/deep/nested/component/component.bookshop.toml should contain the text "deep-nested-component"
