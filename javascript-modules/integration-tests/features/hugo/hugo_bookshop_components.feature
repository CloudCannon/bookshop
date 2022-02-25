@hugo
Feature: Basic Hugo Bookshop
  As a user of Hugo with Bookshop
  I want to be able to use components
  So that I can build my site

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
      """
    And a site/content/_index.md file containing:
      """
      ---
      ---
      """

  Scenario: Tests are functional
    Given a site/layouts/index.html file containing:
      """
      {{ .Content }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      ---
      # Hello World!
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "Hello World!</h1>"

  Scenario: Components are rendered from bookshop
    Given a component-lib/components/title/title.hugo.html file containing:
      """
      <h1>Bookshop: {{ .text }}</h1>
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop" (slice "title" (dict "text" "Result 🧄")) }}
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "Bookshop: Result 🧄"

  Scenario: Components can use the page front matter
    Given a component-lib/components/title/title.hugo.html file containing:
      """
      <h1>Bookshop: {{ .text }}</h1>
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop" (slice "title" (dict "text" .Params.title_text)) }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      title_text: "Result 👍"
      ---
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "Bookshop: Result 👍"

  Scenario: Components can use further components
    Given a component-lib/components/hero/hero.hugo.html file containing:
      """
      <h1>{{ .text }}</h1>
      {{ partial "bookshop" (slice "tag" (dict "tag" .tag)) }}
      """
    And a component-lib/components/tag/tag.hugo.html file containing:
      """
      <span>{{ .tag.label }}</span>
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop" (slice "hero" (dict "text" .Params.title_text "tag" .Params.tag)) }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      title_text: "🩳"
      tag:
        label: "🪣"
      ---
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "<h1>🩳</h1>"
    And site/public/index.html should contain the text "<span>🪣</span>"

  # This is can be done natively in Hugo, so doesn't use the bind syntax
  Scenario: Bookshop tags can use the bind syntax
    Given a component-lib/components/card/card.hugo.html file containing:
      """
      <h1>{{ .title }}</h1>
      <p>{{ .description }}</p>
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop" (slice "card" .Params.card) }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      card:
        title: "🧻"
        description: "⛳"
      ---
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "<h1>🧻</h1>"
    And site/public/index.html should contain the text "<p>⛳</p>"

  Scenario: Bookshop tags should support dynamic names
    Given a component-lib/components/a/a.hugo.html file containing "🅰️{{.e}}"
    And a component-lib/components/b/b.hugo.html file containing "🅱️{{.e}}"
    And a site/layouts/index.html file containing:
      """
      {{ range .Params.components }}
        {{ partial "bookshop" (slice ._name .) }}
      {{ end }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      components:
        - _name: a
          e: 🫀
        - _name: b
          e: 🫑
      ---
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "🅰️🫀"
    And site/public/index.html should contain the text "🅱️🫑"

  Scenario: Bookshop page building components should work
    Given a component-lib/components/page/page.hugo.html file containing:
      """
      {{ range .column_contents }}
        {{ partial "bookshop" . }}
      {{ end }}
      """
    And a component-lib/components/tag/tag.hugo.html file containing "tag-{{.tag}}-tag"
    And a site/layouts/index.html file containing:
      """
      {{ range .Params.components }}
        {{ partial "bookshop" . }}
      {{ end }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      components:
        - _bookshop_name: page
          column_contents:
            - _bookshop_name: tag
              tag: "contents"
            - _bookshop_name: tag
              tag: "another"
      ---
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "tag-contents-tag"
    And site/public/index.html should contain the text "tag-another-tag"

  @bespoke
  Scenario: Bookshop components without props
    Given a component-lib/components/outer/outer.hugo.html file containing:
      """
      <div> {{ partial "bookshop" "inner" }} </div>
      """
    Given a component-lib/components/inner/inner.hugo.html file containing:
      """
      <h1>Hello :)</h1>
      """
    And a site/content/_index.md file containing:
      """
      ---
      ---
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" "" }}
      {{ partial "bookshop" "outer" }}
      </body>
      </html>
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And DEBUG site/public/index.html should contain the text "Hello :)"