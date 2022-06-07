@up
Feature: Bookshop Misc Migrations

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      package.json from starters/up/package.json  # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Misc migrations can be skipped
    Given a component-lib/config.toml file containing:
      """
      [[module.mounts]]
      target = "layouts/partials/bookshop"
      """
    When I run "npm start -- --yes --version 9.9.9 --skip-migrations" in the . directory
    Then stderr should be empty
    And stdout should contain "Skipping Bookshop Hugo module migrations."
    And stdout should not contain "Changing the contents of ./component-lib/config.toml"
    And component-lib/config.toml should contain exactly: 
      """
      [[module.mounts]]
      target = "layouts/partials/bookshop"
      """

  Scenario: Adds includeFiles to Bookshop module config files
    Given a component-lib/config.toml file containing:
      """
      [module]
      hugoVersion.extended = true
      hugoVersion.min = "0.86.1"

      [[module.mounts]]
      source = "."
      target = "layouts/partials/bookshop"

      [[module.mounts]]
      source = "."
      target = "assets/bookshop"
      """
    When I run "npm start -- --yes --version 9.9.9" in the . directory
    Then stderr should be empty
    And stdout should contain "Changing the contents of ./component-lib/config.toml"
    And component-lib/config.toml should contain exactly: 
      """

      [module]
      hugoVersion.extended = true
      hugoVersion.min = '0.86.1'

      [[module.mounts]]
      source = '.'
      target = 'layouts/partials/bookshop'
      includeFiles = [
        '**/*.hugo.html',
      ]

      [[module.mounts]]
      source = '.'
      target = 'assets/bookshop'

      """