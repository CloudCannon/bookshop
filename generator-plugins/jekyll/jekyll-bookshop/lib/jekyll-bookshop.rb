# frozen_string_literal: true

require "jekyll"
require "pathname"
require "dry/inflector"

require_relative "jekyll-bookshop/tags/bookshop-common-tag"
require_relative "jekyll-bookshop/tags/bookshop-include-tag"
require_relative "jekyll-bookshop/tags/bookshop-tag"
require_relative "jekyll-bookshop/tags/browser-tag"
require_relative "jekyll-bookshop/tags/component-browser-tag"
require_relative "jekyll-bookshop/tags/style-tag"
require_relative "jekyll-bookshop/opener"

Liquid::Template.register_tag("bookshop", JekyllBookshop::Tag)
Liquid::Template.register_tag("bookshop_include", JekyllBookshop::IncludeTag)
Liquid::Template.register_tag("bookshop_scss", JekyllBookshop::StyleTag)
Liquid::Template.register_tag("bookshop_browser", JekyllBookshop::BrowserTag)
Liquid::Template.register_tag("bookshop_component_browser", JekyllBookshop::ComponentBrowserTag)

Jekyll::Hooks.register :site, :after_init do |site|
  JekyllBookshop::Opener.open_bookshop(site)
end
