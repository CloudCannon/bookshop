# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "example-bookshop-theme"
  spec.version       = "1.0.0"
  spec.authors       = ["Liam Bigelow"]
  spec.email         = ["liam@cloudcannon.com"]

  spec.summary       = "Example Bookshop Theme"
  spec.homepage      = "https://cloudcannon.com"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.0"

  spec.add_development_dependency "bundler", "~> 2.1.4"
  spec.add_development_dependency "rake", "~> 12.0"
end
