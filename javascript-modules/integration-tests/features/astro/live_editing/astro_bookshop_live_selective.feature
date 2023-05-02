@astro @web
Feature: Astro Bookshop CloudCannon Live Editing Selective Re-rendering

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
    * a site/src/components/single/single.astro file containing:
      """
      <h1>{ Astro.props.title }</h1>
      """
    * a site/src/components/multiple/multiple.astro file containing:
      """
      ---
      import Single from '../single/single.astro'
      const { items } = Astro.props;
      ---
      <div>
      {items.map((item) => <Single {...item} />)}
      </div>
      """
    * a site/src/components/uppermost/uppermost.astro file containing:
      """
      ---
      import Single from '../single/single.astro'
      import Multiple from '../multiple/multiple.astro'

      const { one, two, three } = Astro.props;
      ---
      <div>
      <Multiple {...one} />
      <span>{ two }</span>
      <Single title={three} />
      </div>
      """

  Scenario: Bookshop selectively live renders a loop
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      items:
        - title: "One"
        - title: "Two"
        - title: "Three"
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Multiple from "../components/multiple/multiple.astro";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Multiple bookshop:live items={frontmatter.items} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    And 🌐 I have added a click listener to h1:nth-of-type(2)
    When 🌐 CloudCannon pushes new yaml:
      """
      items:
        - title: "A"
        - title: "Two"
        - title: "C"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(1) should contain "A"
    *    🌐 The selector h1:nth-of-type(3) should contain "C"
    *    🌐 There should be a click listener on h1:nth-of-type(2)

  Scenario: Bookshop live renders components depth first
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      data:
        one:
          items:
            - title: "I"
            - title: "II"
            - title: "III"
        two: "two"
        three: "three"
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Uppermost from "../components/uppermost/uppermost.astro";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Uppermost bookshop:live {...frontmatter.data} />
      </body> </html>
      """
    Given 🌐 I have loaded my site in CloudCannon
    And  🌐 I have added a click listener to span
    When 🌐 CloudCannon pushes new yaml:
      """
      data:
        one:
          items:
            - title: "I"
            - title: "II"
            - title: "III"
            - title: "IV"
        two: "two"
        three: "tres"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(4) should contain "IV"
    *    🌐 There should be a click listener on span
