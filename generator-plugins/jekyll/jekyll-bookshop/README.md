# Jekyll Bookshop
Jekyll bookshop is a plugin for rendering bookshop components from a Jekyll website.
This file documents the specifics of integrationg an existing bookshop with a Jekyll website. To see documentation on bookshop itself, see the [root README](/).

## Jekyll Configuration and Usage

Jekyll ingests bookshop via the this plugin. CloudCannon's editor is configured via the [bookshop-array-structures](plugins/bookshop-array-structures) plugin.
>#### `Gemfile`
>```ruby
>group :jekyll_plugins do
>  gem "jekyll-bookshop", ">= 2.0.0.pre.alpha"
>  gem "bookshop-array-structures", ">= 2.0.0.pre.alpha"
>end
>```

>#### `_config.yml`
>```ruby
>plugins:
>  - jekyll-bookshop
>  - bookshop-array-structures
>
>bookshop_locations:
>  - ../component-library
>```

To use components directly in a template, use the `{% bookshop %}` tag like you would an include.
>#### `index.html`
>```liquid
>...
><div class="hero">
>  {% bookshop hero title=page.title image=page.image %}
>  {% bookshop button label=page.cta_text link_url=page.cta_url %}
></div>
>...
>```

To use components as an editor in CloudCannon, define a front matter key that matches a key specified in a component's `structures` metadata. For example:

>#### `hero.bookshop.toml`
>```toml
>[component]
>structures = [ "content_blocks" ]
>```

>#### `index.html`
>```liquid
>---
>content_blocks:
>---
>
>{% for block in page.content_blocks %}
>    {% bookshop {{block._bookshop_name}} bind=block %}
>{% endfor %}
>```

>ℹ️ _Bookshop tags can use the `bind=` parameter, which works like the spread operator in Javascript. Here, all keys within the object `block` are unwrapped and passed to the component directly. If you're used to a framework like Svelte, this is the equivalent of `<Component {...props} />`_

Once an editor has added a component within the CMS, the index file might look something like the following:
>#### `index.html`
>```liquid
>---
>content_blocks:
>  - _bookshop_name: hero
>    title: Hello World
>    image: /uploads/hero.png
>---
>
>{% for block in page.content_blocks %}
>    {% bookshop {{block._bookshop_name}} bind=block %}
>{% endfor %}
>```

## Bookshop Jekyll Templates
Let's look at an example `button.jekyll.html` file.
```
components/
└─ button/
   └─ button.jekyll.html
```
These files are namespaced for the static site generator when the filetype is ambiguous, which is why the file is `button.jekyll.html` and not `button.html`. Beyond the naming convention, these files are what you would expect when working with Jekyll. Our `button.jekyll.html` file might look like:
```hbs
<a class="c-button" href="{{ include.link_url }}">{{ include.text }}</a>
```
This looks like a normal Jekyll / Liquid include because it is. While bookshop provides developer tooling, the website plugin only serves to tell Jekyll where to find component files. Loading and parsing these files goes through the normal Jekyll include flow.

## Styles
Styles in bookshop use SCSS. This is currently implementation agnostic — the [Bookshop Renderer](#bookshop-renderer) uses Dart Sass, but Jekyll currently uses libsass.

SCSS files within a project do not need to be individually referenced, and are instead loaded in alphabetical order. This starts with all SCSS files within `bookshop/`, followed by all SCSS files within `components/`.

To import these files in Jekyll, the [jekyll-bookshop](plugins/jekyll-bookshop) plugin provides the tag `{% bookshop_scss %}` to be used in your main SCSS file. For example:

>#### `assets/main.scss`
>```text
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

## Accessing Site Data

A subset of site data is accessible to Bookshop components. Generally, site data and collection items should be available for use. To expose this data to the bookshop renderer, place the `{% bookshop_site_data %}` tag in your `<head>`. For example:

```liquid
<head>
    <title>Website Title</title>
    ...
    {% bookshop_site_data %}
</head>
```

With that, your bookshop components should be able to use `site.data.*` or `site.<collection>` when loaded in the bookshop renderer.  
For collections, some fields from Jekyll may be absent. The following are guaranteed to exist (if applicable):

- Anything in the front matter or Jekyll defaults
- `item.category`
- `item.tags`
- `item.date`
- `item.excerpt`
- `item.content`
- `item.url`
- `item.slug`
- `item.date`
- `item.relative_path`
- `item.permalink`
