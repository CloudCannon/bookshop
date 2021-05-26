require_relative './test_helpers'

module Bookshop
  describe ArrayStructures do

    it "should rewrite a plain comment" do
      bookshop_toml = "blog = false #: Comment on a boolean"
      expected_toml = <<~EOS.chomp
        blog--bookshop_comment = "Comment on a boolean"
        blog = false #: Comment on a boolean
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should rewrite a string comment" do
      bookshop_toml = "blog = \"Blog Title\" #: Comment on a string"
      expected_toml = <<~EOS.chomp
        blog--bookshop_comment = "Comment on a string"
        blog = "Blog Title" #: Comment on a string
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should rewrite a nested comment" do
      bookshop_toml = "blog.title = \"Blog Title\" #: Nested comment"
      expected_toml = <<~EOS.chomp
        blog.title--bookshop_comment = "Nested comment"
        blog.title = "Blog Title" #: Nested comment
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should not rewrite a non-comment hashtag" do
      bookshop_toml = "color = \"#407AFC\""
      expected_toml = "color = \"#407AFC\""
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should pick up a second hashtag after a non-comment hashtag" do
      bookshop_toml = "color = \"#407AFC\" #: Color comment"
      expected_toml = <<~EOS.chomp
        color--bookshop_comment = "Color comment"
        color = "#407AFC" #: Color comment
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should rewrite a commented array" do
      bookshop_toml = "links = [\"a\", \"b\"] #: Array Comment"
      expected_toml = <<~EOS.chomp
        links--bookshop_comment = "Array Comment"
        links = [\"a\", \"b\"] #: Array Comment
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should rewrite a heading" do
      bookshop_toml = <<~EOS.chomp
        [thing.inner] #: Hello from a heading
      EOS
      expected_toml = <<~EOS.chomp
        [thing.inner] #: Hello from a heading
        --bookshop_comment = "Hello from a heading"
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end

    it "should rewrite an array heading" do
      bookshop_toml = <<~EOS.chomp
        [[thing.inner]] #: Hello from an array heading
      EOS
      expected_toml = <<~EOS.chomp
        [[thing.inner]] #: Hello from an array heading
        --bookshop_comment = "Hello from an array heading"
      EOS
      rewritten_toml = ArrayStructures.rewrite_bookshop_toml(bookshop_toml)
      expect(rewritten_toml).must_equal expected_toml
    end
    
    it "should preserve comments in a TOML file" do
      bookshop_toml = <<~EOS
      [props]
      blog = false                #: Comment on a boolean
      lr.select = ["l", "r"]      #: Comment on a select
      
      [props.author]              #: Comment on an object
      name = "Kubo"               #: Comment within an object
      
      [[props.links]]             #: Comment on an array structure
      content = "I am a link"     #: Comment within an array structure
      EOS
      array_structure = ArrayStructures.parse_bookshop_toml(bookshop_toml)

      expected_structure = {
        "props" => {
          "blog" => false,
          "blog--bookshop_comment" => "Comment on a boolean",
          "lr" => {
            "select" => ["l", "r"],
            "select--bookshop_comment" => "Comment on a select"
          },
          "author" => {
            "--bookshop_comment" => "Comment on an object",
            "name" => "Kubo",
            "name--bookshop_comment" => "Comment within an object"
          },
          "links" => [
            {
              "--bookshop_comment" => "Comment on an array structure",
              "content" => "I am a link",
              "content--bookshop_comment" => "Comment within an array structure"
            }
          ]
        }
      }
      diff = Hashdiff.diff(array_structure, expected_structure)
      
      expect(diff).must_equal []
    end
    
    make_my_diffs_pretty!
  end
end
