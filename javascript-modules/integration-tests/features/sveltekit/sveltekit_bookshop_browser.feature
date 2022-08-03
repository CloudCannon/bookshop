@sveltekit
Feature: SvelteKit Bookshop Component Browser
  As a user of SvelteKit with Bookshop
  I want my component browser to be preconfigured to my bookshop
  So that I can view components while developing

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/sveltekit/bookshop.config.js_
      site/
        svelte.config.js from starters/sveltekit/svelte.config.js_
        vite.config.js from starters/sveltekit/vite.config.js_
        package.json from starters/sveltekit/package.json # <-- this .json line hurts my syntax highlighting
        content/
          pages/
            index.md from starters/sveltekit/content/pages/index.md
        src/
          app.html from starters/sveltekit/src/app.html
          lib/
            collections.js from starters/sveltekit/src/lib/collections.js_
            routing.js from starters/sveltekit/src/lib/routing.js_
          routes/
            [slug].json.js from starters/sveltekit/src/routes/[slug].json.js_
            index.svelte from starters/sveltekit/src/routes/index.svelte
      """

  Scenario: Bookshop Browser tags
    Given a site/src/routes/index.svelte file containing:
      """
      <script>
        import { BookshopBrowser } from "@bookshop/sveltekit-bookshop";
      </script>

      <BookshopBrowser />
      <BookshopBrowser port={99} />
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain each row:
      | text                                                         |
      | <div data-bookshop-browser=""></div>                         |
      | <script src=\"http://localhost:30775/bookshop.js\"></script> |
      | <script src=\"http://localhost:99/bookshop.js\"></script>    |

