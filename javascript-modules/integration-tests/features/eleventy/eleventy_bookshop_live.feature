@eleventy
Feature: Eleventy Bookshop CloudCannon Integration
  As a user of Eleventy with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Bookshop Live schema comments
    Given a site/.eleventy.js file containing:
      """
      const pluginBookshop = require("@bookshop/eleventy-bookshop");

      module.exports = function (eleventyConfig) {
        eleventyConfig.addPlugin(pluginBookshop({
          bookshopLocations: ["../component-lib"],
          pathPrefix: "/documentation/"
        }));

        return {
          pathPrefix: "/documentation/"
        }
      };
      """
    Given a component-lib/components/page/page.eleventy.liquid file containing:
      """
      {% for block in content_blocks %}
      {% assign b = block %}
      <p>{{ b._bookshop_name }}</p>
      {% bookshop "single" _bookshop_name: "inner" %}
      {% endfor %}
      """
    Given a component-lib/components/single/single.eleventy.liquid file containing:
      """
      <span>{{ _bookshop_name }}</span>
      """
    And a site/index.html file containing:
      """
      ---
      content_blocks:
        - _bookshop_name: fake
      ---
      {% bookshop "page" content_blocks: content_blocks %}
      {% for block in content_blocks %}
      {% bookshop "single" bind: block %}
      {% endfor %}
      """
    When I run "npm start" in the site directory
    Then stderr should be empty
    And stdout should not be empty
    And site/_site/index.html should contain the text: 
      """
      <!--bookshop-live meta(pathPrefix: "/documentation/") -->
      <!--bookshop-live name(page) params(content_blocks: content_blocks) context() -->

      <p>fake</p>
      <!--bookshop-live name(single) params(_bookshop_name: "inner") context(block: content_blocks[0]) --><span>inner</span><!--bookshop-live end-->
      <!--bookshop-live end-->
      
      <!--bookshop-live meta(pathPrefix: "/documentation/") -->
      <!--bookshop-live name(single) params(bind: block) context(block: content_blocks[0]) --><span>fake</span><!--bookshop-live end-->
      """
