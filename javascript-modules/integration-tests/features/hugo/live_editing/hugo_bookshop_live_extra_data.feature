@hugo @bespoke
Feature: Hugo Bookshop CloudCannon Live Editing With Extra Files

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        go.mod from starters/hugo/components.go.mod
        config.toml from starters/hugo/components.config.toml
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.js
      site/
        go.mod from starters/hugo/site.go.mod
        config.toml from starters/hugo/site.config.toml
      """
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `.Params.component_data` }}
      {{ partial "bookshop" (slice "test_component" .Params.component_data) }}
      </body>
      </html>
      """

  @web
  Scenario: Bookshop can live edit with a custom shortcode
    Given [front_matter]:
      """
      component_data:
        label: "Statement:"
        body_markdown: >-
          # Hello World
      """
    Given a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    Given a component-lib/components/test_component/test_component.hugo.html file containing:
      """
      <p class="label">{{ .label }}</p>
      <div class="content">
        {{ .body_markdown | markdownify }}
      </div>
      """
    Given a component-lib/bookshop/bookshop.config.js file containing:
      """
      module.exports = {
        engines: {
          "@bookshop/hugo-engine": {
            extraFiles: {
              "layouts/shortcodes/name.html": "Alan"
            }
          }
        }
      }
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      component_data:
        label: "Statement:"
        body_markdown: >-
          # Hello {{% name %}}!
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .label should contain "Statement:"
    *    🌐 The selector .content>h1 should contain "Hello Alan!"

  @web
  Scenario: Bookshop can live edit with a custom partial
    Given [front_matter]:
      """
      component_data:
        text: "Hello World"
      """
    Given a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    Given a site/layouts/partials/text.html file containing:
      """
      <p class="text">Text: [{{ .text }}]</p>
      """
    Given a component-lib/components/test_component/test_component.hugo.html file containing:
      """
      <p class="component">Inside the Bookshop component!</p>
      {{ partial "text.html" . }}
      """
    Given a component-lib/bookshop/bookshop.config.js file containing:
      """
      const fs = require("fs");
      const path = require("path");

      module.exports = {
        engines: {
          "@bookshop/hugo-engine": {
            extraFiles: {
              "layouts/partials/text.html": fs.readFileSync(
                path.join(__dirname, "../../site/layouts/partials/text.html"),
                { encoding: "utf8" }
              )
            }
          }
        }
      }
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      component_data:
        text: "Hello CloudCannon!"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .component should contain "Inside the Bookshop component!"
    *    🌐 The selector .text should contain "Text: [Hello CloudCannon!]"
