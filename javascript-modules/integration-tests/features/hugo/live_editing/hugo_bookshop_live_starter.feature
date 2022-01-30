@hugo @web
Feature: Hugo Bookshop CloudCannon Starter Template Live Editing

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
    Given a component-lib/shared/hugo/page.hugo.html file containing:
      """
      <div>
      {{ range . }}
        {{ partial "bookshop" . }}
      {{ end }}
      </div>
      """
    * a component-lib/components/tag/tag.hugo.html file containing:
      """
      <span class="u-tag">{{ .text }}</span>
      """
    * a component-lib/components/content/content.hugo.html file containing:
      """
      <div class="c-content c-content--{{ .type }}">
          {{ if eq .type "note" }}
              {{ partial "bookshop" (slice "tag" (dict "text" "Note")) }}
          {{ end }}
          {{ .content_html | safeHTML }}
      </div>
      """
    * a component-lib/components/hero/hero.hugo.html file containing:
      """
      <div class="c-title">
          {{ range .tags }}
              {{ partial "bookshop" (slice "tag" (dict "text" .text)) }}
          {{ end }}
          <h1 class="c-title__title">
              {{ .title }}
          </h1>
          {{ if .content_html }}
              {{ partial "bookshop" (slice "content" (dict "content_html" .content_html)) }}
          {{ end }}
      </div>
      """
    * [front_matter]:
      """
      content_blocks:
        - _bookshop_name: hero
          title: Bookshop Hugo Starter
          content_html: >-
            <p>A skeleton for getting started with your component journey using Bookshop and Hugo.</p>
          tags:
            - text: "bookshop"
            - text: "hugo"
        - _bookshop_name: content
          content_html: >-
            <p>For more info, check out the <a href="https://github.com/CloudCannon/hugo-bookshop-starter#readme" target="_blank">readme</a></p>
          type: standard
      note_html: >-
        <p>You can also use the bookshop tag directly.</p>
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
        {{ partial "bookshop_bindings" `.Params.content_blocks` }}
        {{ partial "bookshop_partial" (slice "page" .Params.content_blocks) }}

        {{ partial "bookshop_bindings" `(dict "content_html" .Params.note_html "type" "note")` }}
        {{ partial "bookshop" (slice "content" (dict "content_html" .Params.note_html "type" "note")) }}
      </body>
      </html>
      """

  Scenario: Bookshop live renders updates to the starter template
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      content_blocks:
        - _bookshop_name: hero
          title: Bookshop Hugo Starter
          content_html: >-
            <p>A skeleton for getting started with your component journey using Bookshop and Hugo.</p>
          tags:
            - text: "bookshop"
            - text: "hugo"
            - text: "starter"
        - _bookshop_name: content
          content_html: >-
            <p>For more info, check out the <a href="https://github.com/CloudCannon/hugo-bookshop-starter#readme" target="_blank">readme</a></p>
          type: standard
      note_html: >-
        <p>You can also use the bookshop tag directly.</p>
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .u-tag:nth-of-type(3) should contain "starter"

  Scenario: Bookshop live renders starter template data bindings
    Given 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .c-content--note should match "data-cms-bind=\"#note_html\""
    *    🌐 The selector .c-title should match "data-cms-bind=\"#content_blocks.0\""
    *    🌐 The selector .u-tag:nth-of-type(2) should match "data-cms-bind=\"#content_blocks.0.tags.1.text\""