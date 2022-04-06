# frozen_string_literal: true

require_relative "./helpers/test_helpers"

module JekyllBookshop
  describe Tag do
    RENDERER_SETUP = begin
      @site = TestHelpers.setup_site({})
    end

    it "should render the bookshop browser element" do
      output_file = TestHelpers.read_output_file("index.html")

      target = "<div data-bookshop-browser=\"\"></div>"
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should render the bookshop browser dependencies" do
      output_file = TestHelpers.read_output_file("index.html")

      target = "<script src=\"http://localhost:30775/bookshop.js\"></script>"
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should render the initialization snippet" do
      output_file = TestHelpers.read_output_file("index.html")

      target = "new window.BookshopBrowser("
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    make_my_diffs_pretty!
  end
end
