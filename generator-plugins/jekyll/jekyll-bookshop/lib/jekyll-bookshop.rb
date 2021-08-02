# frozen_string_literal: true

require "jekyll"
require "pathname"
require "dry/inflector"

require_relative "jekyll-bookshop/tags/bookshop-tag"
require_relative "jekyll-bookshop/tags/browser-tag"
require_relative "jekyll-bookshop/tags/style-tag"
require_relative "jekyll-bookshop/init-styles"
require_relative "jekyll-bookshop/site-data"

Liquid::Template.register_tag("bookshop", JekyllBookshop::Tag)
Liquid::Template.register_tag("bookshop_scss", JekyllBookshop::StyleTag)
Liquid::Template.register_tag("bookshop_browser", JekyllBookshop::BrowserTag)

Jekyll::Hooks.register :site, :after_init do |site|
  JekyllBookshop::Styles.open_bookshop(site)
end

Jekyll::Hooks.register :site, :post_render do |site|
  JekyllBookshop::SiteData.extract(site)
end
