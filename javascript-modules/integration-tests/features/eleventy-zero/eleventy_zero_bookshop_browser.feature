@eleventy0
Feature: Eleventy Bookshop Component Browser
  As a user of Eleventy with Bookshop
  I want my component browser to be preconfigured to my bookshop
  So that I can view components while developing

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/eleventy-zero-package.json # <-- this .json line hurts my syntax highlighting
      """
