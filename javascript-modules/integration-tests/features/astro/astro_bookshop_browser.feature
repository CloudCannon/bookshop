@astro
Feature: Astro Bookshop Component Browser
  As a user of Astro with Bookshop
  I want my component browser to be preconfigured to my bookshop
  So that I can view components while developing

  Background:
    Given the file tree:
      """
      site/
        package.json from starters/astro/package.json # <-- this .json line hurts my syntax highlighting
        astro.config.mjs from starters/astro/astro.config.mjs
        src/
          bookshop/
            bookshop.config.cjs from starters/astro/bookshop.config.cjs
      """

  Scenario: Bookshop Browser tags
    Given a site/src/pages/components.astro file containing:
      """
      ---
      import BookshopBrowser from '@bookshop/astro-bookshop/browser'
      ---

      <BookshopBrowser />
      <BookshopBrowser port={99}>
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/components/index.html should contain each row:
      | text                                                         |
      | <div data-bookshop-browser=""></div>                         |
      | <script src=\"http://localhost:30775/bookshop.js\"></script> |
      | <script src=\"http://localhost:99/bookshop.js\"></script>    |