require_relative '../lib/bookshop-array-structures'
require 'minitest/spec'
require 'minitest/autorun'
require 'hashdiff'
require 'json'
require "minitest/reporters"
Minitest::Reporters.use!

module Bookshop
    class TestHelpers

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

        def self.props_bookshop_config
            return <<~EOS
                [component]
                array_structures = [ "content_blocks" ]
                label = "Testing Component"
                description = "Description of testing component"
                icon = "nature_people"
                tags = [ "one", "two", "three" ]
            EOS
        end

        def self.props_bookshop_output
            return {
                "array_structures" => [ "content_blocks", "bookshop_components" ],
                "label" => "Testing Component",
                "description" => "Description of testing component",
                "icon" => "nature_people",
                "tags" => [ "one", "two", "three" ],
                "_comments" => {},
                "_select_data" => {},
                "_array_structures" => {}
            }
        end
    end
end