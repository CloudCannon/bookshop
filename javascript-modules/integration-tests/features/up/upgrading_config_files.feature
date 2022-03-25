@up
Feature: Bookshop Config File Upgrades

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      package.json from starters/up/package.json  # <-- this .json line hurts my syntax highlighting
      """
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [component]
      structures = [ "content_blocks" ]
      label = "Card"
      description = "Card component"
      icon = "nature_people"
      tags = ["Card"]

      [props]
      card_text = "This is the card"
      color.select = ["Red", "Blue"]
      color.default = "Blue" #: Comment
      """
    Given [spec_comment]: "Metadata about this component, to be used in the CMS"
    Given [blueprint_comment]: "Defines the structure of this component, as well as the default values"
    Given [preview_comment]: "Overrides any fields in the blueprint when viewing this component in the component browser"
    Given [inputs_comment]: "Any extra CloudCannon inputs configuration to apply to the blueprint"

  Scenario: Gracefully handles unparsable files
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      mystery_key = Hello World
      [props

      """
    When I try run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should contain "ERROR: Couldn't parse component-lib/components/test/test.bookshop.toml"
    And component-lib/components/test/test.bookshop.toml should contain exactly: 
      """
      mystery_key = Hello World
      [props

      """

  Scenario: Ignores existing 3.0 syntax
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [spec]
      """
    When I run "npm start -- --yes --version 3.0.0" in the . directory
    Then stderr should be empty
    And stdout should contain "✅ 1 Bookshop config file matches 3.0 syntax"

  Scenario: Converts to toml
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      text.default = "Hello World"
      """
    When I run "npm start -- --yes --version 3.0.0 --format toml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → toml @ 3.0"
    And component-lib/components/test/test.bookshop.toml should contain exactly: 
      """
      # [spec_comment]
      [spec]

      # [blueprint_comment]
      [blueprint]
      text = 'Hello World'

      # [preview_comment]
      [preview]

      # [inputs_comment]
      [_inputs]

      """

  Scenario: Converts to yaml
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      text.default = "Hello World"
      """
    When I run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → yml @ 3.0"
    And component-lib/components/test/test.bookshop.toml should not exist
    And component-lib/components/test/test.bookshop.yml should contain exactly: 
      """
      # [spec_comment]
      spec: {}

      # [blueprint_comment]
      blueprint:
        text: Hello World
      
      # [preview_comment]
      preview: {}

      # [inputs_comment]
      _inputs: {}

      """

  Scenario: Converts to json
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      text.default = "Hello World"
      """
    When I run "npm start -- --yes --version 3.0.0 --format json" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → json @ 3.0"
    And component-lib/components/test/test.bookshop.toml should not exist
    And component-lib/components/test/test.bookshop.json should contain exactly: 
      """
      {
        "spec": {},
        "blueprint": {
          "text": "Hello World"
        },
        "preview": {},
        "_inputs": {}
      }

      """

  Scenario: Converts to js
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      text.default = "Hello World"
      """
    When I run "npm start -- --yes --version 3.0.0 --format js" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → js @ 3.0"
    And component-lib/components/test/test.bookshop.toml should not exist
    And component-lib/components/test/test.bookshop.js should contain exactly: 
      """
      module.exports = () => {
        // [spec_comment]
        const spec = {};

        // [blueprint_comment]
        const blueprint = { text: 'Hello World' };

        // [preview_comment]
        const preview = {};

        // [inputs_comment]
        const _inputs = {};

        return {
          spec,
          blueprint,
          preview,
          _inputs,
        }
      }

      """

  Scenario: Converts non-default values
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      text = "Hello World"
      """
    When I run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → yml @ 3.0"
    And component-lib/components/test/test.bookshop.yml should contain exactly: 
      """
      # [spec_comment]
      spec: {}

      # [blueprint_comment]
      blueprint:
        text: ""
      
      # [preview_comment]
      preview:
        text: Hello World

      # [inputs_comment]
      _inputs: {}

      """
    When I run "npm start -- --yes --version 3.0.0 --format js" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.yml @ 3.0 → js @ 3.0"
    And component-lib/components/test/test.bookshop.js should contain exactly: 
      """
      module.exports = () => {
        // [spec_comment]
        const spec = {};

        // [blueprint_comment]
        const blueprint = { text: '' };

        // [preview_comment]
        const preview = { text: 'Hello World' };

        // [inputs_comment]
        const _inputs = {};

        return {
          spec,
          blueprint,
          preview,
          _inputs,
        }
      }

      """
    When I run "npm start -- --yes --version 3.0.0 --format json" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.js @ 3.0 → json @ 3.0"
    And component-lib/components/test/test.bookshop.json should contain exactly: 
      """
      {
        "spec": {},
        "blueprint": {
          "text": ""
        },
        "preview": {
          "text": "Hello World"
        },
        "_inputs": {}
      }

      """


  Scenario: Converts comments to input configuration
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      text.default = "Hello World" #: CMS Comment

      [[props.array]] #: Array Comment
      array_text.default = "Hi Globe" #: Text Comment
      """
    When I run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → yml @ 3.0"
    And component-lib/components/test/test.bookshop.yml should contain exactly: 
      """
      # [spec_comment]
      spec: {}

      # [blueprint_comment]
      blueprint:
        text: Hello World
        array:
          - array_text: Hi Globe
      
      # [preview_comment]
      preview: {}

      # [inputs_comment]
      _inputs:
        text:
          comment: CMS Comment
        array:
          comment: Array Comment
        array_text:
          comment: Text Comment

      """

  Scenario: Creates _inputs config for select values
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      apple.select = ["Hello", "World"]
      """
    When I run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → yml @ 3.0"
    And component-lib/components/test/test.bookshop.yml should contain exactly: 
      """
      # [spec_comment]
      spec: {}

      # [blueprint_comment]
      blueprint:
        apple: Hello
      
      # [preview_comment]
      preview: {}

      # [inputs_comment]
      _inputs:
        apple:
          type: select
          options:
            values:
              - Hello
              - World

      """
  
    Scenario: Creates _inputs config for multiselect values
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      apples.select = ["Hello", "World"]
      """
    When I run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → yml @ 3.0"
    And component-lib/components/test/test.bookshop.yml should contain exactly: 
      """
      # [spec_comment]
      spec: {}

      # [blueprint_comment]
      blueprint:
        apples:
          - Hello
      
      # [preview_comment]
      preview: {}

      # [inputs_comment]
      _inputs:
        apples:
          type: multiselect
          options:
            values:
              - Hello
              - World

      """

  Scenario: Creates _inputs config for instance values
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      a.instance = "NOW"
      a.default = "0"
      """
    When I run "npm start -- --yes --version 3.0.0 --format toml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → toml @ 3.0"
    And component-lib/components/test/test.bookshop.toml should contain exactly: 
      """
      # [spec_comment]
      [spec]

      # [blueprint_comment]
      [blueprint]
      a = '0'
      
      # [preview_comment]
      [preview]

      # [inputs_comment]
      [_inputs]
      a.instance_value = 'NOW'

      """
    
  Scenario: Creates config for nested objects
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [props]
      title.default = "My Component"

      [[props.tags]]
      tag_type.select = ["Major", "Minor"] #: Used in the changelog
      tag = "Bookshop"

      [[props.tags]]
      tag_type.select = ["Major", "Minor"]
      tag = "Component"
      """
    When I run "npm start -- --yes --version 3.0.0 --format js" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → js @ 3.0"
    And component-lib/components/test/test.bookshop.js should contain exactly: 
      """
      module.exports = () => {
        // [spec_comment]
        const spec = {};

        // [blueprint_comment]
        const blueprint = {
          title: 'My Component',
          tags: [
            { tag_type: 'Major', tag: '' }
          ]
        };

        // [preview_comment]
        const preview = { tags: [ { tag: 'Bookshop' }, { tag: 'Component' } ] };

        // [inputs_comment]
        const _inputs = {
          tag_type: {
            comment: 'Used in the changelog',
            type: 'select',
            options: {
              values: [
                'Major',
                'Minor'
              ]
            }
          }
        };

        return {
          spec,
          blueprint,
          preview,
          _inputs,
        }
      }

      """
    
  Scenario: Migrates component to spec
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      [component]
      structures = ["content_blocks"]
      label = "Hero"
      description = "Main page hero block"
      icon = "title"
      tags = ["Hero", "WYSIWYG"]

      [props]
      text.default = "Hello World"
      """
    When I run "npm start -- --yes --version 3.0.0 --format toml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 2.0 → toml @ 3.0"
    And component-lib/components/test/test.bookshop.toml should contain exactly: 
      """
      # [spec_comment]
      [spec]
      structures = ['content_blocks']
      label = 'Hero'
      description = 'Main page hero block'
      icon = 'title'
      tags = ['Hero', 'WYSIWYG']

      # [blueprint_comment]
      [blueprint]
      text = 'Hello World'

      # [preview_comment]
      [preview]

      # [inputs_comment]
      [_inputs]

      """

  Scenario: Migrates extra keys between formats
    Given a component-lib/components/test/test.bookshop.toml file containing:
      """
      something_else = false

      # [spec_comment]
      [spec]
      structures = ['content_blocks']
      label = 'Hero'
      description = 'Main page hero block'
      icon = 'title'
      tags = ['Hero', 'WYSIWYG']

      # [blueprint_comment]
      [blueprint]
      text = 'Hello World'

      # [preview_comment]
      [preview]

      # [inputs_comment]
      [_inputs]

      [_select_data]
      superfluous = [ 'a', 'b' ]
      """
    When I run "npm start -- --yes --version 3.0.0 --format yml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.toml @ 3.0 → yml @ 3.0"
    And component-lib/components/test/test.bookshop.yml should contain exactly: 
      """
      # [spec_comment]
      spec:
        structures:
          - content_blocks
        label: Hero
        description: Main page hero block
        icon: title
        tags:
          - Hero
          - WYSIWYG

      # [blueprint_comment]
      blueprint:
        text: Hello World

      # [preview_comment]
      preview: {}

      # [inputs_comment]
      _inputs: {}

      something_else: false

      _select_data:
        superfluous:
          - a
          - b

      """
    When I run "npm start -- --yes --version 3.0.0 --format js" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.yml @ 3.0 → js @ 3.0"
    And component-lib/components/test/test.bookshop.js should contain exactly: 
      """
      module.exports = () => {
        // [spec_comment]
        const spec = {
          structures: [ 'content_blocks' ],
          label: 'Hero',
          description: 'Main page hero block',
          icon: 'title',
          tags: [ 'Hero', 'WYSIWYG' ]
        };

        // [blueprint_comment]
        const blueprint = { text: 'Hello World' };

        // [preview_comment]
        const preview = {};

        // [inputs_comment]
        const _inputs = {};

        const extra_fields = {
          something_else: false,
          _select_data: {
            superfluous: [
              'a',
              'b'
            ]
          }
        };

        return {
          spec,
          blueprint,
          preview,
          _inputs,
          ...extra_fields,
        }
      }

      """
    When I run "npm start -- --yes --version 3.0.0 --format json" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.js @ 3.0 → json @ 3.0"
    And component-lib/components/test/test.bookshop.json should contain exactly: 
      """
      {
        "spec": {
          "structures": [
            "content_blocks"
          ],
          "label": "Hero",
          "description": "Main page hero block",
          "icon": "title",
          "tags": [
            "Hero",
            "WYSIWYG"
          ]
        },
        "blueprint": {
          "text": "Hello World"
        },
        "preview": {},
        "_inputs": {},
        "something_else": false,
        "_select_data": {
          "superfluous": [
            "a",
            "b"
          ]
        }
      }

      """
    When I run "npm start -- --yes --version 3.0.0 --format toml" in the . directory
    Then stderr should be empty
    And stdout should contain "🌟 component-lib/components/test/test.bookshop.json @ 3.0 → toml @ 3.0"
    And component-lib/components/test/test.bookshop.toml should contain exactly: 
      """
      something_else = false

      # [spec_comment]
      [spec]
      structures = [
        'content_blocks',
      ]
      label = 'Hero'
      description = 'Main page hero block'
      icon = 'title'
      tags = [
        'Hero',
        'WYSIWYG',
      ]

      # [blueprint_comment]
      [blueprint]
      text = 'Hello World'

      # [preview_comment]
      [preview]

      # [inputs_comment]
      [_inputs]

      [_select_data]
      superfluous = [
        'a',
        'b',
      ]

      """