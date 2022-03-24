import path from 'path';
import fs from 'fs';
import fastGlob from 'fast-glob';
import chalk from 'chalk';

export const hydrateComponentBrowserForSite = async (siteRoot, options) => {
  const siteHTMLFiles = await fastGlob(`**/*.html`, {
    cwd: siteRoot,
    dot: !!options.dot
  });

  let connected = 0;
  for (const file of siteHTMLFiles) {
    const filePath = path.join(siteRoot, file);
    let contents = fs.readFileSync(filePath, "utf8");
    const contains_bookshop_browser = /_bookshop\/bookshop-browser\.js/.test(contents);
    if (!contains_bookshop_browser) {
      continue;
    }

    connected += 1;
  }

  if (!connected) {
    console.log(chalk.gray(`No component browser generated as no pages contained Bookshop component browsers`));
    return false;
  }

  console.log(chalk.green(`Built component browser into ${connected} page${connected === 1 ? '' : 's'}`));
  return true;
}
