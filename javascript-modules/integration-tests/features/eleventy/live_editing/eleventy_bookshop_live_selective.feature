@eleventy
Feature: Eleventy Bookshop CloudCannon Live Editing Selective Re-rendering

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
    * a component-lib/components/single/single.eleventy.liquid file containing:
      """
      <h1>{{ title }}</h1>
      """
    * a component-lib/components/multiple/multiple.eleventy.liquid file containing:
      """
      <div>
      {% for item in items %}
      {% bookshop "single" bind: item %}
      {% endfor %}
      </div>
      """
    * a component-lib/components/uppermost/uppermost.eleventy.liquid file containing:
      """
      <div>
      {% bookshop "multiple" bind: one %}
      <span>{{ two }}</span>
      {% bookshop "single" title: three %}
      </div>
      """

  Scenario: Bookshop selectively live renders a loop
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      items:
        - title: "One"
        - title: "Two"
        - title: "Three"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "multiple" items: items %}
      """
    And 🌐 I have loaded my site in CloudCannon
    And 🌐 I have added a click listener to h1:nth-of-type(2)
    When 🌐 CloudCannon pushes new yaml:
      """
      items:
        - title: "A"
        - title: "Two"
        - title: "C"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(1) should contain "A"
    *    🌐 The selector h1:nth-of-type(3) should contain "C"
    *    🌐 There should be a click listener on h1:nth-of-type(2)

  Scenario: Bookshop live renders components depth first
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      data:
        one: 
          items:
            - title: "I"
            - title: "II"
            - title: "III"
        two: "two"
        three: "three"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "uppermost" bind: data %}
      """
    Given 🌐 I have loaded my site in CloudCannon
    And  🌐 I have added a click listener to span
    When 🌐 CloudCannon pushes new yaml:
      """
      data:
        one: 
          items:
            - title: "I"
            - title: "II"
            - title: "III"
            - title: "IV"
        two: "two"
        three: "tres"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(4) should contain "IV"
    *    🌐 There should be a click listener on span
