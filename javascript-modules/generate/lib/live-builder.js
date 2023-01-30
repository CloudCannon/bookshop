import path from 'path';
import chalk from 'chalk';
import { runner } from '@bookshop/live';

export const buildLiveScript = async (siteRoot, bookshopDirs) => {
  const scriptLocation = path.join(siteRoot, '_cloudcannon/bookshop-live.js');

  const result = await runner({
    bookshop: bookshopDirs,
    output: scriptLocation
  });

  const extra_files = Object.keys(result.metafile.outputs)
    .filter(f => f !== scriptLocation)
    .map(f => f.replace(siteRoot, "").replace(/\\/g, "/"));

  console.log(chalk.green(`Built Bookshop live javascript to ${scriptLocation}`));
  console.log(chalk.green(`[Plus: ${extra_files.join(', ')}]`));

  return extra_files;
}
