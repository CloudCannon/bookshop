# frozen_string_literal: true

require_relative "../helpers/test_helpers"

module CloudCannonJekyllBookshop
  describe Structures do
    it "should have a matching narrator version vendored" do
      expected_ruby_v = Structures.tn_version.gsub(/-/, ".pre.")
      expect(expected_ruby_v).must_equal CloudCannonJekyllBookshop::VERSION
    end

    it "should have a matching structures version vendored" do
      expected_ruby_v = Structures.cs_version.gsub(/-/, ".pre.")
      expect(expected_ruby_v).must_equal CloudCannonJekyllBookshop::VERSION
    end

    make_my_diffs_pretty!
  end
end
