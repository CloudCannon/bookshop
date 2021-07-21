require "jekyll"
require_relative './cloudcannon-bookshop/output-site-data'
require_relative './cloudcannon-bookshop/structures'

Jekyll::Hooks.register :site, :after_init do |site|
  CloudCannonBookshop::Structures.build_structures(site)
end

Jekyll::Hooks.register :site, :post_write do |site|
  CloudCannonBookshop::SiteData.output(site)
end
