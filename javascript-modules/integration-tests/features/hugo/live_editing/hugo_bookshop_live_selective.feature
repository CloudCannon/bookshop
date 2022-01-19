@hugo
Feature: Hugo Bookshop CloudCannon Live Editing Selective Re-rendering

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
    * a component-lib/components/single/single.hugo.html file containing:
      """
      <h1>{{ .title }}</h1>
      """
    * a component-lib/components/multiple/multiple.hugo.html file containing:
      """
      <div>
      {{ range .items }}
        {{ partial "bookshop" (merge . (dict "component" "single")) }}
      {{ end }}
      </div>
      """
    * a component-lib/components/uppermost/uppermost.hugo.html file containing:
      """
      <div>
      {{ partial "bookshop" (merge .one (dict "component" "multiple")) }}
      <span>{{ .two }}</span>
      {{ partial "bookshop" (dict "component" "single" "title" .three) }}
      </div>
      """

  Scenario: Bookshop selectively live renders a loop
    Given [front_matter]:
      """
      items:
        - title: "One"
        - title: "Two"
        - title: "Three"
      """
    And a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" "bind: .Params" }}
      {{ partial "bookshop" (dict "component" "multiple" "items" .Params.items) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    And 🌐 I have added a click listener to h1:nth-of-type(2)
    When 🌐 CloudCannon pushes new yaml:
      """
      items:
        - title: "A"
        - title: "Two"
        - title: "C"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(1) should contain "A"
    *    🌐 The selector h1:nth-of-type(3) should contain "C"
    *    🌐 There should be a click listener on h1:nth-of-type(2)

  Scenario: Bookshop live renders components depth first
    Given [front_matter]:
      """
      data:
        one: 
          items:
            - title: "I"
            - title: "II"
            - title: "III"
        two: "two"
        three: "three"
      """
    And a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" "bind: .Params.data" }}
      {{ partial "bookshop" (merge .Params.data (dict "component" "uppermost")) }}
      </body>
      </html>
      """
    Given 🌐 I have loaded my site in CloudCannon
    And  🌐 I have added a click listener to span
    When 🌐 CloudCannon pushes new yaml:
      """
      data:
        one: 
          items:
            - title: "I"
            - title: "II"
            - title: "III"
            - title: "IV"
        two: "two"
        three: "tres"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(4) should contain "IV"
    *    🌐 There should be a click listener on span
