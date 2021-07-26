# frozen_string_literal: true

require_relative "./helpers/test_helpers"

module JekyllBookshop
  describe Tag do
    SETUP = begin
      @site = TestHelpers.setup_site({})
    end

    it "should render a direct component" do
      output_file = TestHelpers.read_output_file("index.html")

      target = '<h1 class="c-item">Item Test</h1>'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should work with interpolation and bind syntax" do
      output_file = TestHelpers.read_output_file("index.html")

      target = '<div class="c-block" data-l="Hello World" data-n="1950" ></div>'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should compile SCSS" do
      output_file = TestHelpers.read_output_file("index.css")

      target = "@media all, bookshop { .c-block { position: relative; } .c-item { color: pink; font-weight: 800; } }"
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    make_my_diffs_pretty!
  end
end
