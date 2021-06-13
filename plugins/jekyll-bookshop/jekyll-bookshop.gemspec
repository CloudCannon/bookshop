# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("lib", __dir__)
require "jekyll-bookshop/version"

Gem::Specification.new do |s|
  s.name          = "jekyll-bookshop"
  s.version       = JekyllBookshop::VERSION
  s.authors       = ["CloudCannon"]
  s.email         = ["support@cloudcannon.com"]
  s.homepage      = "https://github.com/cloudcannon/bookshop"
  s.summary       = "A Jekyll plugin to load components from bookshop"

  s.files         = `git ls-files app lib`.split("\n")
  s.platform      = Gem::Platform::RUBY
  s.require_paths = ["lib"]
  s.license       = "MIT"

  s.add_dependency "jekyll", ">= 3.7", "< 5.0"
  s.add_dependency "dry-inflector", ">= 0.1", "< 1.0"
end