@jekyll @web
Feature: Jekyll Bookshop CloudCannon Live Editing Automatic Data Bindings

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile.cloudcannon
        Gemfile.lock from starters/jekyll/Gemfile.cloudcannon.lock
        _layouts/
          default.html from starters/jekyll/default.html
      """
    * a component-lib/components/title/title.jekyll.html file containing:
      """
      <h1>{{ include.innards }}</h1>
      """

  Scenario: Bookshop live renders a simple data binding
    Given [front_matter]:
      """
      layout: default
      hero: "Hello World"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop title innards=page.hero %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#hero\">Hello World</h1>"

  Scenario: Bookshop live renders a nested data binding
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      <div>{% bookshop title innards=include.title.item %}</div>
      """
    And [front_matter]:
      """
      layout: default
      items:
        item: "Hello There"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop outer title=page.items %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a nested loop data binding
    Given a component-lib/components/loop/loop.jekyll.html file containing:
      """
      <div>{% for row in include.rows %}{% bookshop title innards=row %}{% endfor %}</div>
      """
    And [front_matter]:
      """
      layout: default
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
      {% bookshop loop rows=page.rows %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows.0\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows.1\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows.2\">A third one.</h1>"

  Scenario: Bookshop live renders a data binding through an assign
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      {% assign v = include.title.item %}
      <div>{% bookshop title innards=v %}</div>
      """
    And [front_matter]:
      """
      layout: default
      items:
        item: "Hello There"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop outer title=page.items %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a parent data binding over a child
    Given a component-lib/components/loop/loop.jekyll.html file containing:
      """
      {% for row in include.rows %}{% bookshop title innards=row %}{% endfor %}
      """
    And [front_matter]:
      """
      layout: default
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
      {% bookshop loop rows=page.rows %}
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
      layout: default
      hero: "Hello World"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop title innards=page.hero dataBinding=false %}
      {% bookshop title innards=page.hero _dataBinding=false %}
      {% bookshop title innards=page.hero data_binding=false %}
      {% bookshop title innards=page.hero _data_binding=false %}
      {% bookshop title innards=page.hero editorLink=false %}
      {% bookshop title innards=page.hero _editorLink=false %}
      {% bookshop title innards=page.hero editor_link=false %}
      {% bookshop title innards=page.hero _editor_link=false %}
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
      layout: default
      hero: "Hello World"
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      <script>window.bookshopDataBindings = false;</script>
      {% bookshop title innards=page.hero %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1>Hello World</h1>"
