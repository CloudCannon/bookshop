function managerEntries(entry = []) {
  return [
    ...entry,
    require.resolve("./framework-selector/register"),
    require.resolve("./width-selector/register"),
  ];
}

function config(entry = []) {
  return [...entry, require.resolve("./width-selector/addDecorator")];
}

module.exports = {
  managerEntries,
  config,
};
