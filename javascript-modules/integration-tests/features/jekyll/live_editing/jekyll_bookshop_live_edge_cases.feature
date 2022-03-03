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