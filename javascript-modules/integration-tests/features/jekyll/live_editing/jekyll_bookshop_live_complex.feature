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
    * a component-lib/components/tag/tag.jekyll.html file containing:
      """
      <span>{{ include.inner.text }}</span>
      """
    * a component-lib/shared/jekyll/span.jekyll.html file containing:
      """
      <span>{{ include.text }}</span>
      """

  Scenario: Bookshop live renders a subcomponent
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      <div> {% bookshop single title=include.contents.title %} </div>
      """
    Given [front_matter]:
      """
      layout: default
      contents:
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop outer contents=page.contents %}
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
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      <div> {% bookshop_include span text=include.contents.title %} </div>
      """
    Given [front_matter]:
      """
      layout: default
      contents:
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop outer contents=page.contents %}
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
    Given a component-lib/components/assigner/assigner.jekyll.html file containing:
      """
      {% assign test_var=include.component._bookshop_name %}
      {% assign title_var=include.component.title %}
      <div> {% bookshop {{test_var}} title=title_var %} </div>
      """
    Given [front_matter]:
      """
      layout: default
      component:
        _bookshop_name: single
        title: My title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop assigner component=page.component %}
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
      layout: default
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
      {% for t in page.titles %}
      {% bookshop single title=t %}
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
    Given a component-lib/components/range/range.jekyll.html file containing:
      """
      <div>
      {% for item in (include.min..include.max) %}
      {% bookshop single title=item %}
      {% endfor %}
      </div>
      """
    Given [front_matter]:
      """
      layout: default
      min: 0
      max: 1
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop range min=page.min max=page.max %}
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
    Given a component-lib/components/page/page.jekyll.html file containing:
      """
      <div class="page">
      {% for component in include.content_blocks %}
        {% bookshop {{component._bookshop_name}} bind=component %}
      {% endfor %}
      </div>
      """
    Given [front_matter]:
      """
      layout: default
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
      {% bookshop page content_blocks=page.components %}
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
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      <div> 
        {% 
          bookshop 
          single 
          title=include.contents.title
        %} 
      </div>
      """
    Given [front_matter]:
      """
      layout: default
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
        outer 
        contents=page.contents
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

  Scenario: Bookshop live renders a component without props
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      <div> {% bookshop inner %} </div>
      """
    Given a component-lib/components/inner/inner.jekyll.html file containing:
      """
      <h1>Hello :)</h1>
      """
    Given [front_matter]: "layout: default"
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop outer %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello :)"

  Scenario: Bookshop live renders a nested component path
    Given a component-lib/components/outer/outer.jekyll.html file containing:
      """
      <div> {% bookshop generic/button %} </div>
      """
    Given a component-lib/components/generic/button/button.jekyll.html file containing:
      """
      <button>Button!</button>
      """
    Given [front_matter]: "layout: default"
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop outer %}
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector button should contain "Button!"
