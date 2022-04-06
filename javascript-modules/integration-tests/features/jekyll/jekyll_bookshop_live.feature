@jekyll
Feature: Jekyll Bookshop CloudCannon Integration
  As a user of Jekyll with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile
        Gemfile.lock from starters/jekyll/Gemfile.lock
      """

  # All components should get component schema comments
  # Only outer-most components should get meta comments
  Scenario: Bookshop Live schema comments
    Given a site/_config.yml file containing:
      """
      title: "My Site"
      baseurl: "/documentation"

      bookshop_locations:
        - ../component-lib

      plugins:
        - jekyll-bookshop
      """
    Given a component-lib/components/page/page.jekyll.html file containing:
      """
      {%- for block in include.content_blocks -%}
      {%- assign b = block -%}
      <p>{{ b._bookshop_name }}</p>
      {% bookshop single _bookshop_name="inner" %}
      {%- endfor -%}
      """
    Given a component-lib/components/single/single.jekyll.html file containing:
      """
      <span>{{ include._bookshop_name }}</span>
      """
    And a site/index.html file containing:
      """
      ---
      content_blocks:
        - _bookshop_name: fake
      ---
      {%- bookshop page content_blocks=page.content_blocks -%}
      {% for block in page.content_blocks -%}
      {% bookshop single bind=block -%}
      {%- endfor -%}
      """
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text: 
      """
      <!--bookshop-live meta(version="[version]" baseurl="/documentation" title="My Site") -->
      <!--bookshop-live name(page/page.jekyll.html) params(content_blocks=page.content_blocks) context() -->
      <p>fake</p>
      <!--bookshop-live name(single/single.jekyll.html) params(_bookshop_name="inner") context(block=content_blocks[0]) -->
      <span>inner</span>
      <!--bookshop-live end-->
      <!--bookshop-live end--><!--bookshop-live meta(version="[version]" baseurl="/documentation" title="My Site") -->
      <!--bookshop-live name(single/single.jekyll.html) params(bind=block) context(block=page.content_blocks[0]) -->
      <span>fake</span>
      <!--bookshop-live end-->
      """