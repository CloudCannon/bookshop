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
      """

  Scenario: Bookshop live renders string arguments
    Given a component-lib/components/map/map.eleventy.liquid file containing:
      """
      <div class="map">
        <iframe src="#{{ url }}"></iframe>
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
    *    🌐 The selector iframe should match "<iframe src=\"#test\"></iframe>"

  Scenario: Bookshop live renders filters with attributes
    Given a component-lib/components/where/where.eleventy.liquid file containing:
      """
      <div>
      {% assign featured = featured_items | where: "featured", true %}
      {% for item in featured %}
      <p>{{ item.name }}</p>
      {% endfor %}
      </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      featured_items:
        - name: "Item One"
          featured: true
        - name: "Item Two"
          featured: false
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "where" featured_items: featured_items %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      featured_items:
        - name: "Item One"
          featured: true
        - name: "Item Two"
          featured: false
        - name: "Item Three"
          featured: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector p:nth-of-type(1) should contain "Item One"
    *    🌐 The selector p:nth-of-type(2) should contain "Item Three"