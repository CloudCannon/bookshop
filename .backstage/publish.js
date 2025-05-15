const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;

const packages = require("../bookshop-packages.json");
const ver = process.argv[2];
const wet = process.argv[3];
const env = process.env;

const getPrereleaseTag = (ver) =>
  ver.match(/^\d+\.\d+\.\d+(?:-([a-z]+)\.\d+)$/)?.[1];
const formatGemVersion = (ver) => ver.replace(/-/, ".pre.");

const publishNPM = (version) => {
  try {
    const npmTag = getPrereleaseTag(version)
      ? ` --tag ${getPrereleaseTag(version)}`
      : "";
    const cmd = `pnpm -r publish${npmTag} --access public --no-git-checks`;
    console.log(`* ${cmd}`);
    if (wet === "seriously") execSync(cmd, { stdio: "inherit", env });
    return { pkg: "all_npm", version, err: null };
  } catch (err) {
    return { pkg: "all_npm", err };
  }
};

const publishGems = async (pkgs, version) => {
  const gemVersion = formatGemVersion(version);
  const releases = pkgs.map(async (pkg) => {
    return await new Promise((resolve, reject) => {
      try {
        const packageName = path.basename(pkg);
        let cmd = `cd ${pkg} && gem build ${packageName}.gemspec`;
        console.log(`* ${cmd}`);
        if (wet === "seriously") execSync(cmd, { stdio: "inherit", env });
        cmd = `cd ${pkg} && gem push ${packageName}-${gemVersion}.gem`;
        console.log(`* ${cmd}`);
        if (wet === "seriously") execSync(cmd, { stdio: "inherit", env });
        cmd = `rm ${pkg}/*.gem`;
        console.log(`* ${cmd}`);
        if (wet === "seriously") execSync(cmd, { env });
        resolve({ pkg, version: gemVersion, err: null });
      } catch (err) {
        resolve({ pkg, err });
      }
    });
  });
  return await Promise.all(releases);
};

if (!ver) {
  console.error(`No version supplied`);
  process.exit(1);
}

if (wet === "true") {
  console.log("Pushing packages for real");
} else {
  console.log("Doing a dry run publish");
  console.log("Pass `seriously` after version to publish for real.\n");
}

const publish = async () => {
  const npmPublishResult = publishNPM(ver);
  const gemPublishResults = await publishGems(
    Object.keys(packages.rubygems),
    ver,
  );
  const publishFailures = [npmPublishResult, ...gemPublishResults]
    .filter((r) => r.err)
    .map((r) => r.pkg);
  const publishSuccesses = [npmPublishResult, ...gemPublishResults]
    .filter((r) => !r.err)
    .map((r) => `${r.version} ${r.pkg}`);

  if (publishFailures.length) {
    console.error(`* * Publishing failed for the following packages:`);
    console.error(`* * ⇛ ${publishFailures.join("\n* * ⇛ ")}`);
    console.error(`* * The following packages __have__ been published:`);
    console.error(`* * ⇛ ${publishSuccesses.join("\n* * ⇛ ")}`);
    if (publishSuccesses.length) {
      // Since publishing partly succeeded we want to continue to update the git info
      // (so that we can re-run this publish to try mop up missing packages)
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
};

publish();
