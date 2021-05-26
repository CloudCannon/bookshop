require_relative './test_helpers'

module Bookshop
  describe ArrayStructures do

    it "should create pretty component names" do
      label = ArrayStructures.get_story_name("component/subcomponent/subcomponent.jekyll.html")
      expect(label).must_equal "Component Subcomponent"
    end

    it "should get component key" do
      key = ArrayStructures.get_component_type("a/b/c/c.svelte")
      expect(key).must_equal "a/b/c"
    end
    
    it "should merge component definitions" do
      bookshop_toml = <<~EOS
        [component]
        array_structures = [ "content_blocks" ]
        label = "Unique Component"
        description = "Unique Component Description"
        icon = "nature_people"
        tags = [ "one", "two", "three" ]
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("component/subcomponent/subcomponent.bookshop.toml", bookshop_config, {})
      
      expected_structure = {
        "array_structures" => [ "content_blocks", "bookshop_components" ],
        "label" => "Unique Component",
        "description" => "Unique Component Description",
        "icon" => "nature_people",
        "tags" => [ "one", "two", "three" ],
        "value" => {
          "_bookshop_name" => "component/subcomponent",
        }
      }
      diff = Hashdiff.diff(array_structure, expected_structure)

      expect(diff).must_equal []
    end

    it "should hide hidden components" do
      bookshop_toml = <<~EOS
        [component]
        _hidden = true
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("component/subcomponent/subcomponent.bookshop.toml", bookshop_config, {})
      
      expected_structure = {
        "array_structures" => [],
        "label" => "Component Subcomponent",
        "value" => {
          "_bookshop_name" => "component/subcomponent",
        }
      }
      diff = Hashdiff.diff(array_structure, expected_structure)

      expect(diff).must_equal []
    end

    it "should add select data" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        title = "Mr Fancy"
        alignment.select = ["left", "right"]
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_select_data" => {
            "alignments" => ["left", "right"]
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil,
            "alignment" => nil
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should pull through defaults" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        title.default = "Ananas"
        count_number.default = 4
        is_okay = true
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => "Ananas",
            "count_number" => 4,
            "is_okay" => true
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should do nothing with preview" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        title.preview = ["a", "b", "c"]
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end


    it "should handle nested special keys" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        item.nest.default = "Things" #: Nested
        item.nest-two.select = ["a", "b"] #: Grape
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "nest" => "Nested",
            "nest-two" => "Grape"
          },
          "_select_data" => {
            "nest-twos" => ["a", "b"]
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "item" => {
              "nest" => "Things",
              "nest-two" => nil
            }
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle nested comments" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        item.nest = "Things" #: Nested
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "nest" => "Nested"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "item" => {
              "nest" => nil
            }
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle deep nesting" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        item.a.b.c.d.e.f.g = false #: This is deep
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "g" => "This is deep"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "item" => {
              "a" => {
                "b" => {
                  "c" => {
                    "d" => {
                      "e" => {
                        "f" => {
                          "g" => false
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle mixed nesting" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        [props.author] #: Who wrote this?
        name.default = "Hume" #: Last name
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "author" => "Who wrote this?",
            "name" => "Last name"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "author" => {
              "name" => "Hume"
            }
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should create sub-array structures" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [[props.links]] #: Array of objects
        link_content = "I am a link" #: Inner comment
        link_number.default = 3 #: How Many?
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "links" => "Array of objects"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "links" => []
          },
          "_array_structures" => {
            "links" => {
              "values" => [{
                "_comments" => {
                  "link_content" => "Inner comment",
                  "link_number" => "How Many?"
                },
                "_select_data" => {},
                "_array_structures" => {},
                "value"=> {
                  "link_content" => nil,
                  "link_number" => 3
                }
              }]
            }
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should preserve TOML comments" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        title = "This is the title" #: Type the title here please
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "title" => "Type the title here please"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle a complex example" do
      bookshop_toml = <<~EOS
        #{TestHelpers.props_bookshop_config}

        [props]
        title = "This is the title"           #: Used for the slug
        big.default = false                   #: Whether to show the image or not
        image.preview = ["/a.png", "b.jpg"]   #: Used when big: true
        author.name = "Kubo"                  #: Original author
        author.position.default = "Good Dog"  #: Position in company

        [[props.sections]]                    #: Top level blog info
        section_name = "Stats"                #: Navigation Label
        alignment.select = ["left", "right"]  #: Useful to alternate
        [[props.sections.tags]]               #: Tags are used in search results
        tag_name.select = ["good", "great"]   #: Single word only
        color.default = "#407AFC"             #: Not used on mobile

        [props.category]                      #: Shown on archive pages
        label = "Popular"                     #: Search label
        weight_number = 10                    #: Higher weights bump post up in category
      EOS
      bookshop_config = ArrayStructures.parse_bookshop_toml(bookshop_toml)
      array_structure = ArrayStructures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "title" => "Used for the slug",
            "big" => "Whether to show the image or not",
            "image" => "Used when big: true",
            "name" => "Original author",
            "position" => "Position in company",
            "sections" => "Top level blog info",
            "category" => "Shown on archive pages",
            "label" => "Search label",
            "weight_number" => "Higher weights bump post up in category"
          },
          "_array_structures" => {
            "sections" => {
              "values" => [{
                "_select_data" => {
                  "alignments" => ["left", "right"]
                },
                "_comments" => {
                  "section_name" => "Navigation Label",
                  "alignment" => "Useful to alternate",
                  "tags" => "Tags are used in search results"
                },
                "_array_structures" => {
                  "tags" => {
                    "values" => [{
                      "_select_data" => {
                        "tag_names" => ["good", "great"]
                      },
                      "_comments" => {
                        "tag_name" => "Single word only",
                        "color" => "Not used on mobile"
                      },
                      "_array_structures" => {},
                      "value" => {
                        "tag_name" => nil,
                        "color" => "#407AFC"
                      }
                    }]
                  }
                },
                "value" => {
                  "section_name" => nil,
                  "alignment" => nil,
                  "tags" => []
                }
              }]
            }
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil,
            "big" => false,
            "image" => nil,
            "author" => {
              "name" => nil,
              "position" => "Good Dog"
            },
            "sections" => [],
            "category" => {
              "label" => nil,
              "weight_number" => nil
            }
          }
        }
      )

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end
    
    make_my_diffs_pretty!
  end
end