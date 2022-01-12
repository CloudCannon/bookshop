Feature: Hugo Bookshop CloudCannon Live Editing

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

  Scenario: Bookshop Live browser updati
    Given a component-lib/components/single/single.bookshop.toml file containing:
      """
      [component]
      structures = [ "content_blocks" ]

      [props]
      title = "Hello World"
      """
    Given a component-lib/components/single/single.hugo.html file containing:
      """
      <h1>{{ .title }}</h1>
      """
    Given a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bind_next" ".Params.block" }}
      {{ partial "bookshop" (dict "component" .Params.block._bookshop_name "title" .Params.block.title) }}
      </body>
      </html>
      """
    Given a site/content/_index.md file containing:
      """
      ---
      block:
        _bookshop_name: single
        title: "Hello There"
      ---
      """
    # Building the site
    When I run "hugo" in the site directory
    Then stderr should be empty
       * stdout should contain "Total in"
       * site/public/index.html should contain each row: 
      | text |
      | <!--bookshop-live name(__bookshop__subsequent) params(bind: .Params.block) context() -->  |
      | <!--bookshop-live name(single) params() context() -->  |
    # Running Bookshop Generate
    When I run "cloudcannon-hugo --baseurl /" in the site directory
       * I run "npm start" in the . directory
    Then stderr should be empty
       * stdout should contain "Modifying built site at ./site/public"
       * stdout should contain "Added live editing to 1 page containing Bookshop components"
    # Testing CloudCannon initialising
    When I serve the site/public directory
       * 🌐 I load http://localhost:__PORT__
    Then 🌐 The selector h1 should contain "Hello There"
    When 🌐 CloudCannon is ready with the data:
      """
      {
        block: {
          _bookshop_name: "single",
          title: "Gidday"
        }
      }
      """
       * 🌐 "window.bookshopLive.hasRendered === true" evaluates
    Then 🌐 There should be no errors
       * 🌐 There should be no logs
       * 🌐 The selector h1 should contain "Gidday"
    # # Testing CloudCannon data changing
    # When 🌐 CloudCannon pushes new data:
    #   """
    #   {
    #     content_blocks: [ {
    #       _bookshop_name: "single",
    #       title: "Rerendered"
    #     } ]
    #   }
    #   """
    # Then 🌐 There should be no errors
    # Then 🌐 The selector h1 should contain "Rerendered"