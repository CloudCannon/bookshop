# frozen_string_literal: true

require_relative "../helpers/test_helpers"

module CloudCannonBookshop
  describe Structures do
    it "should rewrite comments via node" do
      bookshop_toml = "a = \"#b\" #: c"
      expected_toml = <<~TOML.chomp
        a--bookshop_comment = "c"
        a = "#b" #: c
      TOML
      rewritten_toml = Structures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should preserve comments in a TOML file via node" do
      bookshop_toml = <<~TOML
        [props]
        blog = false                #: Comment on a boolean
        lr.select = ["l", "r"]      #: Comment on a select

        [props.author]              #: Comment on an object
        name = "Kubo"               #: Comment within an object

        [[props.links]]             #: Comment on an array structure
        content = "I am a link"     #: Comment within an array structure
      TOML
      array_structure = Structures.parse_bookshop_toml(bookshop_toml)

      expected_structure = {
        "props" => {
          "blog"                   => false,
          "blog--bookshop_comment" => "Comment on a boolean",
          "lr"                     => {
            "select"                   => %w(l r),
            "select--bookshop_comment" => "Comment on a select",
          },
          "author"                 => {
            "--bookshop_comment"     => "Comment on an object",
            "name"                   => "Kubo",
            "name--bookshop_comment" => "Comment within an object",
          },
          "links"                  => [
            {
              "--bookshop_comment"        => "Comment on an array structure",
              "content"                   => "I am a link",
              "content--bookshop_comment" => "Comment within an array structure",
            },
          ],
        },
      }
      diff = Hashdiff.diff(array_structure, expected_structure)

      expect(diff).must_equal []
    end

    make_my_diffs_pretty!
  end
end
