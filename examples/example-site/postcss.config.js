const fluidvars = require("postcss-fluidvars");

module.exports = {
    plugins: [
        fluidvars({namespace: 's'})
    ]
};