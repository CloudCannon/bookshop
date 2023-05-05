@astro @web
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
    * a site/src/components/title.astro file containing:
      """
      <h1>{Astro.props.innards}</h1>
      """
    * a site/src/components/title_react.jsx file containing:
      """
      export default ({innards}) => {
        return <h1>{innards}</h1>;
      }
      """

  Scenario: Bookshop live renders a simple data binding
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      hero: "Hello World"
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
      import Title from "../components/title.astro";
      import TitleReact from "../components/title_react.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Title bookshop:live innards={frontmatter.hero} />
      <TitleReact bookshop:live innards={frontmatter.hero} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#hero\">Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#hero\">Hello World</h1>"

  Scenario: Bookshop live renders a nested data binding
    Given a site/src/components/outer.astro file containing:
      """
      ---
      import Title from './title.astro';
      import TitleReact from './title_react.jsx';
      ---
      <div> <Title innards={Astro.props.title.item} /></div>
      <div> <TitleReact innards={Astro.props.title.item} /></div>
      """
    And a site/src/components/outer_react.jsx file containing:
      """
      import Title from './title_react.jsx';

      export default ({title}) => {
        return <div> <Title innards={title.item} /></div>
      }
      """
    And [front_matter]:
      """
      layout: ../layouts/Page.astro
      items:
        item: "Hello There"
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
      import Outer from "../components/outer.astro";
      import OuterReact from "../components/outer_react.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Outer bookshop:live title={frontmatter.items} />
      <OuterReact bookshop:live title={frontmatter.items} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector div:nth-of-type(1)>h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"
    Then 🌐 The selector div:nth-of-type(2)>h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"
    Then 🌐 The selector div:nth-of-type(3)>h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a nested loop data binding
    Given a site/src/components/loop.astro file containing:
      """
      ---
      import Title from './title.astro';
      const { rows } = Astro.props;
      ---
      <div>
        {rows.map((row) => <Title innards={row} />)}
      </div>
      """
    And a site/src/components/loop_react.jsx file containing:
      """
      import Title from './title_react.jsx';

      export default ({rows}) => {
        return <div>{rows.map((row, i) => <Title key={i} innards={row} />)}</div>;
      }
      """
    And [front_matter]:
      """
      layout: ../layouts/Page.astro
      rows:
        - "Hello There"
        - "Goodbye You"
        - "A third one."
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
      import Loop from "../components/loop.astro";
      import LoopReact from "../components/loop_react.jsx";
      const { rows } = Astro.props.frontmatter;
      ---

      <html lang="en"> <body>
      <Loop bookshop:live rows={rows} />
      <LoopReact bookshop:live rows={rows} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector div:nth-of-type(1)>h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows.0\">Hello There</h1>"
    Then 🌐 The selector div:nth-of-type(1)>h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows.1\">Goodbye You</h1>"
    Then 🌐 The selector div:nth-of-type(1)>h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows.2\">A third one.</h1>"
    Then 🌐 The selector div:nth-of-type(2)>h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows.0\">Hello There</h1>"
    Then 🌐 The selector div:nth-of-type(2)>h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows.1\">Goodbye You</h1>"
    Then 🌐 The selector div:nth-of-type(2)>h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows.2\">A third one.</h1>"

  Scenario: Bookshop live renders a data binding through an assign
    Given a site/src/components/outer.astro file containing:
      """
      ---
      import Title from './title.astro';
      const a = Astro;
      const p = a.props;
      const t = p.title;
      const v = t.item
      ---
      <div> <Title innards={v} /></div>
      """
    And a site/src/components/outer_react.jsx file containing:
      """
      import Title from './title_react.jsx';

      export default (props) => {
        const p = props;
        const t = p.title;
        const v = t.item
        return <div> <Title innards={v} /></div>;
      }
      """
    And [front_matter]:
      """
      layout: ../layouts/Page.astro
      items:
        item: "Hello There"
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
      import Outer from "../components/outer.astro";
      import OuterReact from "../components/outer_react.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Outer bookshop:live title={frontmatter.items} />
      <OuterReact bookshop:live title={frontmatter.items} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector div:nth-of-type(1)>h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"
    *    🌐 The selector div:nth-of-type(2)>h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a parent data binding over a child
    Given a site/src/components/loop.astro file containing:
      """
      ---
      import Title from './title.astro';
      const { rows } = Astro.props;
      ---
      {rows.map((row) => <Title innards={row} />)}
      """
    And a site/src/components/loop_react.jsx file containing:
      """
      import Title from './title_react.jsx';

      export default ({rows}) => {
        return <>{rows.map((row, i) => <Title key={i} innards={row} />)}</>;
      }
      """
    And [front_matter]:
      """
      layout: ../layouts/Page.astro
      rows:
        - "Hello There"
        - "Goodbye You"
        - "A third one."
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
      import Loop from "../components/loop.astro";
      import LoopReact from "../components/loop_react.jsx";
      const { rows } = Astro.props.frontmatter;
      ---

      <html lang="en"> <body>
      <Loop bookshop:live rows={rows} />
      <LoopReact bookshop:live rows={rows} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows\">A third one.</h1>"
    Then 🌐 The selector h1:nth-of-type(4) should match "<h1 data-cms-bind=\"#rows\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(5) should match "<h1 data-cms-bind=\"#rows\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(6) should match "<h1 data-cms-bind=\"#rows\">A third one.</h1>"

  Scenario: Bookshop live respects the per-component dataBinding flag
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      hero: "Hello World"
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
      import Title from "../components/title.astro";
      import TitleReact from "../components/title_react.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <body>
      <Title bookshop:live bookshop:binding={false} innards={frontmatter.hero} />
      <TitleReact bookshop:live bookshop:binding={false} innards={frontmatter.hero} />
      </body> </html>
      """
    And 🌐 I have loaded my site
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1>Hello World</h1>"

  Scenario: Bookshop live respects the global dataBindings flag
    Given [front_matter]:
      """
      layout: ../layouts/Page.astro
      hero: "Hello World"
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
      import Title from "../components/title.astro";
      import TitleReact from "../components/title_react.jsx";
      const { frontmatter } = Astro.props;
      ---

      <html lang="en"> <head>
      <script>window.bookshopDataBindings = false;</script>
      </head> <body>
      <Title bookshop:live innards={frontmatter.hero} />
      <TitleReact bookshop:live innards={frontmatter.hero} />
      </body> </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1>Hello World</h1>"
