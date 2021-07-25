# frozen_string_literal: true

require "jekyll"
require_relative "./cloudcannon-jekyll-bookshop/output-site-data"
require_relative "./cloudcannon-jekyll-bookshop/structures"

Jekyll::Hooks.register :site, :after_init do |site|
  CloudCannonJekyllBookshop::Structures.build_structures(site)
end

Jekyll::Hooks.register :site, :post_write do |site|
  CloudCannonJekyllBookshop::SiteData.output(site)
end
