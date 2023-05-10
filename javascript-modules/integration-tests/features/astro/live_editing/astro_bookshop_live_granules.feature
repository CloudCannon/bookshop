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
    * a site/src/components/flat_single.astro file containing:
      """
      <h1>{Astro.props.title}</h1>
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
      import Single from "../components/single.jsx";
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

  @web
  Scenario: Bookshop live renders when CloudCannon pushes new data
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Rerendered"

  @web
  Scenario: Bookshop live renders flat components when CloudCannon pushes new data
    Given a site/src/layouts/Page.astro file containing:
      """
      ---
      import FlatSingle from "../components/flat_single.astro";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <FlatSingle bookshop:live {...frontmatter.block} />
      </body> </html>
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Rerendered"

  @web
  Scenario: Bookshop doesn't live render flagged components
    Given a site/src/layouts/Page.astro file containing:
      """
      ---
      import Single from "../components/single.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Single {...frontmatter.block} />
      <!-- This is here so the test doesn't time out waiting for live-->
      <Single bookshop:live title="🤫" />
      </body> </html>
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There"

  @web
  Scenario: Bookshop sets a flag when live editing
    Given a site/src/components/single.jsx file containing:
      """
      import Nested from './nested/nested.jsx';

      export default function Single({ title }) {
        return <>
          <h1>{ENV_BOOKSHOP_LIVE?"LIVE!":"DEAD?"} {title}</h1>
          <Nested title={title} />
        </>
      }
      """
    Given a site/src/components/nested/nested.jsx file containing:
      """
      export default function Nested({ title }) {
        return <h2>{ENV_BOOKSHOP_LIVE?"LIVE!":"DEAD?"} {title}</h2>
      }
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "🫑"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "LIVE! 🫑"
    *    🌐 The selector h2 should contain "LIVE! 🫑"

