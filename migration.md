@@ -0,0 +1,47 @@
# New theme connector
As at 31st August 2020 

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

5. You may now run `npm run watch` in your theme directory to automatically build bookshop components into the theme.

## Site connection
Steps:
1. Within the `group :jekyll_plugins do` section of your site's `Gemfile` add the following:
```
gem "jekyll-watch", :git => "https://github.com/cloudcannon/jekyll-watch", :branch => "master"
gem "jekyll-bookshop", "~> 1.1"
```


# Done!

## Development

- Run `bundle exec jekyll serve` in your jekyll site to serve the site and rebuild changes
- Run `npm run watch` in your theme to watch bookshop and rebuild components
- Run `npm start` in your bookshop to serve the storybook app

Automatically running this stack is something we can look at in the future.
