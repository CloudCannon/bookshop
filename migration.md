# New theme connector
As at 31st August 2020 

# Installation

## Theme connection
Steps:
1. Run `npm init` in your jekyll theme to initialise a package.json
2. Run `npm i -D @bookshop/jekyll-extract` to add the new jekyll extractor
3. In the `scripts` block of package.json add the following script:
```
"watch": "COMPONENT_LIB='../path/to/bookshop' jekyll-extract"
```

4. Edit `spec.files` in your theme-name.gemspec file to match the following:
```
spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_bookshop|_sass|LICENSE|README|_config\.yml)!i) }
```
Specifically, this is adding `_bookshop` to the list of theme files when building a gem. 

You may now run `npm run watch` in your theme directory to automatically build bookshop components into the theme.

## Site connection
Steps:
1. Within the `group :jekyll_plugins do` section of your site's `Gemfile` add the following:
```
gem "jekyll-watch", :git => "https://github.com/cloudcannon/jekyll-watch", :branch => "master"
gem "jekyll-bookshop", "~> 1.1"
```

Now running `bundle exec jekyll serve` will also watch the theme directory (and thus the built bookshop directory).

# Usage

## Development

- Run `bundle exec jekyll serve` in your jekyll site to serve the site and rebuild changes
- Run `npm run watch` in your theme to watch bookshop and rebuild components
- Run `npm start` in your bookshop to serve the storybook app

Automatically running this stack is something we can look at in the future.

### Using components

To use a component from the bookshop, use the component tag:
```
{% component link text="Go" href="/go" %}
```
The jekyll-bookshop plugin will do the work of locating and including that component. At this stage all directories are ignored, so components are referenced purely by their name. This **will** change in the future, and you will have to update a buncha stuff. Sorry.

### Including styles

To include the styles from the bookshop, add the following somewhere in your theme scss:
```
@import 'bookshop'
```
Again, the jekyll-bookshop plugin will do the work of connecting this. This line will include everything from your bookshop, including mixins & variables.

## Deploying

Nothing special needs to be done for deployment. The change you made to `spec.files` in your theme means that your bookshop components will be bundled with the theme, and the jekyll-bookshop plugin is environment agnostic, so it should all just work™️.
