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
          routes/
            +layout.server.js from starters/sveltekit/src/routes/+layout.server.js_
            +layout.svelte from starters/sveltekit/src/routes/+layout.svelte
            +page.server.js from starters/sveltekit/src/routes/+page.server.js_
            +page.svelte from starters/sveltekit/src/routes/+page.svelte
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
      <script>
        import { onDestroy, onMount } from "svelte";
        import {
            onCloudCannonChanges,
            stopCloudCannonChanges,
        } from "@cloudcannon/svelte-connector";
        import {
            Bookshop,
            trackBookshopLiveData,
        } from "@bookshop/sveltekit-bookshop";

        export let data;
        let pageDetails = data.data;

        onMount(async () => {
            onCloudCannonChanges(
                (newProps) => {
                  pageDetails = trackBookshopLiveData(newProps);
                  // Set some flags that our tests look for — not needed in real usage.
                  window.bookshopLive = window.bookshopLive || { renderCount: 0 };
                  setTimeout(() => { window.bookshopLive.renderCount++; }, 100);
                }
            );
        });

        onDestroy(async () => {
            stopCloudCannonChanges();
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
    And a site/src/routes/+page.svelte file containing:
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
    And a site/src/routes/+page.svelte file containing:
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

  @skip # N/A — omit the trackBookshopData function to achieve this
  Scenario: Bookshop live respects the global dataBindings flag
