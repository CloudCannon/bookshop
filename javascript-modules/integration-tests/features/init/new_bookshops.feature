@init
Feature: Generating Bookshop Projects
  As a user who is not yet using a bookshop
  I want a CLI to make new Bookshop projects
  So that I don't have to create the directories myself.

  Background:
    Given the file tree:
      """
      package.json from starters/init/package.json  # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Creating a new Jekyll Bookshop
    When I run "npm start -- --new test --framework jekyll --format toml" in the . directory
    Then stderr should be empty
    And stdout should contain "Creating a Bookshop project at test"
    And test/bookshop/bookshop.config.cjs should contain the text "@bookshop/jekyll-engine"
    And test/components/sample/sample.jekyll.html should contain the text "c-sample"
    And test/components/sample/sample.scss should contain the text ".c-sample"
    And test/components/sample/sample.bookshop.toml should contain the text "content_blocks"
    And test/shared/jekyll/page.jekyll.html should contain the text "for block in include.content_blocks"
    And test/shared/styles/global.scss should contain the text "body"

  Scenario: Creating a new Eleventy Bookshop
    When I run "npm start -- --new test --framework eleventy --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "Creating a Bookshop project at test"
    And test/bookshop/bookshop.config.cjs should contain the text "@bookshop/eleventy-engine"
    And test/components/sample/sample.eleventy.liquid should contain the text "c-sample"
    And test/components/sample/sample.scss should contain the text ".c-sample"
    And test/components/sample/sample.bookshop.yml should contain the text "content_blocks"
    And test/shared/eleventy/page.eleventy.liquid should contain the text "for block in content_blocks"
    And test/shared/styles/global.scss should contain the text "body"

  Scenario: Creating a new Hugo Bookshop
    When I run "npm start -- --new test --framework hugo --format js" in the . directory
    Then stderr should be empty
    And stdout should contain "Creating a Bookshop project at test"
    And test/bookshop/bookshop.config.cjs should contain the text "@bookshop/hugo-engine"
    And test/components/sample/sample.hugo.html should contain the text "c-sample"
    And test/components/sample/sample.scss should contain the text ".c-sample"
    And test/components/sample/sample.bookshop.js should contain the text "content_blocks"
    And test/shared/hugo/page.hugo.html should contain the text "range ."
    And test/shared/styles/global.scss should contain the text "body"

  Scenario: Creating a new SvelteKit Bookshop
    When I run "npm start -- --new test --framework svelte --format json" in the . directory
    Then stderr should be empty
    And stdout should contain "Creating a Bookshop project at test"
    And test/bookshop/bookshop.config.cjs should contain the text "@bookshop/svelte-engine"
    And test/components/sample/sample.svelte should contain the text "c-sample"
    And test/components/sample/sample.scss should not exist
    And test/components/sample/sample.bookshop.json should contain the text "content_blocks"
    And test/shared/svelte/page.svelte should contain the text "each content_blocks as component"
    And test/shared/styles/global.scss should not exist
