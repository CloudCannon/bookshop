@jekyll @web
Feature: Jekyll Bookshop CloudCannon Starter Template Live Editing

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
    Given a component-lib/shared/jekyll/page.jekyll.html file containing:
      """
      {% for block in include.content_blocks %}
        {% bookshop {{block._bookshop_name}} bind=block %}
      {% endfor %}
      """
    * a component-lib/components/tag/tag.jekyll.html file containing:
      """
      <span class="u-tag">{{ include.text }}</span>
      """
    * a component-lib/components/content/content.jekyll.html file containing:
      """
      <div class="c-content c-content--{{ include.type }}">
        {% if include.type == "note" %}{% bookshop tag text="Note" %}{% endif %}
        {{ include.content_html }}
      </div>
      """
    * a component-lib/components/hero/hero.jekyll.html file containing:
      """
      <div class="c-title">
        {% for tag in include.tags %}
          {% bookshop tag bind=tag %}
        {% endfor %}
        <h1 class="c-title__title">
          {{ include.title }}
        </h1>
        {% if include.content_html %}
          {% bookshop content content_html=include.content_html %}
        {% endif %}
      </div>
      """
    * [front_matter]:
      """
      layout: default
      content_blocks:
        - _bookshop_name: hero
          title: Bookshop Hugo Starter
          content_html: >-
            <p>A skeleton for getting started with your component journey using Bookshop and Hugo.</p>
          tags:
            - text: "bookshop"
            - text: "hugo"
        - _bookshop_name: content
          content_html: >-
            <p>For more info, check out the <a href="https://github.com/CloudCannon/hugo-bookshop-starter#readme" target="_blank">readme</a></p>
          type: standard
      note_html: >-
        <p>You can also use the bookshop tag directly.</p>
      """
    * a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      <main>
        {% bookshop_include page content_blocks=page.content_blocks %}
      </main>
      {% bookshop content content_html=page.note_html type='note' %}
      """

  Scenario: Bookshop live renders updates to the starter template
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      content_blocks:
        - _bookshop_name: hero
          title: Bookshop Hugo Starter
          content_html: >-
            <p>A skeleton for getting started with your component journey using Bookshop and Hugo.</p>
          tags:
            - text: "bookshop"
            - text: "hugo"
            - text: "starter"
        - _bookshop_name: content
          content_html: >-
            <p>For more info, check out the <a href="https://github.com/CloudCannon/hugo-bookshop-starter#readme" target="_blank">readme</a></p>
          type: standard
      note_html: >-
        <p>You can also use the bookshop tag directly.</p>
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .u-tag:nth-of-type(3) should contain "starter"

  Scenario: Bookshop live renders starter template data bindings
    Given 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .c-content--note should match "data-cms-bind=\"#note_html\""
    *    🌐 The selector .c-title should match "data-cms-bind=\"#content_blocks.0\""
    *    🌐 The selector .u-tag:nth-of-type(2) should match "data-cms-bind=\"#content_blocks.0.tags.1\""