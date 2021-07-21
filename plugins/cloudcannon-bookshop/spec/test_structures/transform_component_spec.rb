require_relative './test_helpers'

module CloudCannonBookshop
  describe Structures do

    it "should create pretty component names" do
      label = Structures.get_default_component_name("component/subcomponent/subcomponent.jekyll.html")
      expect(label).must_equal "Component Subcomponent"
    end

    it "should get component key" do
      key = Structures.get_component_key("a/b/c/c.svelte")
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
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("component/subcomponent/subcomponent.bookshop.toml", bookshop_config, {})
      
      expected_structure = [{
        "array_structures" => [ "content_blocks", "bookshop_components" ],
        "label" => "Unique Component",
        "description" => "Unique Component Description",
        "icon" => "nature_people",
        "tags" => [ "one", "two", "three" ],
        "value" => {
          "_bookshop_name" => "component/subcomponent",
        }
      }]
      diff = Hashdiff.diff(array_structure, expected_structure)

      expect(diff).must_equal []
    end

    it "should hide hidden components" do
      bookshop_toml = <<~EOS
        [component]
        _hidden = true
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("component/subcomponent/subcomponent.bookshop.toml", bookshop_config, {})
      
      expected_structure = [{
        "array_structures" => [],
        "label" => "Component Subcomponent",
        "value" => {
          "_bookshop_name" => "component/subcomponent",
        }
      }]
      diff = Hashdiff.diff(array_structure, expected_structure)

      expect(diff).must_equal []
    end

    it "should add select data" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        title = "Mr Fancy"
        alignment.select = ["left", "right"]
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should add a select data default" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        title = "Mr Fancy"
        alignment.select = ["left", "right"]
        alignment.default = "left"
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "_select_data" => {
            "alignments" => ["left", "right"]
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil,
            "alignment" => "left"
          }
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should pull through defaults" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        title.default = "Ananas"
        count_number.default = 4
        is_okay = true
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => "Ananas",
            "count_number" => 4,
            "is_okay" => true
          }
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should do nothing with preview" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        title.preview = ["a", "b", "c"]
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil
          }
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end


    it "should handle nested special keys" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        item.nest.default = "Things" #: Nested
        item.nest-two.select = ["a", "b"] #: Grape
        item.nest-two.default = "b"
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
              "nest-two" => "b"
            }
          }
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle nested comments" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        item.nest = "Things" #: Nested
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle deep nesting" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        item.a.b.c.d.e.f.g = false #: This is deep
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle mixed nesting" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        [props.author] #: Who wrote this?
        name.default = "Hume" #: Last name
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should create sub-array structures" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [[props.links]] #: Array of objects
        link_content = "I am a link" #: Inner comment
        link_number.default = 3 #: How Many?
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
                "label" => "Link",
                "icon" => "add_box",
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
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should not create a sub-structure for raw fields" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}
        raw_fields = ["links"]

        [[props.links]] #: Array of objects
        link_content = "I am a link" #: Inner comment
        link_number.default = 3 #: How Many?
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "links" => "Array of objects"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "links" => nil
          },
          "_array_structures" => {}
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should create a schema component" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}
        _template = true

        [props]
        title.default = "Ananas"
        count_number.default = 4
        author.name = "Tate"

        [[props.info.links]] #: Array of objects
        link_content = "I am a link" #: Inner comment
        link_number.default = 3 #: How Many?
        link_author.name = "Liam" #: Who made this link

        [[props.info.links.items]]
        clothing = "T-Shirt"
        color = "Purple"
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})

      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "links" => "Array of objects"
          },
          "_array_structures" => {
            "links" => {
              "values" => [{
                "label" => "Link",
                "icon" => "add_box",
                "_comments" => {
                  "link_content" => "Inner comment",
                  "link_number" => "How Many?",
                  "name" => "Who made this link"
                },
                "_select_data" => {},
                "_array_structures" => {
                  "items" => {
                    "values" => [{
                      "label" => "Item",
                      "icon" => "add_box",
                      "_comments" => {},
                      "_select_data" => {},
                      "_array_structures" => {},
                      "value"=> {
                        "clothing" => nil,
                        "color" => nil
                      }
                    }]
                  }
                },
                "value"=> {
                  "link_content" => nil,
                  "link_number" => 3,
                  "link_author" => {
                    "name" => nil
                  },
                  "items" => []
                }
              }]
            }
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => "Ananas",
            "count_number" => 4,
            "info" => {
              "links" => [],
            },
            "author" => {
              "name" => nil
            }
          }
        }
      ), TestHelpers.props_bookshop_output.merge!(
        {
          "label" => "Templated Testing Component",
          "_comments" => {
            "pre.__template_code" => "Helper liquid to run before the feilds below. Assigns and captures will be available",
            "info.links.__array_template" => "Array of objects",
            "info.links.link_content.__template" => "Inner comment",
            "info.links.link_number.__template" => "How Many?",
            "info.links.link_author.name.__template" => "Who made this link"
          },
          "value" => {
            "pre.__template_code" => "",
            "title.__template" => "{{ title }}",
            "count_number.__template" => "{{ count_number }}",
            "author.name.__template" => "{{ name }}",
            "info.links.__array_template" => "{% assign links = site.links %}",
            "info.links.link_content.__template" => "{{ link.link_content }}",
            "info.links.link_number.__template" => "{{ link.link_number }}",
            "info.links.link_author.name.__template" => "{{ link.name }}",
            "info.links.items.__array_template" => "{% assign items = link.items %}",
            "info.links.items.clothing.__template" => "{{ item.clothing }}",
            "info.links.items.color.__template" => "{{ item.color }}",
            "_bookshop_name" => "a/b.__template"
          }
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []

      # Check that the order is preserved
      output_template_keys = array_structure[1]["value"].keys
      expect(output_template_keys).must_equal [
        "pre.__template_code",
        "_bookshop_name",
        "title.__template",
        "count_number.__template",
        "author.name.__template",
        "info.links.__array_template",
        "info.links.link_content.__template",
        "info.links.link_number.__template",
        "info.links.link_author.name.__template",
        "info.links.items.__array_template",
        "info.links.items.clothing.__template",
        "info.links.items.color.__template"
      ]
    end

    it "should preserve TOML comments" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        title = "This is the title" #: Type the title here please
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = [TestHelpers.props_bookshop_output.merge!(
        {
          "_comments" => {
            "title" => "Type the title here please"
          },
          "value" => {
            "_bookshop_name" => "a/b",
            "title" => nil
          }
        }
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end

    it "should handle a complex example" do
      bookshop_toml = <<~EOS
        #{TestHelpers.base_bookshop_config}

        [props]
        title = "This is the title"           #: Used for the slug
        big.default = false                   #: Whether to show the image or not
        image.preview = ["/a.png", "b.jpg"]   #: Used when big: true
        author.name = "Kubo"                  #: Original author
        author.position.default = "Good Dog"  #: Position in company

        [[props.sections]]                    #: Top level blog info
        section_name = "Stats"                #: Navigation Label
        alignment.select = ["left", "right"]  #: Useful to alternate
        alignment.default = "left"            #: This comment should be dropped
        [[props.sections.tag_items]]          #: Tags are used in search results
        tag_name.select = ["good", "great"]   #: Single word only
        color.default = "#407AFC"             #: Not used on mobile

        [props.category]                      #: Shown on archive pages
        label = "Popular"                     #: Search label
        weight_number = 10                    #: Higher weights bump post up in category
      EOS
      bookshop_config = Structures.parse_bookshop_toml(bookshop_toml)
      array_structure = Structures.transform_component("a/b/b.bookshop.toml", bookshop_config, {})
      
      expected_structure = [TestHelpers.props_bookshop_output.merge!(
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
                "label" => "Section",
                "icon" => "add_box",
                "_select_data" => {
                  "alignments" => ["left", "right"]
                },
                "_comments" => {
                  "section_name" => "Navigation Label",
                  "alignment" => "Useful to alternate",
                  "tag_items" => "Tags are used in search results"
                },
                "_array_structures" => {
                  "tag_items" => {
                    "values" => [{
                      "label" => "Tag Item",
                      "icon" => "add_box",
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
                  "alignment" => "left",
                  "tag_items" => []
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
      )]

      diff = Hashdiff.diff(expected_structure, array_structure)
      expect(diff).must_equal []
    end
    
    make_my_diffs_pretty!
  end
end