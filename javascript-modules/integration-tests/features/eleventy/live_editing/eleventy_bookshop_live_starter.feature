@eleventy @web
Feature: Eleventy Bookshop CloudCannon Starter Template Live Editing

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
    Given a component-lib/shared/eleventy/page.eleventy.liquid file containing:
      """
      {% for block in content_blocks %}
        {% bookshop "{{block._bookshop_name}}" bind: block %}
      {% endfor %}
      """
    * a component-lib/components/tag/tag.eleventy.liquid file containing:
      """
      <span class="u-tag">{{ text }}</span>
      """
    * a component-lib/components/content/content.eleventy.liquid file containing:
      """
      <div class="c-content c-content--{{ type }}">
        {% if type == "note" %}{% bookshop "tag" text: "Note" %}{% endif %}
        {{ content_html }}
      </div>
      """
    * a component-lib/components/hero/hero.eleventy.liquid file containing:
      """
      <div class="c-title">
        {% for tag in tags %}
          {% bookshop "tag" bind: tag %}
        {% endfor %}
        <h1 class="c-title__title">
          {{ title }}
        </h1>
        {% if content_html %}
          {% bookshop "content" content_html: content_html %}
        {% endif %}
      </div>
      """
    * [front_matter]:
      """
      layout: layouts/default.liquid
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
        {% bookshop_include "page" content_blocks: content_blocks %}
      </main>
      {% bookshop "content" content_html: note_html type: 'note' %}
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