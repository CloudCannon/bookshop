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
    * a site/src/components/tag/tag.astro file containing:
      """
      ---
      const { inner } = Astro.props;
      ---
      <span>{ inner.text }</span>
      """
    * a site/src/shared/astro/span.astro file containing:
      """
      <span>{ Astro.props.text }</span>
      """
    * a site/src/components/single/single_react.jsx file containing:
      """
      export default ({title}) => {
        return <h1>{ title }</h1>
      }
      """
    * a site/src/components/tag/tag_react.jsx file containing:
      """
      export default ({inner}) => {
        return <span>{ inner.text }</span>
      }
      """
    * a site/src/shared/astro/span_react.jsx file containing:
      """
      export default ({text}) => {
        return <span>{ text }</span>
      }
      """
  Scenario: Bookshop live renders a subcomponent
    Given a site/src/components/outer/outer.astro file containing:
      """
      ---
      import Single from '../single/single.astro'
      import SingleReact from '../single/single_react.jsx'

      const { contents } = Astro.props;
      ---
      <div> <Single title={contents.title} /> </div>
      <div> <SingleReact title={contents.title} /> </div>
      """
    * a site/src/components/outer/outer_react.jsx file containing:
      """
      import Single from '../single/single_react.jsx'

      export default ({contents}) => {
        return <div> <Single title={contents.title} /> </div>
      }
      """
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      contents:
        title: My title
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
      import Outer from "../components/outer/outer.astro";
      import OuterReact from "../components/outer/outer_react.jsx";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Outer bookshop:live contents={frontmatter.contents} />
      <OuterReact bookshop:live contents={frontmatter.contents} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: Your title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector div:nth-of-type(1)>h1 should contain "Your title"
    *    🌐 The selector div:nth-of-type(2)>h1 should contain "Your title"
    *    🌐 The selector div:nth-of-type(3)>h1 should contain "Your title"

  Scenario: Bookshop live renders a subinclude
    Given a site/src/components/outer/outer.astro file containing:
      """
      ---
      import Span from '../../shared/astro/span.astro'

      const { contents } = Astro.props;
      ---
      <div> <Span text={contents.title} /> </div>
      """
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      contents:
        title: My title
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
      import Outer from "../components/outer/outer.astro";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Outer bookshop:live contents={frontmatter.contents} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: The title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector span should contain "The title"

  Scenario: Bookshop live renders through an assign
    Given a site/src/components/assigner/assigner.astro file containing:
      """
      ---
      const testVar = Astro.props.component._bookshop_name;
      const titleVar = Astro.props.component.title;

      const components = import.meta.glob('../**/*.*', { eager: true });
      const Component = components[`../${testVar}/${testVar}.astro`].default
      const ReactComponent = components[`../${testVar}/${testVar}_react.jsx`].default
      ---
      <div> <Component bookshop:live title={titleVar} /></div>
      <div> <ReactComponent bookshop:live title={titleVar} /></div>
      """
    Given a site/src/components/assigner/assigner_react.jsx file containing:
      """
      const components = import.meta.glob('../**/*.*', { eager: true });

      export default ({component}) => {
        const testVar = component._bookshop_name;
        const titleVar = component.title;
        const ReactComponent = components[`../${testVar}/${testVar}_react.jsx`].default
        return <div> <ReactComponent title={titleVar} /></div>
      }
      """
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      component:
        _bookshop_name: single
        title: My title
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
      import Assigner from "../components/assigner/assigner.astro";
      import AssignerReact from "../components/assigner/assigner_react.jsx";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Assigner component={frontmatter.component} />
      <AssignerReact bookshop:live component={frontmatter.component} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      component:
        _bookshop_name: single
        title: Live Love Laugh
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector div:nth-of-type(1)>h1 should contain "Live Love Laugh"
    *    🌐 The selector div:nth-of-type(2)>h1 should contain "Live Love Laugh"
    *    🌐 The selector div:nth-of-type(3)>h1 should contain "Live Love Laugh"

  Scenario: Bookshop live renders a top level loop
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      titles:
        - "First"
        - "Second"
        - "Third"
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
      import Single from "../components/single/single.astro";
      import SingleReact from "../components/single/single_react.jsx";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <div>{frontmatter.titles.map((t) => <Single bookshop:live title={t} />)}</div>
      <div>{frontmatter.titles.map((t) => <SingleReact bookshop:live title={t} />)}</div>
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      titles:
        - "First"
        - "New!"
        - "Third"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector div:nth-of-type(1)>h1:nth-of-type(2) should contain "New!"
    *    🌐 The selector div:nth-of-type(2)>h1:nth-of-type(2) should contain "New!"

  @skip # Astro doesnt have ranges
  Scenario: Bookshop live renders a range loop

  Scenario: Bookshop live renders a dynamic loop
    Given a site/src/components/page/page.astro file containing:
      """
      ---
      const { content_blocks } = Astro.props;
      const components = import.meta.glob('../**/*.*', { eager: true });
      ---
      <div class="page">
      { content_blocks.map((block) => {
        const Component = components[`../${block._bookshop_name}/${block._bookshop_name}.astro`].default;
        const ReactComponent = components[`../${block._bookshop_name}/${block._bookshop_name}_react.jsx`].default;
        return <><Component {...block}/><ReactComponent {...block}/></>;
      })}
      </div>
      """
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      components:
        - _bookshop_name: single
          title: Block One
        - _bookshop_name: tag
          inner:
            text: Block Two
        - _bookshop_name: single
          title: Block Three
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
      import Page from "../components/page/page.astro";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Page bookshop:live content_blocks={frontmatter.components} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: single
          title: Block One
        - _bookshop_name: tag
          inner:
            text: New Tag
        - _bookshop_name: single
          title: Block Three
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .page>*:nth-child(3) should contain "New Tag"
    *    🌐 The selector .page>*:nth-child(4) should contain "New Tag"
    *    🌐 The selector .page>*:nth-child(5) should contain "Block Three"
    *    🌐 The selector .page>*:nth-child(6) should contain "Block Three"

  Scenario: Bookshop live renders a multiline component tag
    Given a site/src/components/outer/outer.astro file containing:
      """
      ---
      import Single from '../single/single.astro'

      const { contents } = Astro.props;
      ---
      <div>
        <Single
          title={contents.title}
        />
      </div>
      """
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      contents:
        title: My title
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
      import Outer from "../components/outer/outer.astro";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Outer
        bookshop:live
        contents={frontmatter.contents}
      />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: Your title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Your title"

  Scenario: Bookshop live renders a component without props
    Given a site/src/components/outer/outer.astro file containing:
      """
      ---
      import Inner from '../inner/inner.astro'
      ---
      <div> <Inner /> </div>
      """
    Given a site/src/components/inner/inner.astro file containing:
      """
      <h1>Hello :)</h1>
      """
    Given [front_matter]: "layout: ../layouts/Page.astro"
    And a site/src/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Outer from "../components/outer/outer.astro";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Outer bookshop:live/>
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello :)"

  Scenario: Bookshop live renders a nested component path
    Given a site/src/components/outer/outer.astro file containing:
      """
      ---
      import GenericButton from '../generic/button/button.astro'
      ---
      <div> <GenericButton /> </div>
      """
    Given a site/src/components/generic/button/button.astro file containing:
      """
      <button>Button!</button>
      """
    Given [front_matter]: "layout: ../layouts/Page.astro"
    And a site/src/pages/index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/src/layouts/Page.astro file containing:
      """
      ---
      import Outer from "../components/outer/outer.astro";
      const { frontmatter } = Astro.props;
      ---
      <html lang="en"> <body>
      <Outer bookshop:live/>
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector button should contain "Button!"
