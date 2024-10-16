@sveltekit
Feature: Basic SvelteKit Bookshop
  As a user of SvelteKit with Bookshop
  I want to be able to use components
  So that I can build my site

  Background:
    Given the file tree:
      """
      component-lib/
        package.json from starters/sveltekit/package.json # <-- this .json line hurts my syntax highlighting
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
          routes/
            +layout.server.js from starters/sveltekit/src/routes/+layout.server.js_
            +layout.svelte from starters/sveltekit/src/routes/+layout.svelte
            +page.server.js from starters/sveltekit/src/routes/+page.server.js_
            +page.svelte from starters/sveltekit/src/routes/+page.svelte
      """
    Given I run "npm i" in the component-lib directory

  Scenario: Tests are functional
    Given a site/content/pages/index.md file containing:
      """
      ---
      ---
      # Hello World!
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Hello World!"

  Scenario: Components are rendered from bookshop
    Given a component-lib/components/title/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Bookshop: { text }</h1>
      """
    And a site/src/routes/+page.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";
      </script>

      <div>
        <Bookshop component="title" text="Result 🫥" />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Bookshop: Result 🫥"

  Scenario: Nested components are rendered from bookshop
    Given a component-lib/components/nested/title/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Bookshop: { text }</h1>
      """
    And a site/src/routes/+page.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";
      </script>

      <div>
        <Bookshop component="nested/title" text="Result 🫥" />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Bookshop: Result 🫥"

  Scenario: Flat root components are rendered from bookshop
    Given a component-lib/components/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Bookshop: { text }</h1>
      """
    And a site/src/routes/+page.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";
      </script>

      <div>
        <Bookshop component="title" text="Result 🫥" />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Bookshop: Result 🫥"

  Scenario: Nested flat components are rendered from bookshop
    Given a component-lib/components/nested/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Bookshop: { text }</h1>
      """
    And a site/src/routes/+page.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";
      </script>

      <div>
        <Bookshop component="nested/title" text="Result 🫥" />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Bookshop: Result 🫥"

  Scenario: Standard components take precendence over flat components
    Given a component-lib/components/nested/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Flat: { text }</h1>
      """
    Given a component-lib/components/nested/title/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Standard: { text }</h1>
      """
    And a site/src/routes/+page.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";
      </script>

      <div>
        <Bookshop component="nested/title" text="Result 🫥" />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Standard: Result 🫥"

  Scenario: Components can use the page front matter
    Given a component-lib/components/title/title.svelte file containing:
      """
      <script>
        export let text;
      </script>

      <h1>Bookshop: { text }</h1>
      """
    And a site/content/pages/index.md file containing:
      """
      ---
      title_text: "Result ❤️‍🔥"
      ---
      """
    And a site/src/routes/+page.svelte file containing:
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
                (newProps) => (pageDetails = trackBookshopLiveData(newProps))
            );
        });

        onDestroy(async () => {
            stopCloudCannonChanges();
        });
      </script>

      <div>
        <Bookshop component="title" text={pageDetails.title_text} />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "Bookshop: Result ❤️‍🔥"

  Scenario: Components can use further components
    Given a component-lib/components/hero/hero.svelte file containing:
      """
      <script>
        import { Bookshop } from "@bookshop/sveltekit-bookshop";

        export let text;
        export let herotag;
      </script>

      <h1>{ text }</h1>
      <Bookshop component="tag" tagprop={herotag} />
      """
    And a component-lib/components/tag/tag.svelte file containing:
      """
      <script>
        export let tagprop;
      </script>

      <span>{ tagprop.label }</span>
      """
    And a site/content/pages/index.md file containing:
      """
      ---
      title_text: "🪬"
      hero:
        tag:
          label: "🪤"
      ---
      """
    And a site/src/routes/+page.svelte file containing:
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
                (newProps) => (pageDetails = trackBookshopLiveData(newProps))
            );
        });

        onDestroy(async () => {
            stopCloudCannonChanges();
        });
      </script>

      <div>
        <Bookshop component="hero"
          text={pageDetails.title_text}
          herotag={pageDetails.hero.tag} />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "<h1>🪬</h1>"
    And site/build/index.html should contain the text "<span>🪤</span>"

  Scenario: Bookshop tags can use the bind syntax
    Given a component-lib/components/card/card.svelte file containing:
      """
      <script>
        export let title;
        export let description;
      </script>

      <h1>{ title }</h1>
      <p>{ description }</p>
      """
    And a site/content/pages/index.md file containing:
      """
      ---
      card:
        title: "🛣"
        description: "🕋"
      ---
      """
    And a site/src/routes/+page.svelte file containing:
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
                (newProps) => (pageDetails = trackBookshopLiveData(newProps))
            );
        });

        onDestroy(async () => {
            stopCloudCannonChanges();
        });
      </script>

      <div>
        <Bookshop component="card" {...pageDetails.card} />
      </div>
      """
    When I run "npm start" in the site directory
    # Then stderr should be empty
    And stdout should contain "Wrote site to"
    And site/build/index.html should contain the text "<h1>🛣</h1>"
    And site/build/index.html should contain the text "<p>🕋</p>"

  @skip # A given
  Scenario: Bookshop tags should support dynamic names

  @skip # TODO: Worth a test
  Scenario: Bookshop page building components should work

