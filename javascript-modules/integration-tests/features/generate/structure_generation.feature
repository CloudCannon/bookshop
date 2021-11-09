Feature: Bookshop Structure Generation
  As a user who is using a bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        public/
          _cloudcannon/
            info.json from starters/generate/info.json  # <-- this .json line hurts my syntax highlighting
      package.json from starters/generate/package.json  # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Generating structures
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
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "📚 Added 1 structure from 1 Bookshop to 1 site."
    And site/public/_cloudcannon/info.json should leniently contain each row: 
      | text |
      | "id_key" : "_bookshop_name" |
      | "value" : { "_bookshop_name" : "card" , "card_text" : null, "color" : "Blue" } |
      | "label" : "Card"                                                               |
      | "_select_data" : { "colors" : [ "Red" , "Blue" ] }                             |
      | "_comments" : { "color" : "Comment" }                                          |
