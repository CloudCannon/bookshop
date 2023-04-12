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
          bookshop/
            bookshop.config.cjs from starters/astro/bookshop.config.cjs
      """

  Scenario: Tests are functional
    Given a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      title: Hello World
      ---
      """
    Given a site/src/layouts/Page.astro file containing:
      """
      ---
      const { frontmatter } = Astro.props;
      ---

      <h1>{ frontmatter.title }</h1>
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Hello World"

  Scenario: Components are rendered from bookshop
    Given a site/src/components/title.jsx file containing:
      """
      export default function Title({ text }) {
        return (
          <h1>Bookshop: <span>{text}</span></h1>
        )
      }
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      title: Result 🤽‍♂️
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Title from "../components/title";
      const { frontmatter } = Astro.props;
      ---

      <Title text={frontmatter.title} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
