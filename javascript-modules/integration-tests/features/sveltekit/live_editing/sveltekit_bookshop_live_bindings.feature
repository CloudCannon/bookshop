@sveltekit @web
Feature: SvelteKit Bookshop CloudCannon Live Editing Automatic Data Bindings

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
    Given a component-lib/components/title/title.svelte file containing:
      """
      <script>
      export let innards;
      </script>

      <h1>{ innards }</h1>
      """
    Given [boilerplate]:
      """
      <script context="module">
        import { loadPage } from "$lib/routing.js";

        export async function load({ fetch }) {
          return await loadPage("/index.json", { fetch });
        }
      </script>

      <script>
        import { onMount } from "svelte";
        import { onCloudCannonChanges } from "@cloudcannon/svelte-connector";
        import { Bookshop, trackBookshopLiveData } from "@bookshop/sveltekit-bookshop";

        export let pageDetails;

        onMount(async () => {
          onCloudCannonChanges((newProps) => {
            pageDetails = trackBookshopLiveData(newProps);
            // Set some flags that our tests look for — not needed in real usage.
            window.bookshopLive = window.bookshopLive || { renderCount: 0 };
            window.bookshopLive.renderCount++;
          });
        });
      </script>
      """

  Scenario: Bookshop live renders a simple data binding
    Given [front_matter]:
      """
      hero:
        _bookshop_name: "TODO: Can only track primitives via _bookshop_name"
        innards: "Hello World"
      """
    And a site/content/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/src/routes/index.svelte file containing:
      """
      [boilerplate]

      <Bookshop component="title" {...pageDetails.hero} />
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#hero\">Hello World</h1>"

  @skip # TODO: Needs matching test
  Scenario: Bookshop live renders a nested data binding

  @skip # TODO: Needs matching test
  Scenario: Bookshop live renders a nested loop data binding

  @skip # TODO: Needs matching test
  Scenario: Bookshop live renders a data binding through an assign

  @skip # TODO: Needs matching test
  Scenario: Bookshop live renders a parent data binding over a child

  Scenario: Bookshop live respects the per-component dataBinding flag
    Given [front_matter]:
      """
      hero:
        _bookshop_name: "TODO: Can only track primitives via _bookshop_name"
        innards: "Hello World"
      """
    And a site/content/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/src/routes/index.svelte file containing:
      """
      [boilerplate]

      <Bookshop component="title" {...pageDetails.hero} dataBinding=false />
      <Bookshop component="title" {...pageDetails.hero} _dataBinding=false />
      <Bookshop component="title" {...pageDetails.hero} data_binding=false />
      <Bookshop component="title" {...pageDetails.hero} _data_binding=false />
      <Bookshop component="title" {...pageDetails.hero} editorLink=false />
      <Bookshop component="title" {...pageDetails.hero} _editorLink=false />
      <Bookshop component="title" {...pageDetails.hero} editor_link=false />
      <Bookshop component="title" {...pageDetails.hero} _editor_link=false />
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(4) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(5) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(6) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(7) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(8) should match "<h1>Hello World</h1>"

  Scenario: Bookshop live respects the global dataBindings flag
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      hero: "Hello World"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      <script>window.bookshopDataBindings = false;</script>
      {% bookshop "title" innards: hero %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1>Hello World</h1>"
