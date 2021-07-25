# frozen_string_literal: true

require_relative "../helpers/test_helpers"

module CloudCannonBookshop
  describe Structures do
    it "should create pretty component names via node" do
      test_label = "component/subcomponent/subcomponent.jekyll.html"
      label = Structures.get_default_component_name(test_label)
      expect(label).must_equal "Component Subcomponent"
    end

    it "should get component key via node" do
      key = Structures.get_component_key("a/b/c/c.svelte")
      expect(key).must_equal "a/b/c"
    end

    it "should transform components via node" do
      bookshop_toml = <<~TOML
        #{TestHelpers.base_bookshop_config}

        [props]
        item.nest.default = "Things" #: Nested
        item.nest-two.select = ["a", "b"] #: Grape
        item.nest-two.default = "b"
      TOML
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config)

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "_comments"    => {
            "nest"     => "Nested",
            "nest-two" => "Grape",
          },
          "_select_data" => {
            "nest-twos" => %w(a b),
          },
          "value"        => {
            "_bookshop_name" => "a/b",
            "item"           => {
              "nest"     => "Things",
              "nest-two" => "b",
            },
          },
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    make_my_diffs_pretty!
  end
end
