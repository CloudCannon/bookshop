import { makeDecorator } from "@storybook/addons";

export const decorator = makeDecorator({
  name: "test",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context) => {
    console.log("test");
    return getStory(context);
  },
});
