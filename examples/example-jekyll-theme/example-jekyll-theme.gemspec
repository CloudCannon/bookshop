# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "example-jekyll-theme"
  spec.version       = "0.1.0"
  spec.authors       = ["Liam Bigelow"]
  spec.email         = ["liam@cloudcannon.com"]

  spec.summary       = "Example theme integrating with @bookshop"
  spec.homepage      = "https://github.com/cloudcannon/bookshop.git"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_bookshop|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.1"
end
