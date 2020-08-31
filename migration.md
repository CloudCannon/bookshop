# New theme connector
As at 30th August 2020 

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
1. Add a new file in your site's `_plugins` folder named `bookshop.rb` containing the following: (pending gem publish)
```
require "jekyll"
require 'pathname'

module ComponentLib
  class Tag < Jekyll::Tags::IncludeTag
    def initialize(tag_name, markup, tokens)
      cname = markup.strip.partition(" ").first
      tag = markup.strip.partition(" ").last
      markup = "#{cname}.jekyll.html #{tag}"
      puts markup
      super
    end

    def tag_includes_dirs(context)
      Array(Pathname.new(context['site']['source'] + '/_bookshop/components').cleanpath.to_s).freeze
    end
  end
end

Liquid::Template.register_tag("component", ComponentLib::Tag)
```

2. Within the `group :jekyll_plugins do` group of your site's `Gemfile` add the following gem: (pending gem publish)
`gem "jekyll-watch", :git => "https://github.com/bigelowcc/jekyll-watch", :branch => "master"`