module.exports = () => {
  // <%= specComment %>
  const spec = {
    structures: [
      "content_blocks"
    ],
    label: "",
    description: "",
    icon: "",
    tags: []
  };

  // <%= blueprintComment %>
  const blueprint = {};
  
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