let changeCase = require("change-case");

/**
 * Turn TOML fields into @storybook/controls argTypes
 */
const propsToArgTypes = (props) => {
  if (!props) return {};
  let argTypes = {};
  Object.entries(props).map(([key, val]) => {
    if (/--doc/.test(key)) return;
    let propData = typeFromVal(key, val);
    for (let item of propData) {
      argTypes[item.key] = {
        control: {
          type: item.name,
          options: item.options || null,
        },
        name: item.label || item.key,
        description: findDocForProp(
          item.rawKey || item.key,
          item.rawOptions,
          props
        ),
        defaultValue: "",
      };
    }
  });
  return argTypes;
};

/**
 * Turn TOML fields into @storybook/controls args
 */
const propsToArgs = (props) => {
  if (!props) return {};
  let args = {};
  Object.entries(props).map(([key, val]) => {
    if (/--doc/.test(key)) return;
    let propData = typeFromVal(key, val);
    for (let item of propData) {
      args[item.key] = item.value;
    }
  });
  return args;
};

const typeFromVal = (key, val) => {
  if (typeof val === "undefined") {
    return [
      {
        name: "text",
        value: val,
        key: key,
      },
    ];
  }
  if (typeof val === "string") {
    return determineStringVal(key, val);
  }
  if (typeof val === "boolean") {
    return [
      {
        name: "boolean",
        value: val,
        key: key,
      },
    ];
  }
  if (typeof val === "number") {
    return [
      {
        name: "number",
        value: val,
        key: key,
      },
    ];
  }
  if (Array.isArray(val)) {
    return [
      {
        name: "array",
        value: val,
        key: key,
      },
    ];
  }
  if (Object.keys(val).length) {
    return determineObjectType(key, val);
  }
  return [
    {
      name: "text",
      value: val,
      key: key,
    },
  ];
};

const determineObjectType = (key, val) => {
  let rawKey = key;
  let splitKey = key.split("--"),
    enumType;
  if (splitKey.length == 1) splitKey[1] = "o";

  [key, enumType] = splitKey;

  if (enumType === "preview") enumType = "select";

  if (/^(select|radio|inline-radio)$/.test(enumType)) {
    return [
      {
        name: enumType,
        value: val[Object.keys(val).find((v) => v !== "--doc")],
        options: capitalizeKeys(val),
        rawOptions: val,
        key: key,
        rawKey: rawKey,
      },
    ];
  }

  if (/^(multi-select|check|inline-check)$/.test(enumType)) {
    return [
      {
        name: enumType,
        value: [val[Object.keys(val).find((v) => v !== "--doc")]],
        options: capitalizeKeys(val),
        rawOptions: val,
        key: key,
        rawKey: rawKey,
      },
    ];
  }

  if (enumType == "repeat" || enumType == "o") {
    let repeatControls = [];

    repeatControls.push({
      name: "radio",
      key: `${key}&&object-info-field`,
      rawKey: `${rawKey}&&object-info-field`,
      label: `${key}`,
      options: {},
    });

    for (let [controlKey, controlVal] of Object.entries(val)) {
      if (/--doc/.test(controlKey)) continue;
      let innerKeys = typeFromVal(controlKey, controlVal);
      for (let ik of innerKeys) {
        repeatControls.push({
          ...ik,
          key: `${key}&&${ik["key"]}`,
          rawKey: `${rawKey}&&${ik["key"]}`,
          label: `${enumType == "repeat" ? "🔁" : "↪️"} ${key}${
            enumType == "repeat" ? "[n]" : ""
          }.${ik["key"]}`,
        });
      }
    }
    if (enumType == "repeat") {
      repeatControls.push({
        name: "range",
        value: 3,
        key: `${key}&&repeat-count`,
        rawKey: `${rawKey}&&repeat-count`,
        label: `Number of ${key}`,
      });
    }
    return repeatControls;
  }

  return [
    {
      name: "object",
      value: val,
      key: key,
    },
  ];
};

/**
 * Try and guess what input type the string represents.
 */
const determineStringVal = (key, val) => {
  if (/#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})/i.test(val)) {
    return [
      {
        name: "color",
        value: val,
        key: key,
      },
    ];
  }
  if (val[0] === "{" || val[0] === "[") {
    return [
      {
        name: "object",
        value: val,
        key: key,
      },
    ];
  }
  return [
    {
      name: "text",
      value: val,
      key: key,
    },
  ];
};

/**
 * Capitalize keys in an object.
 * Use this when padding a set of options to storybook,
 * i.e. for a select box. Makes things prettier.
 */
const capitalizeKeys = (o) => {
  let output = {};
  for (let [key, val] of Object.entries(o)) {
    if (/--doc/.test(key)) continue;
    output[changeCase.capitalCase(key)] = val;
  }
  return output;
};

/**
 * When processing the TOML we turn comments into fields.
 * This function finds any of those fields if they exist.
 */
const findDocForProp = (key, options, props) => {
  key = key.replace(`&&object-info-field`, "&&");
  let docVal;

  if (options && Object.keys(options).length) {
    docVal = options[`--doc`];
    if (docVal) {
      return docVal;
    }
  }

  docVal = drillForProp(`${key}--doc`, props);
  if (docVal) {
    return docVal;
  }
  return "";
};

/**
 * Search for a prop deep within an object
 * @param  {String} key   Path to key e.g. "line.text.item"
 * @param  {Object} props Object to search
 */
function drillForProp(key, props) {
  return key.split("&&").reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, props || self);
}

module.exports = {
  propsToArgs,
  propsToArgTypes,
};
