# frozen_string_literal: true

require_relative 'lib/cloudcannon-jekyll-bookshop/version'

Gem::Specification.new do |spec|
  spec.name          = "cloudcannon-jekyll-bookshop"
  spec.version       = CloudCannonJekyllBookshop::VERSION
  spec.authors       = ["Liam Bigelow"]
  spec.email         = ["liam@cloudcannon.com"]
  spec.homepage      = "https://github.com/cloudcannon/bookshop"
  spec.summary       = "A Jekyll plugin to configure the CloudCannon CMS using bookshop TOML files"

  spec.required_ruby_version = Gem::Requirement.new(">= 2.3.0")

  # Specify which files should be added to the gem when it is released.
  spec.files = Dir['**/*'].reject { |f| f.match(%r{^(test|spec|features)}) }

  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
  spec.license       = "MIT"

  spec.add_dependency "jekyll", ">= 3.7", "< 5.0"
  spec.add_dependency "toml-rb", ">= 2.0", "< 3.0"
  spec.add_dependency "node-runner-temp-fix-windows", ">= 1.0", "< 2.0"
  spec.add_dependency "dry-inflector", ">= 0.1", "< 1.0"
  spec.add_development_dependency "cloudcannon-jekyll", ">= 2.0", "< 3.0"
  spec.add_development_dependency "rubocop", "~> 0.80"
  spec.add_development_dependency "rubocop-jekyll", "~> 0.11"
end
