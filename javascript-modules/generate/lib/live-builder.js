import path from 'path';
import chalk from 'chalk';
import { runner } from '@bookshop/live';

export const buildLiveScript = async (siteRoot, bookshopDirs) => {
  const scriptLocation = path.join(siteRoot, '_cloudcannon/bookshop-live.js');

  await runner({
    bookshop: bookshopDirs,
    output: scriptLocation
  });

  console.log(chalk.green(`Built Bookshop live javascript to ${scriptLocation}`));
}
