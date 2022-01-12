const path = require('path');
const test = require('ava');
const parser = require("gherkin-parse");
const fastGlob = require('fast-glob');


const ssgs = /^(eleventy|jekyll|hugo)\//;


const getFeatures = async () => {
  return await fastGlob(`**/*.feature`, {
    cwd: path.join(__dirname, 'features/'),
  });
}

test("(unit test) test parity between SSGs", async t => {
  const feats = await getFeatures();
  const ssgFeats = feats.filter(f => ssgs.test(f));
  const scenarios = {};
  ssgFeats.forEach(f => {
    const ssg = f.split('/')[0];
    scenarios[ssg] = scenarios[ssg] || [];

    const doc = parser.convertFeatureFileToJSON(path.join(__dirname, 'features', f));
    scenarios[ssg] = [
      ...scenarios[ssg],
      ...doc.feature.children
        .filter(c => c.type === "Scenario")
        .map(c => c.name)
    ];
  });
  Object.entries(scenarios).forEach(([ssg, tests]) => {
    Object.entries(scenarios).forEach(([otherSsg, otherTests]) => {
      tests.forEach(scenario => {
        t.is(otherTests.includes(scenario), true,
          `${ssg} has the scenario "${scenario}". ${otherSsg} should also have this test.`
        );
      });
    });
  });
});
