@eleventy @web
Feature: Eleventy Bookshop CloudCannon Live Editing Error Boundaries

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.cloudcannon.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json # <-- this .json line hurts my syntax highlighting
        _includes/
          layouts/
            default.liquid from starters/eleventy/default.liquid
      """
    * a component-lib/components/page/page.eleventy.liquid file containing:
      """
      <div class="page">
      {% for component in content_blocks %}
        {% bookshop '{{component._bookshop_name}}' bind: component %}
      {% endfor %}
      </div>
      """
    * a component-lib/components/good/good.eleventy.liquid file containing:
      """
      <h1>{{ text }}</h1>
      """
    * [front_matter]:
      """
      layout: layouts/default.liquid
      components:
        - _bookshop_name: good
          text: Hello World 01
      """
    * a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "page" content_blocks: components %}
      """

  Scenario: Bookshop wraps component errors in an error boundary
    Given a component-lib/components/bad/bad.eleventy.liquid file containing:
      """
      <h1>{% mystery_tag %}</h1>
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: good
          text: Hello World 01
        - _bookshop_name: bad
        - _bookshop_name: good
          text: Hello World 02
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .page>div should contain "Failed to render"
    *    🌐 The selector .page>div should contain "mystery_tag"
    *    🌐 The selector h1:nth-of-type(1) should contain "Hello World 01"
    *    🌐 The selector h1:nth-of-type(2) should contain "Hello World 02"

  Scenario: Bookshop replaces non-existent components in an error boundary
    # Note: No `bad.eleventy.liquid` component has been created.
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: good
          text: Hello World 01
        - _bookshop_name: bad
        - _bookshop_name: good
          text: Hello World 02
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .page>div should contain "Failed to find"
    *    🌐 The selector h1:nth-of-type(2) should contain "Hello World 02"