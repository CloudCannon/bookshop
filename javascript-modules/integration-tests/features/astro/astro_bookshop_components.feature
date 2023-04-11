@astro
Feature: Basic Astro Bookshop
  As a user of Astro with Bookshop
  I want to be able to use components
  So that I can build my site

  Background:
    Given the file tree:
      """
      site/
        package.json from starters/astro/package.json # <-- this .json line hurts my syntax highlighting
        astro.config.mjs from starters/astro/astro.config.mjs
        src/
          helper.mjs from starters/astro/helper.mjs
      """

  Scenario: Tests are functional
    Given a site/src/content/pages/index.md file containing:
      """
      ---
      title: Hello World
      ---
      """
    Given a site/src/pages/[...slug].astro file containing:
      """
      ---
      import testHelper from "../helper.mjs";

      export async function getStaticPaths() {
        return testHelper();
      }

      const page = Astro.props.page;
      ---

      <h1>{ page.data.title }</h1>
      """
    When I run "npm i" in the site directory
    When I run "npm run build" in the site directory
    Then stderr should be empty
    # And stdout should contain "v1.0.0"
    And site/dist/index.html should contain the text "Hello World"
