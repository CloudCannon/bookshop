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
        Gemfile from starters/jekyll/Gemfile.cloudcannon
        Gemfile.lock from starters/jekyll/Gemfile.cloudcannon.lock
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
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And site/_site/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "id_key" : "_bookshop_name" |
      | "value" : { "_bookshop_name" : "card" , "card_text" : null, "color" : "Blue" } |
      | "label" : "Card"                                                               |
      | "_select_data" : { "colors" : [ "Red" , "Blue" ] }                             |
      | "_comments" : { "color" : "Comment" }                                          |
