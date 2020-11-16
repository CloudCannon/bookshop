module.exports = {
  stories: ["../components/**/*.stories.*"],
  logLevel: "debug",
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-backgrounds",
    "@storybook/addon-viewport",
    "@storybook/addon-a11y",
    "../../../storybook/preset",
  ],
};
