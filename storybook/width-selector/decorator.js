const withWidthSelector = (Story, context) => {
  const existingStyle = document.getElementById("bookshop-width-style");
  const newStyle = `#bookshop-generated-render-root{
    width: ${context.globals["bookshop-width"]};
  }`;
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "bookshop-width-style";
    style.innerHTML = newStyle;
    document.head.appendChild(style);
  } else {
    existingStyle.innerHTML = newStyle;
  }
  return Story();
};

export const decorators = [withWidthSelector];
