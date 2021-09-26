# frozen_string_literal: true

require_relative "../../lib/jekyll-bookshop"
require "minitest/spec"
require "minitest/autorun"
require "hashdiff"
require "json"
require "minitest/reporters"
Minitest::Reporters.use!

TEST_DIR     = File.join(__dir__, "..")
SOURCE_DIR   = File.expand_path("fixture_site", TEST_DIR)
DEST_DIR     = File.expand_path("destination", TEST_DIR)

module JekyllBookshop
  class TestHelpers
    def self.clean(goodbye_dir)
      if goodbye_dir.include?(Dir.pwd) && File.exist?(goodbye_dir)
        Pathname.new(goodbye_dir).children.each(&:rmtree)
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
            "source"             => SOURCE_DIR,
            "destination"        => DEST_DIR,
            "disable_disk_cache" => true,
            "title"              => "Bookshop Website",
            "baseurl"            => "/documentation",
            "bookshop_locations" => [
              "../fixture_bookshop",
            ]
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
  end
end
