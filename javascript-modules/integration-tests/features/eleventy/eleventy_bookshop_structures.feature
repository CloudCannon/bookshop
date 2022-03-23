@eleventy
Feature: Eleventy Bookshop CloudCannon Integration
  As a user of Eleventy with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

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
      """
    And a site/index.html file containing:
      """
      ---
      ---
      <h1>Hello World</h1>
      """
    And a site/_data/cloudcannon.json file containing:
      """
      {
        "timezone": "BEBOP"
      }
      """

  Scenario: Basic Array Structure
    Given a component-lib/components/card/card.bookshop.toml file containing:
      """
      [component]
      structures = [ "content_blocks" ]
      label = "Card"
      description = "Card component"
      icon = "nature_people"
      tags = ["Card"]

      [props]
      card_text = "This is the card"
      color.select = ["Red", "Blue"]
      color.default = "Blue" #: Comment
      """
    When I run "npm start" in the site directory
    Then stderr should be empty
    And stdout should not be empty
    When I run "npm start" in the . directory
    Then stderr should be empty
    And site/_site/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "id_key" : "_bookshop_name" |
      | "value" : { "_bookshop_name" : "card" , "card_text" : null, "color" : "Blue" } |
      | "label" : "Card"                                                               |
      | "_select_data" : { "colors" : [ "Red" , "Blue" ] }                             |
      | "_comments" : { "color" : "Comment" }                                          |
