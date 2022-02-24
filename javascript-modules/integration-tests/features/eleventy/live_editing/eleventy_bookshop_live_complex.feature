@eleventy @web
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
    * a component-lib/components/tag/tag.eleventy.liquid file containing:
      """
      <span>{{ inner.text }}</span>
      """
    * a component-lib/shared/eleventy/span.eleventy.liquid file containing:
      """
      <span>{{ text }}</span>
      """

  Scenario: Bookshop live renders a subcomponent
    Given a component-lib/components/outer/outer.eleventy.liquid file containing:
      """
      <div> {% bookshop "single" title: contents.title %} </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      contents:
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "outer" contents: contents %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: Your title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Your title"
  
  Scenario: Bookshop live renders a subinclude
    Given a component-lib/components/outer/outer.eleventy.liquid file containing:
      """
      <div> {% bookshop_include "span" text: contents.title %} </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      contents:
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "outer" contents: contents %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: The title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector span should contain "The title"


  Scenario: Bookshop live renders through an assign
    Given a component-lib/components/assigner/assigner.eleventy.liquid file containing:
      """
      {% assign test_var=component._bookshop_name %}
      {% assign title_var=component.title %}
      <div> {% bookshop '{{test_var}}' title: title_var %} </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      component:
        _bookshop_name: single
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "assigner" component: component %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      component:
        _bookshop_name: single
        title: Live Love Laugh
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Live Love Laugh"

  Scenario: Bookshop live renders a top level loop
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      titles:
        - "First"
        - "Second"
        - "Third"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% for t in titles %}
      {% bookshop "single" title: t %}
      {% endfor %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      titles:
        - "First"
        - "New!"
        - "Third"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(2) should contain "New!"

  Scenario: Bookshop live renders a range loop
    Given a component-lib/components/range/range.eleventy.liquid file containing:
      """
      <div>
      {% for item in (min..max) %}
      {% bookshop "single" title: item %}
      {% endfor %}
      </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      min: 0
      max: 1
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "range" min: min max: max %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      min: 1
      max: 5
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(5) should contain "5"

  Scenario: Bookshop live renders a dynamic loop
    Given a component-lib/components/page/page.eleventy.liquid file containing:
      """
      <div class="page">
      {% for component in content_blocks %}
        {% bookshop '{{component._bookshop_name}}' bind: component %}
      {% endfor %}
      </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      components:
        - _bookshop_name: single
          title: Block One
        - _bookshop_name: tag
          inner:
            text: Block Two
        - _bookshop_name: single
          title: Block Three
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "page" content_blocks: components %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: single
          title: Block One
        - _bookshop_name: tag
          inner:
            text: New Tag
        - _bookshop_name: single
          title: Block Three
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector span should contain "New Tag"
    *    🌐 The selector .page>*:nth-child(3) should contain "Block Three"

  Scenario: Bookshop live renders a multiline component tag
    Given a component-lib/components/outer/outer.eleventy.liquid file containing:
      """
      <div> 
        {% 
          bookshop 
          "single" 
          title:
          contents.title
        %}
      </div>
      """
    Given [front_matter]:
      """
      layout: layouts/default.liquid
      contents:
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% 
        bookshop 
        "outer" 
        contents:
        contents 
      %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: Your title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Your title"