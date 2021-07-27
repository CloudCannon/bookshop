var pkg = require('./package.json');
// Pluralize is vendored for distribution to the generator plugins
const pluralize = require('./vendored-pluralize.js');

// Generates the bookshop key used to reference this component
// Turns "a/b/b.bookshop.toml" into "a/b"
const GetComponentKey = (componentPath) => {
    let base = componentPath.split(".")[0];
    let parts = base.split("/");
    const l = parts.length;
    if (l >= 2 && parts[l-1] === parts[l-2]) {
        parts.pop();
        base = parts.join("/");
    }
    return base;
}

const NiceLabel = (key) => {
    return key.split(/-|_|\//)
        .filter(part => part.length)
        .map(part => part[0].toUpperCase() + part.slice(1)).join(" ");
}

// Main function that takes in an entire Bookshop component structure
// and returns a set of structures to add to CloudCannon
const TransformComponent = (path, component) => {
    const result = {
        value: {
            _bookshop_name: GetComponentKey(path)
        },
        label: NiceLabel(GetComponentKey(path)), // Used as a fallback when no label is supplied inside [component]
        array_structures: [],
        ...component["component"]
    }
    if (component["props"]) {
        TransformComponentProps(component["props"], result, null);
    }
    if (!result["_hidden"] && !result["array_structures"].includes("bookshop_components")) {
        result["array_structures"].push("bookshop_components");
    }
    
    const results = [result];
    
    delete result["_hidden"];
    delete result["raw_fields"];
    
    return results;
}

// Recursive function for processing the [props] section of a bookshop component spec,
// and populating sub-structures, comments, select data, et cetera.
const TransformComponentProps = (props, structure, value_context) => {
    ["_select_data","_array_structures","_comments","value"].forEach(k => {
        structure[k] = structure[k] || {};
    });

    value_context = value_context || structure["value"];
    Object.entries(props).forEach(([key, value]) => {
        if (Object.hasOwnProperty.call(value_context, key)) return;

        if (Array.isArray(value)) {
            TransformArray(key, value, structure, value_context);
            return;
        }

        if (value && typeof value === "object") {
            TransformObject(key, value, structure, value_context);
            return;
        }

        if (value === true || value === false) {
            value_context[key] = value;
            return;
        }

        if (/--bookshop_comment/.test(key)) {
            const base_key = key.split(/--bookshop_comment/)[0];
            if (!base_key.length) return;
            structure["_comments"][base_key] = value;
            return;
        }

        value_context[key] = null;
    });
}

// Handle an object somewhere within the large props object
// If reserved bookshop keys lie within, the object is treated as a value
// Otherwise, recurse into it as a normal object
const TransformObject = (key, obj, structure, value_context) => {
    const comment = GetCommentFromObject(obj);
    if (comment) {
        structure["_comments"][key] = comment;
    }

    if (Object.hasOwnProperty.call(obj, "select")) {
        value_context[key] = obj["default"] ?? null;
        structure["_select_data"][pluralize(key)] = obj["select"]
        return
    }

    if (Object.hasOwnProperty.call(obj, "preview") || Object.hasOwnProperty.call(obj, "default")) {
        value_context[key] = obj["default"] ?? null;
        return
    }

    value_context[key] = {};
    TransformComponentProps(obj, structure, value_context[key]);
}

// Handle an array somewhere within the large props object
// If it is an object array, create a sub-structure based on the first array item
const TransformArray = (key, array, structure, value_context) => {
    if (array[0] && typeof array[0] === "object") {
        if (array[0]["--bookshop_comment"]) {
            structure["_comments"][key] = array[0]["--bookshop_comment"];
        }

        if (Array.isArray(structure["raw_fields"]) && structure["raw_fields"].includes(key)) {
            value_context[key] = null;
            return
        }

        const singular_title = NiceLabel(pluralize.singular(key));
        structure["_array_structures"][key] = {
            values: [{
                label: singular_title,
                icon: "add_box",
                value: {}
            }]
        }

        TransformComponentProps(array[0], 
            structure["_array_structures"][key]["values"][0], 
            structure["_array_structures"][key]["values"][0]["value"]);
    }
    value_context[key] = [];
}

const GetCommentFromObject = (object) => {
    return object["--bookshop_comment"]
    || object["select--bookshop_comment"]
    || object["preview--bookshop_comment"]
    || object["default--bookshop_comment"]
}

module.exports = {
    Version: () => pkg.version,
    TransformComponent,
    GetComponentKey,
    NiceLabel,
}
