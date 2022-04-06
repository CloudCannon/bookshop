module.exports = () => {
  // <%= specComment %>
  const spec = {
    structures: [
      "content_blocks"
    ],
    label: "<%= componentLabel %>",
    description: "",
    icon: "",
    tags: []
  };

  // <%= blueprintComment %>
  const blueprint = {
    text = "Hello World!"
  };
  
  // <%= previewComment %>
  const preview = {};

  // <%= inputsComment %>
  const _inputs = {}

  return {
    spec,
    blueprint,
    preview,
    _inputs,
  }
}