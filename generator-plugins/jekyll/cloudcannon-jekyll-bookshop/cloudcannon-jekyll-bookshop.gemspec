# frozen_string_literal: true

require_relative 'lib/cloudcannon-jekyll-bookshop/version'

Gem::Specification.new do |spec|
  spec.name          = "cloudcannon-jekyll-bookshop"
  spec.version       = CloudCannonJekyllBookshop::VERSION
  spec.authors       = ["Liam Bigelow"]
  spec.email         = ["liam@cloudcannon.com"]
  spec.homepage      = "https://github.com/cloudcannon/bookshop"
  spec.summary       = "REMOVED: See the https://github.com/cloudcannon/bookshop migration guides"

  spec.required_ruby_version = Gem::Requirement.new(">= 2.3.0")

  # Specify which files should be added to the gem when it is released.
  spec.files = Dir['**/*'].reject { |f| f.match(%r{^(test|spec|features)}) }

  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
  spec.license       = "MIT"
end
