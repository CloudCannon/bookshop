const Testables = require('./main');

test("should create pretty component names", () => {
  const label = Testables.NiceLabel(Testables.GetComponentKey(base_bookshop_path));
  expect(label).toBe("Component Subcomponent");
});

test("should get component key", () => {
  const key = Testables.GetComponentKey("a/b/c/c.svelte");
  expect(key).toBe("a/b/c");
});

test("should merge component definitions", () => {
  const bookshop_component = loadTestTOML(f`
  [component]
  array_structures = [ "content_blocks" ]
  label = "Unique Component"
  description = "Unique Component Description"
  icon = "nature_people"
  tags = [ "one", "two", "three" ]
  `);
  const bookshop_structure = Testables.TransformComponent(base_bookshop_path, bookshop_component)
  
  expect(bookshop_structure).toEqual([{
    "array_structures": [ "content_blocks", "bookshop_components" ],
    "label": "Unique Component",
    "description": "Unique Component Description",
    "icon": "nature_people",
    "tags": [ "one", "two", "three" ],
    "value": {
      "_bookshop_name": "component/subcomponent",
    }
  }]);
});

test("should hide hidden components", () => {
  const bookshop_component = loadTestTOML(f`
  [component]
  _hidden = true
  `);
  const bookshop_structure = Testables.TransformComponent(base_bookshop_path, bookshop_component)
  
  expect(bookshop_structure).toEqual([{
    "array_structures": [],
    "label": "Component Subcomponent",
    "value": {
      "_bookshop_name": "component/subcomponent",
    }
  }]);
});

test("should add select data", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  [props]
  title = "Mr Fancy"
  alignment.select = ["left", "right"]
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_select_data": {
        "alignments": ["left", "right"]
      },
      "value": {
        "_bookshop_name": "a/b",
        "title": null,
        "alignment": null
      }
    }
  ]);
});

test("should add a select data default", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  [props]
  title = "Mr Fancy"
  alignment.select = ["left", "right"]
  alignment.default = "left"
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_select_data": {
        "alignments": ["left", "right"]
      },
      "value": {
        "_bookshop_name": "a/b",
        "title": null,
        "alignment": "left"
      }
    }
  ]);
});

test("should pull through defaults", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  [props]
  title.default = "Ananas"
  count_number.default = 4
  is_okay = true
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "value": {
        "_bookshop_name": "a/b",
        "title": "Ananas",
        "count_number": 4,
        "is_okay": true
      }
    }
  ]);
});

test("should do nothing with preview", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  [props]
  title.preview = ["a", "b", "c"]
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "value": {
        "_bookshop_name": "a/b",
        "title": null
      }
    }
  ]);
});

test("should handle nested special keys", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  [props]
  item.nest.default = "Things" #: Nested
  item.nest-two.select = ["a", "b"] #: Grape
  item.nest-two.default = "b"
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "nest": "Nested",
        "nest-two": "Grape"
      },
      "_select_data": {
        "nest-twos": ["a", "b"]
      },
      "value": {
        "_bookshop_name": "a/b",
        "item": {
          "nest": "Things",
          "nest-two": "b"
        }
      }
    }
  ]);
});

test("should handle nested comments", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  
  [props]
  item.nest = "Things" #: Nested
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "nest": "Nested"
      },
      "value": {
        "_bookshop_name": "a/b",
        "item": {
          "nest": null
        }
      }
    }
  ]);
  
});


test("should handle deep nesting", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  
  [props]
  item.a.b.c.d.e.f.g = false #: This is deep
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "g": "This is deep"
      },
      "value": {
        "_bookshop_name": "a/b",
        "item": {
          "a": {
            "b": {
              "c": {
                "d": {
                  "e": {
                    "f": {
                      "g": false
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
  
});


test("should handle mixed nesting", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  
  [props]
  [props.author] #: Who wrote this?
  name.default = "Hume" #: Last name
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "author": "Who wrote this?",
        "name": "Last name"
      },
      "value": {
        "_bookshop_name": "a/b",
        "author": {
          "name": "Hume"
        }
      }
    }
  ]);
  
});


test("should create sub-array structures", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  
  [[props.links]] #: Array of objects
  link_content = "I am a link" #: Inner comment
  link_number.default = 3 #: How Many?
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "links": "Array of objects"
      },
      "value": {
        "_bookshop_name": "a/b",
        "links": []
      },
      "_array_structures": {
        "links": {
          "values": [{
            "label": "Link",
            "icon": "add_box",
            "_comments": {
              "link_content": "Inner comment",
              "link_number": "How Many?"
            },
            "_select_data": {},
            "_array_structures": {},
            "value": {
              "link_content": null,
              "link_number": 3
            }
          }]
        }
      }
    }
  ]);
  
});

test("should not create a sub-structure for raw fields", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  raw_fields = ["links"]
  
  [[props.links]] #: Array of objects
  link_content = "I am a link" #: Inner comment
  link_number.default = 3 #: How Many?
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "links": "Array of objects"
      },
      "value": {
        "_bookshop_name": "a/b",
        "links": null
      },
      "_array_structures": {}
    }
  ]);
  
});

test("should preserve TOML comments", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  
  [props]
  title = "This is the title" #: Type the title here please
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "title": "Type the title here please"
      },
      "value": {
        "_bookshop_name": "a/b",
        "title": null
      }
    }
  ]);
  
});


test("should handle a complex example", () => {
  const bookshop_component = loadTestTOML(base_bookshop_config + f`
  
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
  `);
  const bookshop_structure = Testables.TransformComponent("a/b/b.bookshop.toml", bookshop_component)
  
  expect(bookshop_structure).toEqual([
    {
      ...base_bookshop_output,
      "_comments": {
        "title": "Used for the slug",
        "big": "Whether to show the image or not",
        "image": "Used when big: true",
        "name": "Original author",
        "position": "Position in company",
        "sections": "Top level blog info",
        "category": "Shown on archive pages",
        "label": "Search label",
        "weight_number": "Higher weights bump post up in category"
      },
      "_array_structures": {
        "sections": {
          "values": [{
            "label": "Section",
            "icon": "add_box",
            "_select_data": {
              "alignments": ["left", "right"]
            },
            "_comments": {
              "section_name": "Navigation Label",
              "alignment": "Useful to alternate",
              "tag_items": "Tags are used in search results"
            },
            "_array_structures": {
              "tag_items": {
                "values": [{
                  "label": "Tag Item",
                  "icon": "add_box",
                  "_select_data": {
                    "tag_names": ["good", "great"]
                  },
                  "_comments": {
                    "tag_name": "Single word only",
                    "color": "Not used on mobile"
                  },
                  "_array_structures": {},
                  "value": {
                    "tag_name": null,
                    "color": "#407AFC"
                  }
                }]
              }
            },
            "value": {
              "section_name": null,
              "alignment": "left",
              "tag_items": []
            }
          }]
        }
      },
      "value": {
        "_bookshop_name": "a/b",
        "title": null,
        "big": false,
        "image": null,
        "author": {
          "name": null,
          "position": "Good Dog"
        },
        "sections": [],
        "category": {
          "label": null,
          "weight_number": null
        }
      }
    }
  ]);
  
});