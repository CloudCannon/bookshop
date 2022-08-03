@sveltekit
Feature: SvelteKit Bookshop Component Browser Granular Steps

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        bookshop/
          bookshop.config.js from starters/sveltekit/bookshop.config.js_
      site/
        cloudcannon.config.cjs from starters/sveltekit/cloudcannon.config.cjs_
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
    * a component-lib/components/single/single.bookshop.toml file containing:
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
    * a component-lib/components/single/single.svelte file containing:
      """
      <script>
      export let title;
      </script>

      <h1>{ title }</h1>
      """
    Given a site/src/routes/index.svelte file containing:
      """
      <script>
        import { BookshopBrowser } from "@bookshop/sveltekit-bookshop";
      </script>

      <BookshopBrowser />
      """

  @skip # NYI
  Scenario: Bookshop adds component browser markup
    When I run "npm start" in the site directory
    # Then stderr should be empty
    *    stdout should not be empty
    *    site/build/index.html should contain each row:
      | text                                                       |
      | <div data-bookshop-browser=""></div>                       |
      | <script src="http://localhost:30775/bookshop.js"></script> |

  @skip # NYI
  Scenario: Bookshop Generate hydrates component browser
    Given I run "npm start" in the site directory
    *     I run "cloudcannon-reader --output build" in the site directory
    When I run "npm start" in the . directory
    # Then stderr should be empty
    *    stdout should contain "Modifying output site at ./site/build"
    *    stdout should contain "Built component browser into 1 page"
    *    site/build/index.html should contain each row:
      | text                                                |
      | <script src="/_bookshop/bookshop-browser.min.js?cb= |

  @web @skip # NYI
  Scenario: Bookshop component browser initialises
    When 🌐 I load my site
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .tutorial should contain "Select a component using the"

  @web @skip # NYI
  Scenario: Bookshop component browser renders a component
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"
