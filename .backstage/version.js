const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;

const packages = require("../bookshop-packages.json");
const ver = process.argv[2];
const env = process.env;

const versionNpm = (pkgs, version) => {
  pkgs.forEach((pkg) => {
    const cmd = `npm --prefix ${pkg} version ${version} --allow-same-version --no-git-tag-version --no-commit-hooks`;
    console.log(`* ${cmd}`);
    const npmBump = execSync(cmd, { env });
    if (npmBump.stderr) {
      console.error(`version bump failed:\n${npmBump.stderr}`);
      process.exit(1);
    }
  });
};

const formatGemVersion = (ver) => ver.replace(/-/, ".pre.");
const versionGems = (gems, version) => {
  gems.forEach((gem) => {
    const packageName = path.basename(gem);
    const packageVersionFile = path.join(
      __dirname,
      "../",
      gem,
      `lib/${packageName}/version.rb`,
    );
    let versionFileContents = fs.readFileSync(packageVersionFile, "utf8");
    if (!/VERSION/.test(versionFileContents)) {
      console.error(
        box(
          `${packageName} version.rb file does not contain a VERSION constant.`,
        ),
      );
      process.exit(1);
    }

    versionFileContents = versionFileContents.replace(
      /VERSION =.*$/gm,
      `VERSION = "${formatGemVersion(version)}"`,
    );
    fs.writeFileSync(packageVersionFile, versionFileContents);
    console.log(`* Updating ruby ${packageVersionFile}`);
  });
};

const versionStrings = (files, version) => {
  Object.entries(files).forEach(([file, { regex, replacement }]) => {
    let fileContents = fs.readFileSync(
      path.join(__dirname, "../", file),
      "utf8",
    );
    let r = new RegExp(regex, "g");
    let new_text = replacement.replace(/NEW_VERSION/g, version);
    fileContents = fileContents.replace(r, new_text);
    fs.writeFileSync(file, fileContents);
    console.log(`* Updating version string in ${file}`);
  });
};

if (!ver) {
  console.error(`No version supplied`);
  process.exit(1);
}

versionNpm(Object.keys(packages.npm), ver);
versionGems(Object.keys(packages.rubygems), ver);
versionStrings(packages.versionStrings, ver);

packages.version = ver;
fs.writeFileSync(
  path.join(__dirname, "../bookshop-packages.json"),
  JSON.stringify(packages, null, 2),
);
console.log(`* Updated version in bookshop-packages.json`);
