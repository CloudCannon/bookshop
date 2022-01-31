@jekyll @web
Feature: Jekyll Bookshop CloudCannon Live Editing Selective Re-rendering

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
    * a component-lib/components/single/single.jekyll.html file containing:
      """
      <h1>{{ include.title }}</h1>
      """
    * a component-lib/components/multiple/multiple.jekyll.html file containing:
      """
      <div>
      {% for item in include.items %}
      {% bookshop single bind=item %}
      {% endfor %}
      </div>
      """
    * a component-lib/components/uppermost/uppermost.jekyll.html file containing:
      """
      <div>
      {% bookshop multiple bind=include.one %}
      <span>{{ include.two }}</span>
      {% bookshop single title=include.three %}
      </div>
      """

  Scenario: Bookshop selectively live renders a loop
    Given [front_matter]:
      """
      layout: default
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
      {% bookshop multiple items=page.items %}
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
      layout: default
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
      {% bookshop uppermost bind=page.data %}
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
