# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("lib", __dir__)
require "jekyll-bookshop/version"

Gem::Specification.new do |spec|
  spec.name          = "jekyll-bookshop"
  spec.version       = JekyllBookshop::VERSION
  spec.authors       = ["CloudCannon"]
  spec.email         = ["support@cloudcannon.com"]
  spec.homepage      = "https://github.com/cloudcannon/bookshop"
  spec.summary       = "A Jekyll plugin to load components from bookshop"

  spec.files         = `git ls-files app lib`.split("\n")
  spec.platform      = Gem::Platform::RUBY
  spec.require_paths = ["lib"]
  spec.license       = "MIT"

  spec.add_dependency "jekyll", ">= 3.7", "< 5.0"
  spec.add_dependency "dry-inflector", ">= 0.1", "< 1.0"
  spec.add_development_dependency "rubocop", "~> 0.80"
  spec.add_development_dependency "rubocop-jekyll", "~> 0.11"
end