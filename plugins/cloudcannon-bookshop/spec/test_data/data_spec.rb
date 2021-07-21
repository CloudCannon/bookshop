require_relative './test_helpers'

module CloudCannonBookshop
  describe SiteData do
    SETUP = begin
      @site = TestHelpers.fixture_site({})
      @site.read
      @site.process
    end
    
    it "should not crash I guess" do
      output_data = JSON.parse TestHelpers.read_output_file("_cloudcannon/site-data.json")

      data_diff = Hashdiff.diff(output_data.dig("site", "data", "labels", 2), {
        "text" => "Data File Three"
      })
      expect(data_diff).must_equal []

      collection_diff = Hashdiff.diff(output_data.dig("site", "posts", 1), {
        "draft"=>false,
        "categories"=>[],
        "title"=>"Hello World",
        "image"=>"https://placekitten.com/120/120",
        "date"=>"2021-01-01 00:00:00 +1300",
        "slug"=>"hello-world",
        "ext"=>".md",
        "tags"=>[],
        "excerpt"=>"<h1 id=\"hello-world\">Hello World</h1>\n",
        "content"=>"<h1 id=\"hello-world\">Hello World</h1>\n",
        "url"=>"/posts/2021-01-01-hello-world.html",
        "relative_path"=>"_posts/2021-01-01-hello-world.md",
        "permalink"=>nil
      })
      expect(collection_diff).must_equal []
    end
    
    make_my_diffs_pretty!
  end
end
