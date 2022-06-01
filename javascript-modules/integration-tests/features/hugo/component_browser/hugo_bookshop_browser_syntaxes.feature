@hugo @bespoke
Feature: Hugo Bookshop Component Browser Syntaxes

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        go.mod from starters/hugo/components.go.mod
        config.toml from starters/hugo/components.config.toml
      site/
        go.mod from starters/hugo/site.go.mod
        config.toml from starters/hugo/site.config.toml
      """
    * a component-lib/components/single/single.hugo.html file containing:
      """
      <h1>{{ .title }}</h1>
      """
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_component_browser" }}
      </body>
      </html>
      """
    * a site/content/_index.md file containing:
      """
      ---
      ---
      """

  @web
  Scenario: Bookshop component browser works with YAML
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.yml from starters/hugo/bookshop.config.yml
      """
    Given a component-lib/components/single/single.bookshop.yml file containing:
      """
      spec:
        structures: ["content_blocks"]
        label: Single
        description: Single component
        icon: nature_people
        tags: ["Basic"]
      
      blueprint:
        title: Hello There, World
      """
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"

  @web
  Scenario: Bookshop component browser works with TOML
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.toml from starters/hugo/bookshop.config.toml
      """
    Given a component-lib/components/single/single.bookshop.toml file containing:
      """
      [spec]
      structures = [ "content_blocks" ]
      label = "Single"
      description = "Single component"
      icon = "nature_people"
      tags = ["Basic"]

      [blueprint]
      title = "Hello There, World"
      """
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"

  @web
  Scenario: Bookshop component browser works with JSON
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.json from starters/hugo/bookshop.config.json
      """
    Given a component-lib/components/single/single.bookshop.json file containing:
      """
      {
        "spec": {
          "structures": ["content_blocks"],
          "label": "Single",
          "description": "Single component",
          "icon": "nature_people",
          "tags": ["Basic"]
        },
        "blueprint": {
          "title": "Hello There, World"
        }
      }
      """
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"

  @web
  Scenario: Bookshop component browser works with JS objects
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.js
      """
    Given a component-lib/components/single/single.bookshop.js file containing:
      """
      module.exports = {
        spec: {
          structures: ["content_blocks"],
          label: "Single",
          description: "Single component",
          icon: "nature_people",
          tags: ["Basic"],
        },
        blueprint: {
          title: "Hello There, World",
        },
      }
      """
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"

  @web
  Scenario: Bookshop component browser works with JS functions
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.func.js
      """
    Given a component-lib/components/single/single.bookshop.js file containing:
      """
      module.exports = () => {
        return {
          spec: {
            structures: ["content_blocks"],
            label: "Single",
            description: "Single component",
            icon: "nature_people",
            tags: ["Basic"],
          },
          blueprint: {
            title: "Hello There, World",
          },
        };
      }
      """
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"
