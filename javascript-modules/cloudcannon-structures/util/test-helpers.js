const {RewriteTOML} = require('@bookshop/toml-narrator');
const TOML = require('@ltd/j-toml');

// Template tag to strip multline whitespace / indentation
global.f = s => s[0].replace(/^\s*\n?/mg, ``);

global.loadTestTOML = (s) => {
    return TOML.parse(RewriteTOML(s), 1.0, '\n', false);
}

global.base_bookshop_path = "component/subcomponent/subcomponent.bookshop.tomml";

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
    "tags": [ "one", "two", "three" ],
    "_select_data": {},
    "_array_structures": {},
    "_comments": {},
}
