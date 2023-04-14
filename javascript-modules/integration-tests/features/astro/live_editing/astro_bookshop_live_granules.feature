@astro
Feature: Astro Bookshop CloudCannon Live Editing Granular Steps

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      cloudcannon.config.yml from starters/astro/cloudcannon.config.yml
      site/
        package.json from starters/astro/package.json # <-- this .json line hurts my syntax highlighting
        astro.config.mjs from starters/astro/astro.config.mjs
        src/
          bookshop/
            bookshop.config.cjs from starters/astro/bookshop.config.cjs
      """
    * a site/src/components/single.jsx file containing:
      """
      export default function Single({ title }) {
        return (
          <h1>{title}</h1>
        )
      }
      """
    * [front_matter]:
      """
      layout: ../layouts/Page.astro
      block:
        title: "Hello There"
      """
    * a site/src/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    * a site/src/layouts/Page.astro file containing:
      """
      ---
      import Single from "../components/single";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Single bookshop:live {...frontmatter.block} />
      </body> </html>
      """

  Scenario: Bookshop adds live editing markup
    When I run "npm run build" in the site directory
    Then stderr should be empty
    *    stdout should not be empty
    *    site/dist/index.html should contain each row:
      | text                                                 |
      | <!--bookshop-live name(single) params(bind:block)--> |

  Scenario: Bookshop Generate hydrates live editing
    Given I run "npm run build" in the site directory
    Given I run "npm run cc-astro" in the . directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying output site at ./site/dist"
    *    stdout should contain "Added live editing to 1 page containing Bookshop components"

  @web
  Scenario: Bookshop live renders when CloudCannon initialises
    Given [front_matter]:
      """
      block:
        title: "Gidday"
      """
    When 🌐 I load my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Gidday"