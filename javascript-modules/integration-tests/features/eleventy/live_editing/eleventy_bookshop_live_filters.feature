@eleventy @web
Feature: Eleventy Bookshop CloudCannon Live Editing Filters and Functions

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

  @skip # NYI
  Scenario: Bookshop live renders markdown
    # What is the idiomatic way to render markdown in eleventy?
    Given a component-lib/components/beetroot/beetroot.eleventy.liquid file containing:
      """
      <div><code> {{ md | markdownify }} </code></div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      md: title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "beetroot" md: md %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      md: "**bold** title"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector code should match "<p><strong>bold</strong> title</p>"
  