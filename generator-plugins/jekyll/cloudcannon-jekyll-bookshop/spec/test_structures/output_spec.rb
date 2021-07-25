require_relative '../helpers/test_helpers'

module CloudCannonBookshop
  describe Structures do
    OUTPUT_SETUP = begin
      @site = TestHelpers.setup_site({})
    end
    
    it "should output array structures" do
      output_data = JSON.parse TestHelpers.read_output_file("_cloudcannon/info.json")
      
      info_diff = Hashdiff.diff(output_data.dig("_array_structures", "item_array_structure"), {
        "values" => [
          {
            "value" => {
              "_bookshop_name" => "item",
              "one" => nil,
              "two" => false,
              "three" => "three",
              "four" => [],
              "five" => "5"
            },
            "label" => "Item Label",
            "description" => "Item Description",
            "icon" => "flare",
            "tags" => ["Item Tag"],
            "_select_data" => {
              "fives" => ["5","five","V"]
            },
            "_array_structures" => {},
            "_comments" => {
              "one" => "One",
              "three" => "Three",
              "five" => "Five"
            }
          }
        ]
        })
        expect(info_diff).must_equal []
      end
      
      make_my_diffs_pretty!
    end
  end
  