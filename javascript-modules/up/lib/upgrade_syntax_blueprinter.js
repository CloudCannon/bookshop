import pluralize from "pluralize";

// `blueprint` represents the current object we're working on within the blueprint, recursively.
// If we're in a deeper call, `currentBlueprintKey` represents which key the object we're working on was.
//    (This is needed to set something like the component-wide inputs config correctly)
// `inputs` is our component-wide inputs config — this is a flat list of keys
// `preview` is an identical structure to the current `blueprint`
//    but here we should make modifications to reflect the preview value of keys 
//    (where `blueprint` contains the defaults)
export const buildNewSyntaxFromOld = (blueprint, currentBlueprintKey, inputs = {}, preview = {}) => {
    if (blueprint && Array.isArray(blueprint)) {
        const return_value = {
            b: blueprint.map((o, i) => {
                const { b, p } = buildNewSyntaxFromOld(o, currentBlueprintKey, inputs, preview[i]);
                if (p === undefined) preview.splice(i, 1);
                return b;
            }),
            p: preview.length ? preview : undefined
        };
        if (typeof return_value.b[0] === "object" && !Array.isArray(return_value.b[0])) {
            // De-dupe blueprint arrays since the preview is now in the preview object
            return_value.b = [return_value.b[0]];
        }
        return return_value;
    }
    if (!blueprint || typeof blueprint !== "object") {
        return { b: blueprint, p: preview };
    }

    const comment = GetCommentFromObject(blueprint);
    if (comment) {
        inputs[currentBlueprintKey] = {
            ...(inputs[currentBlueprintKey] || {}),
            comment
        };
    }

    let is_reserved_object = false;

    let return_value = { b: blueprint, p: preview };

    if (Object.hasOwnProperty.call(blueprint, "instance")) {
        is_reserved_object = true;
        // Ideally we would preview a value to match, but that's an excercise for the reader
        return_value = { b: "", p: undefined };

        inputs[currentBlueprintKey] = {
            ...(inputs[currentBlueprintKey] || {}),
            instance_value: blueprint["instance"]
        };
    }

    if (Object.hasOwnProperty.call(blueprint, "select")) {
        const value = blueprint["select"];
        if (Array.isArray(value)) {
            is_reserved_object = true;
            const is_naming_convention_multiselect = pluralize(currentBlueprintKey) === currentBlueprintKey;

            // Change: nulling selects is weird — blueprint them as their first value
            return_value = is_naming_convention_multiselect
                ? { b: [value[0]], p: undefined }
                : { b: value[0], p: undefined };

            inputs[currentBlueprintKey] = {
                ...(inputs[currentBlueprintKey] || {}),
                type: is_naming_convention_multiselect ? "multiselect" : "select",
                options: {
                    values: value
                }
            };
        }
    }

    if (Object.hasOwnProperty.call(blueprint, "preview") || Object.hasOwnProperty.call(blueprint, "default")) {
        is_reserved_object = true;
        // If this is the default value, we can put it in the blueprint and delete the preview
        return_value = { b: blueprint["default"] ?? blueprint["preview"], p: undefined };
    }

    if (is_reserved_object) return TidyEmptyValues(return_value);

    for (let [key, value] of Object.entries(blueprint)) {
        if (/--bookshop_comment/.test(key)) {
            delete blueprint[key] && delete preview[key];
            const base_key = key.split(/--bookshop_comment/)[0];
            if (base_key.length) {
                inputs[base_key] = {
                    ...(inputs[base_key] || {}),
                    comment: value
                };
            };
            continue;
        }

        if (typeof value === "boolean" || typeof value === "number") {
            // No need to preview booleans since they remain in the blueprint
            // Change: we'll keep numbers in the blueprint since they're weirder to null
            delete preview[key];
            continue;
        }

        if (typeof value === "string") {
            // Strings are blanked in the blueprint and inserted into the preview object
            blueprint[key] = "";
            preview[key] = value;
            continue;
        }

        if (typeof value === "object") {
            const { b, p } = buildNewSyntaxFromOld(blueprint[key], key, inputs, preview[key]);
            blueprint[key] = b;
            preview[key] = p;
            if (p === undefined) delete preview[key];
        }
    }

    return TidyEmptyValues(return_value);
}

const GetCommentFromObject = (object) => {
    return object["--bookshop_comment"]
        || object["select--bookshop_comment"]
        || object["preview--bookshop_comment"]
        || object["default--bookshop_comment"]
}

const TidyEmptyValues = (input) => {
    if (typeof input.p === "object" && Object.keys(input.p).length === 0) {
        return { ...input, p: undefined };
    }
    return input;
}