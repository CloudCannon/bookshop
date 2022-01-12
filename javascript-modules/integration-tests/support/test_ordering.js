const path = require('path');
const parser = require("gherkin-parse");
const fastGlob = require('fast-glob');

const getFeatures = async () => {
    return await fastGlob(`**/*.feature`, {
        cwd: path.join(__dirname, '../features/'),
    });
}

module.exports = async () => {
    const feats = (await getFeatures()).sort();
    const scenarios = [];
    feats.forEach(uri => {
        const doc = parser.convertFeatureFileToJSON(path.join(__dirname, '../features', uri));
        doc.feature.children.filter(c => c.type === "Scenario" || c.type === "ScenarioOutline").forEach(scenario => {
            scenarios.push(`${uri}:${scenario.name}`);
        });
    });
    return scenarios;
};
