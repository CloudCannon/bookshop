@astro @web @bespoke
Feature: Astro Bookshop CloudCannon Live Editing Edge Cases

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
    * a site/src/components/single.css file containing:
      """
      * {
        background: red;
      }
      """
    * a site/src/components/single.module.scss file containing:
      """
      .single {
        background: blue;
      }
      """
    * a site/src/components/single.jsx file containing:
      """
      import './single.css'
      import styles from './single.module.scss'

      export default function Single({ title }) {
        return (
          <h1 className={styles.single}>{title}</h1>
        )
      }
      """
    * [front_matter]:
      """
      layout: ../layouts/Page.astro
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
      <Single bookshop:live title={frontmatter.title} />
      </body> </html>
      """

  Scenario: Bookshop handles css module imports
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      title: "🦀"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector ._single_zqb1b_1 should contain "🦀"

  Scenario: Bookshop handles css global imports
    Given I run "npm run build" in the site directory
    Given I run "npm run cc-astro" in the . directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should not be empty
    *    site/dist/_cloudcannon/bookshop-live.css should contain each row:
      | text            |
      | * {             |
      | background: red |
      | }               |

  Scenario: Bookshop handles React components with no props
    Given a site/src/layouts/Page.astro file containing:
      """
      ---
      import EmptySingle from "../components/empty_single.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <EmptySingle bookshop:live />
      </body> </html>
      """
    * a site/src/components/empty_single.jsx file containing:
      """
      import Inner from './empty_inner.jsx'

      export default function Single() {
        return (
          <Inner>
            <h1>👻</h1>
          </Inner>
        )
      }
      """
    * a site/src/components/empty_inner.jsx file containing:
      """
      export default function Inner({ children }) {
        return children
      }
      """
    * I run "npm run build" in the site directory
    * I run "npm run cc-astro" in the . directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should not be empty
    *    site/dist/index.html should contain each row:
      | text        |
      | <h1>👻</h1> |