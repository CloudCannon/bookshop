global.f = s => s[0].replace(/^\s*\n?/mg, ``);

global.base_bookshop_config = f`
[component]
array_structures = [ "content_blocks" ]
label = "Testing Component"
description = "Description of testing component"
icon = "nature_people"
tags = [ "one", "two", "three" ]
`;

global.base_bookshop_output = {
    "array_structures": [ "content_blocks", "bookshop_components" ],
    "label": "Testing Component",
    "description": "Description of testing component",
    "icon": "nature_people",
    "tags": [ "one", "two", "three" ]
}
