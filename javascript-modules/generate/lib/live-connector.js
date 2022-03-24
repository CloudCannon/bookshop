import path from 'path';
import fs from 'fs';
import fastGlob from 'fast-glob';

const getLiveEditingConnector = () => {
  return `
<script>
(function(){
    const bookshopLiveSetup = (CloudCannon) => {
      CloudCannon.enableEvents();
  
      const head = document.querySelector('head');
      const script = document.createElement('script');
      script.src = \`/_cloudcannon/bookshop-live.js\`;
      script.onload = function() {
        window.bookshopLive = new window.BookshopLive({
          remoteGlobals: []
        });
        const updateBookshopLive = async () => {
          const frontMatter = await CloudCannon.value({
            keepMarkdownAsHTML: false,
            preferBlobs: true
          });
          const options = window.bookshopLiveOptions || {};
          const rendered = await window.bookshopLive.update(frontMatter, options);
          if (rendered) CloudCannon?.refreshInterface?.();
        }
        document.addEventListener('cloudcannon:update', updateBookshopLive);
        updateBookshopLive();
      }
      head.appendChild(script);
    }
  
    document.addEventListener('cloudcannon:load', function (e) {
      bookshopLiveSetup(e.detail.CloudCannon);
    });
  })();
</script>`;
}

export const hydrateLiveForSite = async (siteRoot, options) => {
  const siteHTMLFiles = await fastGlob(`**/*.html`, {
    cwd: siteRoot,
    dot: !!options.dot
  });

  let connected = 0;
  for (const file of siteHTMLFiles) {
    const filePath = path.join(siteRoot, file);
    let contents = fs.readFileSync(filePath, "utf8");
    const contains_bookshop = /<!--bookshop/.test(contents);
    if (!contains_bookshop) {
      continue;
    }

    contents = contents.replace('</body>', `${getLiveEditingConnector()}\n</body>`);

    fs.writeFileSync(filePath, contents);
    connected += 1;
  }

  if (!connected) {
    console.log(chalk.gray(`No live editing connected as no pages contained Bookshop components`));
    return false;
  }

  console.log(chalk.green(`Added live editing to ${connected} page${connected === 1 ? '' : 's'} containing Bookshop components`));
  const skipped = siteHTMLFiles.length - connected;
  if (skipped) {
    console.log(chalk.gray(`Skipped ${skipped} page${skipped === 1 ? '' : 's'} that didn't contain Bookshop components.`));
  }
  return true;
}
