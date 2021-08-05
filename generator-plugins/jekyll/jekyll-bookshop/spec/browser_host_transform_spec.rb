# frozen_string_literal: true

require_relative "./helpers/test_helpers"

module JekyllBookshop
  describe BrowserTag do

    it "should handle the bare port" do
      host = BrowserTag.transformHostString("8545")
      target = "http://localhost:8545/bookshop.js"
      expect(host).must_equal target
    end

    it "should handle the colon-ed port" do
      host = BrowserTag.transformHostString(":8777")
      target = "http://localhost:8777/bookshop.js"
      expect(host).must_equal target
    end

    it "should handle a full localhost" do
      host = BrowserTag.transformHostString("localhost:8777")
      target = "http://localhost:8777/bookshop.js"
      expect(host).must_equal target
    end

    it "should handle an absolute path" do
      host = BrowserTag.transformHostString("/assets/b.js")
      target = "/assets/b.js"
      expect(host).must_equal target
    end

    it "should handle adding a protocol" do
      host = BrowserTag.transformHostString("localhost:6745/bookshop.js")
      target = "//localhost:6745/bookshop.js"
      expect(host).must_equal target
    end

    make_my_diffs_pretty!
  end
end
