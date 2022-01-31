import path from 'path';
import { runner } from '@bookshop/live';

export const buildLiveScript = async (siteRoot, bookshopDirs) => {
  const scriptLocation = path.join(siteRoot, '_cloudcannon/bookshop-live.js');

  await runner({
    bookshop: bookshopDirs,
    output: scriptLocation
  });

  console.log(`📚 ———— Built Bookshop live javascript to ${scriptLocation}`);
}
