import path from 'path';
import chalk from 'chalk';
import { runner } from '@bookshop/browser';

export const buildBrowserScript = async (siteRoot, bookshopDirs) => {
  const scriptLocation = path.join(siteRoot, '_bookshop/bookshop-browser.min.js');

  await runner({
    bookshop: bookshopDirs,
    output: scriptLocation
  });

  console.log(chalk.green(`Built Bookshop browser javascript to ${scriptLocation}`));
}
