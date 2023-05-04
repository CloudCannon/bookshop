@astro
Feature: Astro Bookshop Component Browser Granular Steps

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      cloudcannon.config.yml from starters/astro/cloudcannon.config.yml
      site/
        package.json from starters/astro/package.json # <-- this .json line hurts my syntax highlighting
        astro.config.mjs from starters/astro/astro.config.mjs
        src/
          bookshop/
            bookshop.config.cjs from starters/astro/bookshop.config.cjs
      """
    * a site/src/components/single.bookshop.toml file containing:
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
    * a site/src/components/single.astro file containing:
      """
      <h1>{ Astro.props.title }</h1>
      """
    * a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      ---
      """
    * a site/src/layouts/Page.astro file containing:
      """
      ---
      import BookshopBrowser from '@bookshop/astro-bookshop/browser'
      ---

      <html lang="en"> <body>
      <BookshopBrowser />
      </body> </html>
      """

  @web
  Scenario: Bookshop component browser renders a flat component
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"
