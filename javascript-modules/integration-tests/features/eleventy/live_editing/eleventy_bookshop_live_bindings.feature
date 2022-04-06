@eleventy @web
Feature: Eleventy Bookshop CloudCannon Live Editing Automatic Data Bindings

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
    * a component-lib/components/title/title.eleventy.liquid file containing:
      """
      <h1>{{ innards }}</h1>
      """

  Scenario: Bookshop live renders a simple data binding
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
      {% bookshop "title" innards: hero %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#hero\">Hello World</h1>"

  Scenario: Bookshop live renders a nested data binding
    Given a component-lib/components/outer/outer.eleventy.liquid file containing:
      """
      <div>{% bookshop "title" innards: title.item %}</div>
      """
    And [front_matter]:
      """
      layout: layouts/default.liquid
      items:
        item: "Hello There"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "outer" title: items %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a nested loop data binding
    Given a component-lib/components/loop/loop.eleventy.liquid file containing:
      """
      <div>{% for row in rows %}{% bookshop "title" innards: row %}{% endfor %}</div>
      """
    And [front_matter]:
      """
      layout: layouts/default.liquid
      rows:
        - "Hello There"
        - "Goodbye You"
        - "A third one."
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "loop" rows: rows %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows.0\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows.1\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows.2\">A third one.</h1>"

  Scenario: Bookshop live renders a data binding through an assign
    Given a component-lib/components/outer/outer.eleventy.liquid file containing:
      """
      {% assign v = title.item %}
      <div>{% bookshop "title" innards: v %}</div>
      """
    And [front_matter]:
      """
      layout: layouts/default.liquid
      items:
        item: "Hello There"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "outer" title: items %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a parent data binding over a child
    Given a component-lib/components/loop/loop.eleventy.liquid file containing:
      """
      {% for row in rows %}{% bookshop "title" innards: row %}{% endfor %}
      """
    And [front_matter]:
      """
      layout: layouts/default.liquid
      rows:
        - "Hello There"
        - "Goodbye You"
        - "A third one."
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "loop" rows: rows %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows\">A third one.</h1>"

  Scenario: Bookshop live respects the per-component dataBinding flag
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
      {% bookshop "title" innards: hero dataBinding: false %}
      {% bookshop "title" innards: hero _dataBinding: false %}
      {% bookshop "title" innards: hero data_binding: false %}
      {% bookshop "title" innards: hero _data_binding: false %}
      {% bookshop "title" innards: hero editorLink: false %}
      {% bookshop "title" innards: hero _editorLink: false %}
      {% bookshop "title" innards: hero editor_link: false %}
      {% bookshop "title" innards: hero _editor_link: false %}
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
