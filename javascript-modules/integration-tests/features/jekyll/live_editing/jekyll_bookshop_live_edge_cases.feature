@jekyll @web @bespoke
Feature: Jekyll Bookshop CloudCannon Live Editing Edge Cases

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

  Scenario: Bookshop live renders blank markdown
    Given a component-lib/components/md/md.jekyll.html file containing:
      """
      <div> md - {{ include.md | markdownify }} - md </div>
      """
    Given [front_matter]:
      """
      layout: default
      md: Hello
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop md md=page.md %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      md:
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector div should contain "md - - md"


  Scenario: Bookshop live collection loop
    Given a site/_config.yml file containing:
      """
      bookshop_locations:
        - ../component-lib

      include:
        - _cloudcannon

      plugins:
        - jekyll-bookshop

      collections:
        collection1:
          name: C1
        collection2:
          name: C2
      """
    Given a component-lib/components/test/test.jekyll.html file containing:
      """
      {% for item in include.page_links %}
        {% assign collections = site.collection1 
          | concat: site.collection2 %}
        {% assign linked_page = false %}
        {% for doc in collections %}
          {% if doc.url == item.link %}
            {% assign linked_page = doc %}
            {% break %}
          {% endif %}
        {% endfor %}

        <p>{{ linked_page }}</p>
        <h1>{{linked_page.page_image_path}}</h1>
      {% endfor %}
      """
    Given [front_matter]:
      """
      layout: default
      page_links:
        - link: /banana
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop test page_links=page.page_links %}
      """
    And a site/_collection1/banana.html file containing:
      """
      ---
      permalink: /banana
      page_image_path: BANANA PATH
      ---
      <h1>Hello!</h1>
      """
    And a site/_collection2/apple.html file containing:
      """
      ---
      permalink: /apple
      page_image_path: APPLE PATH
      ---
      <h1>Hello!</h1>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      page_links:
        - link: /banana
        - link: /apple
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(1) should contain "BANANA PATH"
    *    🌐 The selector h1:nth-of-type(2) should contain "APPLE PATH"