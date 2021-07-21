require_relative 'lib/cloudcannon-bookshop/version'

Gem::Specification.new do |spec|
  spec.name          = "cloudcannon-bookshop"
  spec.version       = CloudCannonBookshop::Arraystructures::VERSION
  spec.authors       = ["Liam Bigelow"]
  spec.email         = ["liam@cloudcannon.com"]
  spec.homepage      = "https://github.com/cloudcannon/bookshop"
  spec.summary       = "A Jekyll plugin to configure the CloudCannon CMS using bookshop TOML files"

  spec.required_ruby_version = Gem::Requirement.new(">= 2.3.0")

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
  spec.license       = "MIT"

  spec.add_dependency "jekyll", ">= 3.7", "< 5.0"
  spec.add_dependency "toml-rb", ">= 2.0", "< 3.0"
  spec.add_dependency "dry-inflector", ">= 0.1", "< 1.0"
end
