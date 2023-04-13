@astro
Feature: Astro Bookshop CloudCannon Integration
  As a user of Astro with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

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
    Given a site/src/components/blocks.astro file containing:
      """
      ---
      const components = import.meta.glob("./**/*", {
        eager: true,
      });

      const {blocks} = Astro.props;
      ---
      {blocks.map(({name, block}) => {
        const Component = (components[`./${name}.jsx`] ?? components[`./${name}.astro`]).default
        return <Component {...block} />
      })}
      """
    And a site/src/components/a.jsx file containing:
      """
      export default function A({ text }) {
        return (
          <h1>🅰️{text}</h1>
        )
      }
      """
    And a site/src/components/b.astro file containing:
      """
      ---
      const {text} = Astro.props
      ---
      <h1>🅱️{text}</h1>
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
      import Blocks from '../components/blocks.astro';
      const { frontmatter } = Astro.props;
      ---
      <main>
        <Blocks bookshop:live blocks={frontmatter.blocks}/>
      </main>
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should contain each row:
      | text                                                                                |
      | <!--bookshop-live name(blocks) params(blocks:blocks)-->                             |
      | <!--databinding:blocks-->                                                           |
      | <h1 data-cms-bind="#blocks.0.block">🅰️<!-- -->🫀</h1>                              |
      | <!--databinding:blocks.1.block--><h1>🅱️🫑</h1><!--databindingend:blocks.1.block--> |
      | <!--databindingend:blocks-->                                                        |
      | <!--bookshop-live end-->                                                            |