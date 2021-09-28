Feature: Building Bookshop Sass
  As a user who is using a bookshop
  I want to compile my Sass files to CSS
  So that I can use them in any context

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        package.json from starters/standalone_sass/package.json
      """

  Scenario: Compiling simple component Sass
    Given a component-lib/components/title/title.scss file containing:
      """
      .c-title { &__text { color: red; } }
      """
    When I run "yarn install && yarn start" in the site directory
    Then stderr should be empty
    And stdout should contain "Compiled Bookshop Sass with 0 errors and 0 warnings."
    And stdout should contain "📚 Writing styles to bookshop.css"
    And site/assets/css/bookshop.css should contain the text ".c-title__text"
