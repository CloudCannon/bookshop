@eleventy
Feature: Eleventy Bookshop Includes
  As a user of Eleventy with Bookshop
  I want includes scoped to the bookshop
  So that I can use them on the site or in components

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

  Scenario: Basic Bookshop Include
    Given a component-lib/shared/eleventy/basic.eleventy.liquid file containing:
      """
      {{label}}🎉
      """
    Given a component-lib/components/block/block.eleventy.liquid file containing:
      """
      <div>{% bookshop_include "basic" label: title %}-Block</div>
      """
    And a site/index.html file containing:
      """
      ---
      ---
      {% bookshop "block" title: "Component" %}
      <span>{% bookshop_include "basic" label: "Site" %}-Inline</span>
      """
    When I run "npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v3.0.0"
    And site/_site/index.html should leniently contain each row:
      | text                                        |
      | Component🎉 <!--bookshop-live end--> -Block |
      | Site🎉 <!--bookshop-live end--> -Inline     |
