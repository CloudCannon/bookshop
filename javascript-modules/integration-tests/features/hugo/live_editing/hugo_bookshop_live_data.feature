@hugo @web
Feature: Hugo Bookshop CloudCannon Live Editing Site Data

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

  Scenario: Bookshop live renders website data
    Given a site/cloudcannon.config.yml file containing:
      """
      data_config: true
      """
    Given a site/data/cat.yml file containing:
      """
      name: Cheeka
      """
    * a component-lib/components/cat/cat.hugo.html file containing:
      """
      <h1>{{ if .show }}{{ site.Data.cat.name }}{{ end }}</h1>
      """
    * [front_matter]:
      """
      show: false
      """
    * a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `(dict "show" .Params.show)` }}
      {{ partial "bookshop" (slice "cat" (dict "show" .Params.show)) }}
      </body>
      </html>
      """
    * 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      show: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Cheeka"

  @bespoke
  Scenario: Bookshop live renders Hugo data collection as an array
    Given a site/cloudcannon.config.yml file containing:
      """
      data_config: true
      """
    Given a site/data/cats/cheeka.yml file containing:
      """
      name: Cheeka
      useful: no
      messy: no
      """
    Given a site/data/cats/smudge.yml file containing:
      """
      name: Smudge
      useful: yes
      messy: yes
      """
    * a component-lib/components/cat/cat.hugo.html file containing:
      """
      {{ if .show }}
        {{ range site.Data.cats }}
          <p>{{ .name }} — {{ .useful }}/{{ .messy }}</p>
        {{ end }}
      {{ end }}
      """
    * [front_matter]:
      """
      show: false
      """
    * a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `(dict "show" .Params.show)` }}
      {{ partial "bookshop" (slice "cat" (dict "show" .Params.show)) }}
      </body>
      </html>
      """
    * 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      show: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector p:nth-of-type(1) should contain "Cheeka — no/no"
    *    🌐 The selector p:nth-of-type(2) should contain "Smudge — yes/yes"
