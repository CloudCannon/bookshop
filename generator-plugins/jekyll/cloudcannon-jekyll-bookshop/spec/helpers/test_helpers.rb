require_relative '../../lib/cloudcannon-bookshop'
require_relative '../../../jekyll-bookshop/lib/jekyll-bookshop'
require 'cloudcannon-jekyll'
require 'minitest/spec'
require 'minitest/autorun'
require 'hashdiff'
require 'json'
require "minitest/reporters"
Minitest::Reporters.use!

TEST_DIR     = File.join(__dir__, "..")
SOURCE_DIR   = File.expand_path("fixture_site", TEST_DIR)
DEST_DIR     = File.expand_path("destination", TEST_DIR)

module CloudCannonBookshop
  class TestHelpers
    def self.clean(goodbye_dir)
      if goodbye_dir.include?(Dir.pwd) && File.exist?(goodbye_dir)
        Pathname.new(goodbye_dir).children.each { |p| p.rmtree }
        Pathname.new(goodbye_dir).rmtree
      end
    end
    
    def self.setup_site(config = {})
      teardown_site
      site = fixture_site(config)
      site.read
      site.process
      site
    end
    
    def self.teardown_site
      clean(DEST_DIR)
    end
    
    def self.fixture_site(config = {})
      Jekyll::Site.new(
        Jekyll::Utils.deep_merge_hashes(
          Jekyll::Utils.deep_merge_hashes(
            Jekyll::Configuration::DEFAULTS,
            "source"              => SOURCE_DIR,
            "destination"         => DEST_DIR,
            "disable_disk_cache"  => true,
            "bookshop_locations"  => [
              "../fixture_bookshop"
            ],
            "collections"         => {
              "posts" => { 
                "output" => true,
                "permalink" => "/:collection/:name"
              }
            }
          ),
          config
        )
      )
    end
    
    def self.read_output_file(path)
      read_path = File.join(DEST_DIR, path)
      return false unless File.exist?(read_path)
      
      File.read(read_path).strip
    end
    
    def self.base_bookshop_config
      return <<~EOS
      [component]
      array_structures = [ "content_blocks" ]
      label = "Testing Component"
      description = "Description of testing component"
      icon = "nature_people"
      tags = [ "one", "two", "three" ]
      EOS
    end
    
    def self.base_bookshop_output
      return {
        "array_structures" => [ "content_blocks", "bookshop_components" ],
        "label" => "Testing Component",
        "description" => "Description of testing component",
        "icon" => "nature_people",
        "tags" => [ "one", "two", "three" ]
      }
    end
    
    def self.props_bookshop_output
      return base_bookshop_output.merge!(
        {
          "_comments" => {},
          "_select_data" => {},
          "_array_structures" => {}
        }
      )
    end
  end
end
