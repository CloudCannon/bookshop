@jekyll @web
Feature: Jekyll Bookshop CloudCannon Live Editing Error Boundaries

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
    * a component-lib/components/page/page.jekyll.html file containing:
      """
      <div class="page">
      {% for component in include.content_blocks %}
        {% bookshop {{component._bookshop_name}} bind=component %}
      {% endfor %}
      </div>
      """
    * a component-lib/components/good/good.jekyll.html file containing:
      """
      <h1>{{ include.text }}</h1>
      """
    * [front_matter]:
      """
      layout: default
      components:
        - _bookshop_name: good
          text: Hello World 01
      """
    * a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop page content_blocks=page.components %}
      """

  Scenario: Bookshop wraps component errors in an error boundary
    Given a component-lib/components/bad/bad.jekyll.html file containing:
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
    # Note: No `bad.jekyll.html` component has been created.
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