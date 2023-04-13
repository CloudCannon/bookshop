@astro
Feature: Astro Bookshop Includes
  As a user of Astro with Bookshop
  I want includes scoped to the bookshop
  So that I can use them on the site or in components

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

  Scenario: Basic Bookshop Include
    Given a site/src/shared/astro/basic.astro file containing:
      """
      ---
      const {label} = Astro.props
      ---
      {label}🎉
      """
    Given a site/src/components/block.astro file containing:
      """
      ---
      import Basic from '../shared/astro/basic.astro'
      const {title} = Astro.props
      ---
      <div><Basic label={title} />-Block</div>
      """
    Given a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      label: Site
      ---
      """
    Given a site/src/layouts/Page.astro file containing:
      """
      ---
      import Basic from '../shared/astro/basic.astro'
      import Block from '../components/block.astro'

      const { frontmatter } = Astro.props;
      ---
      <Block bookshop:live title="Component" />
      <span><Basic bookshop:live label={frontmatter.label}/>-Inline</span>
      """
    When I run "npm run build" in the site directory
    Then stderr should be empty
    And stdout should contain "Complete!"
    And site/dist/index.html should leniently contain each row:
      | text                                                                                                           |
      | <!--bookshop-live name(block) params(title:"Component")--><div>Component🎉-Block</div><!--bookshop-live end--> |
      | <!--bookshop-live name(basic) params(label:label)-->Site🎉<!--bookshop-live end-->-Inline                      |
