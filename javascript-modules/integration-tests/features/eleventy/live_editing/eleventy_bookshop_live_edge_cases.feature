@eleventy @web @bespoke
Feature: Eleventy Bookshop CloudCannon Live Editing Edge Cases

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
        cloudcannon/
          info.11tydata.js from ../../node_modules/eleventy-plugin-cloudcannon/cloudcannon/info.11tydata.js
          info.njk from ../../node_modules/eleventy-plugin-cloudcannon/cloudcannon/info.njk
          inject-cloudcannon.config.js from ../../node_modules/eleventy-plugin-cloudcannon/cloudcannon/inject-cloudcannon.config.js
      """

  Scenario: Bookshop live renders string arguments
    Given a component-lib/components/map/map.eleventy.liquid file containing:
      """
      <div class="map">
        <iframe src="{{ url }}"></iframe>
      </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "map" url: "test" %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      """
    *    🌐 There should be no logs
    Then 🌐 There should be no errors
    *    🌐 The selector iframe should match "<iframe src=\"test\"></iframe>"