# frozen_string_literal: true

require_relative "../helpers/test_helpers"

module CloudCannonJekyllBookshop
  describe LiveTag do
    LIVE_SETUP = begin
      @site = TestHelpers.setup_site({})
    end

    it "should initialize a new BookshopLive" do
      output_file = TestHelpers.read_output_file("index.html")

      target = "new window.BookshopLive()"
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    it "should set the script source" do
      output_file = TestHelpers.read_output_file("index.html")

      target = "script.src = `/.cloudcannon/bookshop-live.js`"
      expect(output_file).must_match %r!#{Regexp.quote(target)}!
    end

    make_my_diffs_pretty!
  end
end
