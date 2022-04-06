@init
Feature: Generating Bookshop Components
  As a user who is using a bookshop
  I want a CLI to make new components
  So that I don't have to create all the files myself.
  
  Background:
    Given the file tree:
      """
      package.json from starters/init/package.json  # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Creating a new Jekyll component from the bookshop
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/jekyll/bookshop.config.js
      """
    When I run "npm start -- --component button --format toml" in the src/component-lib directory
    Then stderr should be empty
    And stdout should contain "components/button/button.bookshop.toml"
    And src/component-lib/components/button/button.jekyll.html should contain the text "c-button"
    And src/component-lib/components/button/button.scss should contain the text ".c-button"
    And src/component-lib/components/button/button.bookshop.toml should contain the text "content_blocks"

  Scenario: Creating a new Jekyll component from the root
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/jekyll/bookshop.config.js
      """
    When I run "npm start -- --component button --format js" in the src directory
    Then stderr should be empty
    And stdout should contain "component-lib/components/button/button.bookshop.js"
    And src/component-lib/components/button/button.jekyll.html should contain the text "c-button"
    And src/component-lib/components/button/button.scss should contain the text ".c-button"
    And src/component-lib/components/button/button.bookshop.js should contain the text "content_blocks"

  Scenario: Creating a new Eleventy component from the bookshop
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/eleventy/bookshop.config.js
      """
    When I run "npm start -- --component button --format yml" in the src/component-lib directory
    Then stderr should be empty
    And stdout should contain "components/button/button.bookshop.yml"
    And src/component-lib/components/button/button.eleventy.liquid should contain the text "c-button"
    And src/component-lib/components/button/button.scss should contain the text ".c-button"
    And src/component-lib/components/button/button.bookshop.yml should contain the text "content_blocks"

  Scenario: Creating a new deep nested component
    Given the file tree:
      """
      src/
        component-lib/
          bookshop/
            bookshop.config.js from starters/eleventy/bookshop.config.js
      """
    When I run "npm start -- --component deep/nested/component --format js" in the src/component-lib directory
    Then stderr should be empty
    And stdout should contain "components/deep/nested/component/component.bookshop.js"
    And src/component-lib/components/deep/nested/component/component.eleventy.liquid should contain the text "c-deep-nested-component"
    And src/component-lib/components/deep/nested/component/component.scss should contain the text ".c-deep-nested-component"
    And src/component-lib/components/deep/nested/component/component.bookshop.js should contain the text "content_blocks"
