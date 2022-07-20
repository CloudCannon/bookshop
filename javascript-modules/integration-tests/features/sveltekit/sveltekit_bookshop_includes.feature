@sveltekit
Feature: SvelteKit Bookshop Includes
  As a user of SvelteKit with Bookshop
  I want includes scoped to the bookshop
  So that I can use them on the site or in components

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

  Scenario: Basic Bookshop Include
    Given a component-lib/shared/svelte/basic.svelte file containing:
      """
      <script>
        export let label;
      </script>

      {label}🎉
      """
    Given a component-lib/components/block/block.svelte file containing:
      """
      <script>
        export let Bookshop;
        export let title;
      </script>

      <div><Bookshop shared="basic" label={title} />-Block</div>
      """
    And a site/src/routes/index.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";

        export let pageDetails;
      </script>

      <Bookshop component="block" title="Component" />
      <span><Bookshop shared="basic" label="Site" />-Inline</span>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should leniently contain each row:
      | text               |
      | Component🎉 -Block |
      | Site🎉 -Inline     |
