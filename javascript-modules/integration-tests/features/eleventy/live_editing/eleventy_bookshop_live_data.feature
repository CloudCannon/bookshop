@eleventy @web
Feature: Eleventy Bookshop CloudCannon Live Editing Site Data

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
      """
    * [front_matter]:
      """
      layout: layouts/default.liquid
      show: false
      """
    * a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "block" show: show %}
      """

  Scenario: Bookshop live renders website data
    Given a site/cloudcannon.config.yml file containing:
      """
      data_config:
        cat: true
      """
    Given a site/_data/cat.json file containing:
      """
      {
        "name": "Cheeka"
      }
      """
    * a component-lib/components/block/block.eleventy.liquid file containing:
      """
      <h1>{% if show %}{{ cat.name }}{% endif %}</h1>
      """
    * 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      show: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Cheeka"

  Scenario: Bookshop live renders special website config
    Given a site/.eleventy.js file containing:
      """
      const pluginBookshop = require("@bookshop/eleventy-bookshop");
      const pluginCloudCannon = require('eleventy-plugin-cloudcannon');

      module.exports = function (eleventyConfig) {
        eleventyConfig.setUseGitIgnore(false);
        eleventyConfig.setDataDeepMerge(true);

        eleventyConfig.addPlugin(pluginBookshop({
          bookshopLocations: ["../component-lib"],
          pathPrefix: "/documentation/"
        }));

        eleventyConfig.cloudcannonOptions = {
          dir: {
            pages: 'pages'
          }
        };

        eleventyConfig.addPlugin(pluginCloudCannon);

        return {
          pathPrefix: "/documentation/"
        }
      };
      """
    Given a component-lib/components/block/block.eleventy.liquid file containing:
      """
      {% if show %}
      <h1>{{ "/page/" | url }}</h1>
      {% endif %}
      """
    * 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      show: true
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "/documentation/page/"
