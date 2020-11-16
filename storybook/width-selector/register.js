import React, { useState } from "react";
import { addons, types } from "@storybook/addons";
import { IconButton, Icons } from "@storybook/components";

const ADDON_ID = "width-selector";
const TOOL_ID = `${ADDON_ID}/tool`;

// give a unique name for the panel
const WidthSelector = ({ api }) => {
  const [currWidth, setCurrWidth] = useState("fit-content");
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
      <p style={{ marginRight: "10px" }}> Bookshop Width: </p>
      <IconButton
        key="bookshop-width-fit"
        title="Change the width of the component"
        active={currWidth === "fit-content"}
        onClick={() => {
          api.updateGlobals({ "bookshop-width": "fit-content" });
          setCurrWidth("fit-content");
        }}
        style={{ marginRight: "10px" }}
      >
        <Icons icon="component" />
      </IconButton>
      <IconButton
        key="bookshop-width-full"
        title="Change the width of the component"
        active={currWidth === "100%"}
        onClick={() => {
          api.updateGlobals({ "bookshop-width": "100%" });
          setCurrWidth("100%");
        }}
      >
        <Icons icon="expand" />
      </IconButton>
    </div>
  );
};

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Bookshop Width Selector",
    render: ({ active, key }) => <WidthSelector api={api} />,
  });
});
