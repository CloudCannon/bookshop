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
    Given a site/src/components/title/title.jsx file containing:
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
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Title from "../components/title/title";
      ---

      <Title bookshop:live text={"Result 🤽‍♂️"} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(title)"

  Scenario: Nested components are rendered from bookshop
    Given a site/src/components/nested/title/title.jsx file containing:
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
      import Title from "../components/nested/title/title";
      const { frontmatter } = Astro.props;
      ---

      <Title bookshop:live text={frontmatter.title} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(nested/title)"

  Scenario: Flat root components are rendered from bookshop
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

      <Title bookshop:live text={frontmatter.title} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(title)"

  Scenario: Nested flat components are rendered from bookshop
    Given a site/src/components/nested/title.jsx file containing:
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
      import Title from "../components/nested/title";
      const { frontmatter } = Astro.props;
      ---

      <Title bookshop:live text={frontmatter.title} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(nested/title)"

  @skip # Astro components are imported directly so precendence doesnt apply
  Scenario: Standard components take precendence over flat components

  Scenario: Components can use the page front matter
    Given a site/src/components/title/title.jsx file containing:
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
      import Title from "../components/title/title";
      const { frontmatter } = Astro.props;
      ---

      <Title bookshop:live text={frontmatter.title} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(title)"

  Scenario: Components can use further components
    Given a site/src/components/title/title.jsx file containing:
      """
      import Subtitle from './subtitle'
      export default function Title({ title, subtitle }) {
        return (
          <>
            <h1>Bookshop: <span>{title}</span></h1>
            <Subtitle subtitle={subtitle} />
          </>
        )
      }
      """
    And a site/src/components/title/subtitle.jsx file containing:
      """
      export default function Subtitle({ subtitle }) {
        return (
          <h2><em>{subtitle}</em></h2>
        )
      }
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      title: Result 🤽‍♂️
      subtitle: Meow 🐈
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Title from "../components/title/title";
      const { frontmatter } = Astro.props;
      ---

      <Title bookshop:live title={frontmatter.title} subtitle={frontmatter.subtitle} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(title)"
    And site/dist/index.html should contain the text "<em>Meow 🐈</em>"

  Scenario: Bookshop tags can use the bind syntax
    Given a site/src/components/title/title.jsx file containing:
      """
      import Subtitle from './subtitle'
      export default function Title({ title, subtitle }) {
        return (
          <>
            <h1>Bookshop: <span>{title}</span></h1>
            <Subtitle subtitle={subtitle} />
          </>
        )
      }
      """
    And a site/src/components/title/subtitle.jsx file containing:
      """
      export default function Subtitle({ subtitle }) {
        return (
          <h2><em>{subtitle}</em></h2>
        )
      }
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      title: Result 🤽‍♂️
      subtitle: Meow 🐈
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Title from "../components/title/title";
      const { frontmatter } = Astro.props;
      ---

      <Title bookshop:live {...frontmatter} />
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "Bookshop: <span>Result 🤽‍♂️</span>"
    And site/dist/index.html should contain the text "bookshop-live name(title)"
    And site/dist/index.html should contain the text "<em>Meow 🐈</em>"

  Scenario: Bookshop tags should support dynamic names
    Given a site/src/components/a.jsx file containing:
      """
      export default function A({ text }) {
        return (
          <h1>🅰️{text}</h1>
        )
      }
      """
    And a site/src/components/b.jsx file containing:
      """
      export default function B({ text }) {
        return (
          <h1>🅱️{text}</h1>
        )
      }
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      components:
        - name: a
          text: 🫀
        - name: b
          text: 🫑
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      const components = import.meta.glob("../components/**/*.jsx", {
        eager: true,
      });
      const { frontmatter } = Astro.props;
      ---
      {frontmatter.components.map(({name, text}) => {
        const Component = components[`../components/${name}.jsx`].default
        return <Component bookshop:live text={text} />
      })}
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "🅰️<!-- -->🫀"
    And site/dist/index.html should contain the text "🅱️<!-- -->🫑"
    And site/dist/index.html should contain the text "bookshop-live name(a)"
    And site/dist/index.html should contain the text "bookshop-live name(b)"

  Scenario: Bookshop page building components should work
    Given a site/src/components/blocks.jsx file containing:
      """
      const components = import.meta.glob("./**/*.jsx", {
        eager: true,
      });

      export default function Blocks({blocks}) {
        return <>
          {blocks.map(({name, block}) => {
            const Component = components[`./${name}.jsx`].default
            return <Component {...block} />
          })}
        </>
      }
      """
    And a site/src/components/a.jsx file containing:
      """
      export default function A({ text }) {
        return (
          <h1>🅰️{text}</h1>
        )
      }
      """
    And a site/src/components/b.jsx file containing:
      """
      export default function B({ text }) {
        return (
          <h1>🅱️{text}</h1>
        )
      }
      """
    And a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      blocks:
        - name: a
          block:
            text: 🫀
        - name: b
          block:
            text: 🫑
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Blocks from '../components/blocks';
      const { frontmatter } = Astro.props;
      ---
      <main>
        <Blocks bookshop:live blocks={frontmatter.blocks}/>
      </main>
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain the text "🅰️<!-- -->🫀"
    And site/dist/index.html should contain the text "🅱️<!-- -->🫑"
    And site/dist/index.html should contain the text "bookshop-live name(blocks)"