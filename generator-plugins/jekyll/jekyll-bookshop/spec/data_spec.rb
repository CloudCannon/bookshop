# frozen_string_literal: true

require_relative "./helpers/test_helpers"

module JekyllBookshop
  describe Tag do
    DATA_SETUP = begin
      @site = TestHelpers.setup_site({})
    end

    it "should hydrate the site baseurl" do
      output_file = TestHelpers.read_output_file("index.html")

      target = 'baseurl="/documentation"'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should hydrate the site title" do
      output_file = TestHelpers.read_output_file("index.html")

      target = 'title="Bookshop Website"'
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    make_my_diffs_pretty!
  end
end
