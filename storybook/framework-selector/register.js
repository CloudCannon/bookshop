// .storybook/my-addon/register.js

import React, { useState } from "react";
import { addons, types } from "@storybook/addons";
import { useArgs, useArgTypes } from "@storybook/api";

const ADDON_ID = "framework-selector";
const TOOL_ID = `${ADDON_ID}/tool`;

// give a unique name for the panel
const FrameworkSelector = () => {
  const [currFramework, setCurrFramework] = useState(null);
  const options = [];
  const argTypes = useArgTypes();
  const [args, updateArgs] = useArgs();
  if (args.framework && args.framework !== currFramework) {
    if (!currFramework) {
      setCurrFramework(args.framework);
    } else if (argTypes.framework.control.options.includes(currFramework)) {
      updateArgs({ framework: currFramework });
    }
  }

  if (argTypes.framework) {
    argTypes.framework.table = { disable: true };
    options.push(
      argTypes.framework.control.options.map((option) => (
        <option key={option}>{option}</option>
      ))
    );
  }
  if (options.length === 0) {
    options.push(<option key="None">None</option>);
  }
  return (
    <div
      style={{
        height: "calc(100% - 16px)",
        display: "flex",
        alignItems: "center",
        marginTop: "8px",
        marginBottom: "8px",
        marginLeft: "10px",
        paddingLeft: "10px",
        borderLeft: "1px solid rgba(0,0,0,.1)",
      }}
    >
      <p style={{ marginRight: "10px" }}> Bookshop Framework: </p>
      <select
        onChange={(e) => {
          setCurrFramework(e.target.value);
          updateArgs({ framework: e.target.value });
        }}
      >
        {options}
      </select>
    </div>
  );
};
addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Bookshop Framework Selector",
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <FrameworkSelector />,
  });
});
