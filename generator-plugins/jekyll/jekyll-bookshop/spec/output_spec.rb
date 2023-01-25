# frozen_string_literal: true

require_relative "./helpers/test_helpers"

module JekyllBookshop
  describe Tag do
    OUTPUT_SETUP = begin
      @site = TestHelpers.setup_site({})
    end

    it "should render a direct component" do
      output_file = TestHelpers.read_output_file("index.html")

      target = '<h1 class="c-item">Item Test</h1>'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should render a shared include" do
      output_file = TestHelpers.read_output_file("index.html")

      target = '<span data-helper="ruby-spec"></span>'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should work with interpolation and bind syntax" do
      output_file = TestHelpers.read_output_file("index.html")

      target = '<div class="c-block" data-l="Hello World" data-n="1950" ></div>'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should compile SCSS" do
      output_file = TestHelpers.read_output_file("index.css")

      target = "@media all, bookshop"
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should sort shared SCSS above component SCSS" do
      output_file = TestHelpers.read_output_file("index.css")

      expect(output_file).must_match %r!c-global.*c-block!m
    end

    make_my_diffs_pretty!
  end
end
