# Bookshop
Bookshop is a component development workflow for static websites.  
Bookshop currently supports Jekyll, and will support a wider array of static site generators in the near future.

Bookshop is currently in an alpha of version 2.0, so breaking changes to the following formats are likely before a general release.

## Configuration
A bookshop project is expected to have the following structure:
```
example-project/
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
By default, alphanumeric values in the TOML file are considered testing data, and new components created in a CMS interface will be initialized with empty inputs. If you do wish to give a field a default value, use `key.default`
```toml
title.default = "Hello World"
order_number.default = 50
featured = false
```
This will prepopulate the CMS. The default key is not required for boolean values, and the value specified in the TOML will be used as the default CMS value.  
>ℹ️ _A default value in the TOML file does not provide a default value to the component itself. It is solely used to configure editing interfaces._

#### Select Data
The field `select` is a special keyword in bookshop, which denotes a field as drawing from select data (a dropdown). This key expects an array of options that will be used to populate the CMS.
```toml
size.select = ["Large", "Medium", "Small"]
```
In this example, the component would then receive a property equivalent to `size="Large"` for the given selected value. Dropdowns are initialized empty, if you wish to also define a default selected state, combine the `select` and `default` keywords:
```toml
size.select = ["Large", "Medium", "Small"]
size.default = "Medium"
```

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

## Jekyll Configuration and Usage
_Note: In the future this section of the documentation will live in a separate location._

Jekyll ingests bookshop via the [jekyll-bookshop](plugins/jekyll-bookshop) plugin.
>#### `Gemfile`
>```ruby
>group :jekyll_plugins do
>  gem "jekyll-bookshop", ">= 2.0.0.pre.alpha"
>end
>```

>#### `_config.yml`
>```ruby
>plugins:
>  - jekyll-bookshop
>
>bookshop_locations:
>  - ../component-library
>```

To use components on the website, use the `{% bookshop %}` tag like you would an include.
>#### `index.html`
>```liquid
>...
><div class="hero">
>  {% bookshop hero title=page.title image=page.image %}
>  {% bookshop button label=page.cta_text link_url=page.cta_url %}
></div>
>...
>```

## Bookshop Jekyll Templates
_Note: In the future this section of the documentation will live in a separate location._

For our button example, this is focusing on the `.jekyll.html` file.
```
components/
└─ button/
   └─ button.jekyll.html
```
These files are namespaced for the static site generator when the filetype is ambiguous. Beyond the naming convention, these files are what you would expect when working with Jekyll. Our `button.jekyll.html` file might look like:
```hbs
<a href="{{ include.link_url }}">{{ include.text }}</a>
```
This looks like a normal Jekyll / Liquid include because it is. While bookshop provides developer tooling, the website plugin only serves to tell Jekyll where to find component files. Loading and parsing these files goes through the normal Jekyll include flow.

## Styles
Styles in bookshop use SCSS. This is currently implementation agnostic — the [Bookshop Renderer](#bookshop-renderer) uses Dart Sass, but the generator ingesting compoennts may use another implementation (i.e. Jekyll currently uses libsass).

SCSS files within a project do not need to be individually referenced, and are instead loaded in alphabetical order. This starts with all SCSS files in the `bookshop/` folder, followed by all SCSS files in the `components/` folder structure.

Importing these files is generator-specific. For Jekyll, the [jekyll-bookshop](plugins/jekyll-bookshop) plugin provides the tag `{% bookshop_scss %}` to be used in your main SCSS file. For example:
  

>#### `assets/main.scss`
>```scss
>---
># Front matter dashes for Jekyll to process the file
>---
>
>@import 'navigation.scss'; // Normal SCSS import
>
>{% bookshop_scss %} // Import all bookshop styles
>
>body {
>    font-family: sans-serif;
>}
>
>```


## Bookshop Renderer

## Using multiple bookshops