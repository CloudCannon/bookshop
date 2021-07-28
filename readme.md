# Bookshop
Bookshop is a component development workflow for static websites.  
Bookshop currently supports Jekyll, and will support a wider array of static site generators in the near future.

Bookshop is currently in an alpha of version 2.0, so breaking changes to the following formats are likely before a general release.

The best current example of a Bookshop 2.0 project can be found at [bglw/bookshop-example](https://github.com/bglw/bookshop-example). This repository should provide an in-situ example of all the concepts discussed below.

# Table of Contents
* [Configuration](#configuration)
* [Component Structure](#component-structure)
* [Component TOML Format](#component-toml-format)
    * [TOML Schema Keys](#toml-schema-keys)
        * [Default Values](#default-values)
        * [Select Data](#select-data)
        * [Structures](#structures)
        * [Comments](#comments)
* [Styles](#styles)
* [Bookshop Renderer](#bookshop-renderer)

## Configuration
A bookshop project is expected to have the following structure:
```
example-bookshop/
├─ bookshop/
│  ├─ bookshop.config.js
│  └─ **.scss
└─ components/
   ├─ component-name/
   │  ├─ component-name.bookshop.toml
   │  └─ component-name.**
   ├─ ...
```

- `bookshop/bookshop.config.js`
  - This file is reserved for future configuration.
- `bookshop/**.scss`
  - These are global styles and variables. See [Styles](#styles).
- `components/**`
  - These are the core component definitions. See [Component Structure](#component-structure).

***

Generally, your website will live alongside your bookshop project (either as seperate repositories, or a monorepo):
```
example-project/
├─ example-website-1/
├─ example-website-2/
└─ example-bookshop/
```

## Component Structure
Components live within the `components/` directory of your bookshop, inside a folder bearing their name. A component is defined with a `<name>.bookshop.toml` file in the [Component TOML Format](#component-toml-format). This file serves as the schema for the component, defining which properties it may be supplied.

For example, a `button` component would be defined at:
```
components/
└─ button/
   ├─ button.bookshop.toml
   └─ button.**
```

Components may also be nested within folders, which are then referenced as part of the component name. For example, the following structure would define the components `button/large` and `button/small` (But **not** `button`):
```
components/
└─ button/
   ├─ large/
   │  ├─ large.bookshop.toml
   │  └─ large.**
   └─ small/
      ├─ small.bookshop.toml
      └─ small.**
```

Alongside the bookshop TOML file, the component files are provided. For the button example, this might look like:
```
components/
└─ button/
   ├─ button.bookshop.toml
   ├─ button.jekyll.html
   ├─ button.scss
   └─ button.svelte
```

`button.jekyll.html` and `button.svelte` are both implementations of the `button` component markup, but they share the same SCSS file and TOML schema. Bookshop is designed to span static site generators, so in the future you might also write a `button.hugo.html` and a `button.jsx`, depending on the generators your component library is targeting.  

For now, bookshop bakes in support for `.jekyll.html`, but in the near future this will be abstracted into configurable engines.

For details on the `.jekyll.html` file, see [Bookshop Jekyll Templates](#bookshop-jekyll-templates).  
For details on the `.scss` file, see [Styles](#styles).

## Component TOML Format
A bookshop TOML file defines the schema for a given component. This schema is then used when previewing components in the bookshop, and for configuring editing interfaces.

The component TOML file for our button might look like the following:

>#### `button.bookshop.toml`
>```toml
>[component]
>array_structures = [ "editor_components" ]
>label = "Button"
>description = "Outbound CTA links"
>icon = "smart_button"
>tags = [ "Subcomponents", "CTAs" ]
>
>[props]
>label.default = "Get Started"
>type.select = ["Standard", "Outline"]
>type.default = "Standard"
>link_url = "/"
>open_in_new_tab = false
>```

The `[component]` block defines this component, and is used to configure page building interfaces. The fields are the following:
```toml
array_structures = [] # Used to configure editing interfaces
label = ""            # Editor-friendly name
description = ""      # Editor-friendly description
icon = ""             # Material icon name
tags = []             # Tags for filtering
```

The `[props]` block defines the component schema. This controls what properties it can receive, and is used to configure editing interfaces. The props of our button file above would correspond to the following usage in Jekyll:
```liquid
{% button label="Button" type="Standard" link_url="/" open_in_new_tab=false %}
```

### TOML Schema Keys
Within the TOML file there are a few formats for defining the schema. The two special keywords are `select` and `default` when defined within an object. These denote that the object they're within should be treated instead as a value with a specified behaviour.

#### Default Values
**The field `default` is a special keyword in bookshop, which denotes a field as having a default value when created in the CMS.**  
By default, alphanumeric values in the TOML file are considered testing data, and new components created in a CMS interface will be initialized with empty inputs. If you do wish to give a field a default value, use `key.default`
```toml
title.default = "Hello World"
order_number.default = 50
featured = false
```
This will prepopulate a new component in the CMS with `title: "Hello World"` and `order_number: 50`.  
The default key is not required for boolean values, the value specified in the TOML will be used as the default CMS value.  
>ℹ️ _A default value in the TOML file does not provide a default value to the component itself. It is solely used to configure editing interfaces._

#### Select Data
**The field `select` is a special keyword in bookshop, which denotes a field as drawing from select data (a dropdown).**  
This key expects an array of options that will be used to populate the CMS.
```toml
size.select = ["Large", "Medium", "Small"]
```
In this example, the component would then receive a property equivalent to `size="Large"` for the given selected value. Dropdowns are initialized empty, if you wish to also define a default selected state, combine the `select` and `default` keywords:
```toml
size.select = ["Large", "Medium", "Small"]
size.default = "Medium"
```

An object that doesn't contain the keys `select` or `default` will be treated as a normal object.
#### Structures
Constructing an array of objects in the TOML file defines a sub-schema for the CMS. Given the following structure:
```toml
[props]
title = "Hello World"

[[props.buttons]]
label.default = "Get Started"
link_url = "/app"
```
The CMS should provide an array named `buttons` within the component, to which buttons may be added or removed. Within these objects, all bookshop schema keys behave the same, and these sub-structures may define their own sub-structures again, i.e. with `[[props.buttons.styles]]`  
This array will be initialized empty, and the first array item in the TOML file will be used to build the schema for the sub-structure.

#### Comments
Editor-facing comments can be defined for a key through a comment starting with `#:` on the same line. For example:
```toml
title = "Hello World" #: Looks best under 35 characters
type.select = ["Primary", "Secondary"] #: Defines button hierarchy
```

## Styles
Styles in bookshop use SCSS. This is currently implementation agnostic — the [Bookshop Renderer](#bookshop-renderer) uses Dart Sass, but the generator ingesting components may use another implementation (i.e. Jekyll currently uses libsass).

SCSS files within a project do not need to be individually referenced, and are instead loaded in alphabetical order. This starts with all SCSS files within `bookshop/`, followed by all SCSS files within `components/`.

Importing these files is generator-specific. See the [jekyll-bookshop](plugins/jekyll-bookshop) plugin for an example.

## Frameworks
For documentation on using Bookshop with Jekyll, see the [jekyll-bookshop](plugins/jekyll-bookshop) plugin.

## Bookshop Renderer
The Bookshop renderer can be used to browse the components within your Bookshop. This package doesn't host a storybook-style application, but is designed to embed in any location on your website. The renderer can be found on npm at [@bookshop/renderer](https://www.npmjs.com/package/@bookshop/renderer).

>#### `package.json`
>```json
>---
>{
>    "scripts": {
>        "bookshop-dev": "bookshop -p 6061 -b ./component-library"
>    },
>    "devDependencies": {
>        "@bookshop/renderer": "^2.0.0-alpha.34"
>    }
>}
>```

With this setup, running `npm run bookshop-dev` will host the renderer javascript on port 6061. This can then be used on a page of your website with the following snippet:

>#### `components.html`
>```html
><div data-bookshop-renderer></div>
><script src="http://localhost:6061/bookshop.js"></script>
><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
>```
The `data-bookshop-renderer` element will be picked up and used to render a browsable component library from the directory specified in the `bookshop` command above. An example of this renderer can be seen at [full-fall.cloudvent.net/components](https://full-fall.cloudvent.net/components#all_bookshop:jekyll).

Further documentation on this package is to come. For now, the [bglw/bookshop-example](https://github.com/bglw/bookshop-example) repository serves as an example of further usage.
