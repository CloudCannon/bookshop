require_relative 'lib/bookshop-array-structures/version'

Gem::Specification.new do |spec|
  spec.name          = "bookshop-array-structures"
  spec.version       = Bookshop::Arraystructures::VERSION
  spec.authors       = ["Tate"]
  spec.email         = ["tate@cloudcannon.com"]
  spec.summary       = "A Jekyll plugin to generate array structures from bookshop"

  spec.required_ruby_version = Gem::Requirement.new(">= 2.3.0")

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "jekyll", ">= 3.7", "< 5.0"
  spec.add_dependency "toml-rb", ">= 2.0", "< 3.0"
end
