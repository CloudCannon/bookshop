# frozen_string_literal: true

# Taken from jekyll/jekyll-mentions
# (Copyright (c) 2014 GitHub, Inc. Licensened under the MIT).

require_relative '../../lib/cloudcannon-bookshop'
require_relative '../../../jekyll-bookshop/lib/jekyll-bookshop'
require 'minitest/spec'
require "minitest/autorun"
require 'hashdiff'
require 'json'
require "minitest/reporters"
Minitest::Reporters.use!

TEST_DIR     = File.join(__dir__, "..")
SOURCE_DIR   = File.expand_path("fixture_site", TEST_DIR)
DEST_DIR     = File.expand_path("destination", TEST_DIR)

module CloudCannonBookshop
    class TestHelpers
        def self.fixture_site(config = {})
            Jekyll::Site.new(
              Jekyll::Utils.deep_merge_hashes(
                Jekyll::Utils.deep_merge_hashes(
                  Jekyll::Configuration::DEFAULTS,
                  "source"              => SOURCE_DIR,
                  "destination"         => DEST_DIR,
                  "disable_disk_cache"  => true
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
