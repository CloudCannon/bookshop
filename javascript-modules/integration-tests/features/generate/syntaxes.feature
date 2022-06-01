@generate
Feature: Bookshop Syntaxes
  As a user who is using a bookshop
  I want to be able to use any syntax
  So that my config files match my repo

  Background:
    Given the file tree:
      """
      component-lib/
        go.mod from starters/hugo/components.go.mod
        config.toml from starters/hugo/components.config.toml
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

  Scenario: YAML config is supported
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.yml from starters/hugo/bookshop.config.yml
      """
    Given a component-lib/components/a/b/c/d/e/e.bookshop.json file containing:
      """
      spec:
        structures:
          - anything
      
      blueprint:
        title: Hello
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.anything.values.0.label | "A / B / C / D / E" |
      | _structures.anything.values.0.value._bookshop_name | "a/b/c/d/e" |
      | _structures.anything.values.0.value.title | "Hello" |

  Scenario: TOML config is supported
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.toml from starters/hugo/bookshop.config.toml
      """
    Given a component-lib/components/a/b/c/d/e/e.bookshop.json file containing:
      """
      [spec]
      structures = ["anything"]

      [blueprint]
      title = "Hello"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.anything.values.0.label | "A / B / C / D / E" |
      | _structures.anything.values.0.value._bookshop_name | "a/b/c/d/e" |
      | _structures.anything.values.0.value.title | "Hello" |

  Scenario: JSON config is supported
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.json from starters/hugo/bookshop.config.json
      """
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
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.anything.values.0.label | "A / B / C / D / E" |
      | _structures.anything.values.0.value._bookshop_name | "a/b/c/d/e" |
      | _structures.anything.values.0.value.title | "Hello" |

  Scenario: JS object config is supported
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.js
      """
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
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.anything.values.0.label | "A / B / C / D / E" |
      | _structures.anything.values.0.value._bookshop_name | "a/b/c/d/e" |
      | _structures.anything.values.0.value.title | "Hello" |

  Scenario: JS function config is supported
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.func.js
      """
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
    Then I should see "site/public/_cloudcannon/info.json" containing the values:
      | path | value |
      | _structures.🤷‍♂️.values.0.label | "A / B / C / D / E" |
      | _structures.🤷‍♂️.values.0.value._bookshop_name | "a/b/c/d/e" |
      | _structures.🤷‍♂️.values.0.value.title | "Hello" |
