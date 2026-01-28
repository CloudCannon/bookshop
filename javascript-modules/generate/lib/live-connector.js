import path from 'path';
import fs from 'fs';
import fastGlob from 'fast-glob';
import chalk from 'chalk';

// Marker used to identify and replace existing bookshop live scripts (safe to re-run)
const BOOKSHOP_LIVE_MARKER = '<!--bookshop-live-connector-->';
const BOOKSHOP_LIVE_END_MARKER = '<!--/bookshop-live-connector-->';

// Regex to match existing bookshop live connector scripts (including marker comments)
const EXISTING_CONNECTOR_REGEX = new RegExp(
  `${BOOKSHOP_LIVE_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${BOOKSHOP_LIVE_END_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`,
  'g'
);

// Also match legacy scripts without markers (for backwards compatibility)
// Use \r?\n to handle both Unix (\n) and Windows (\r\n) line endings
const LEGACY_CONNECTOR_REGEX = /<script>(?:\r?\n)?\(function\(\)\{(?:\r?\n)\s*const bookshopLiveSetup[\s\S]*?cloudcannon:load[\s\S]*?\}\)\(\);(?:\r?\n)?<\/script>(?:\r?\n)?/g;

const getLiveEditingConnector = (options) => {
  return `${BOOKSHOP_LIVE_MARKER}
<script>
(function(){
    const bookshopLiveSetup = (CloudCannon) => {
      ${options.disableBindings ? `window.bookshopDataBindings = false;` : ''}
      CloudCannon.enableEvents();
      CloudCannon?.setLoading?.("Loading Bookshop Live Editing");
      let triggeredLoad = false;
      const whenLoaded = () => {
        triggeredLoad = true;
        CloudCannon?.setLoading?.(false);
      }
      setTimeout(() => {
        if (!triggeredLoad) {
          CloudCannon?.setLoading?.("Error Loading Bookshop Live Editing");
          setTimeout(() => {
            if (!triggeredLoad) { whenLoaded() }
          }, 2000);
        }
      }, 12000);

      const head = document.querySelector('head');
      const script = document.createElement('script');
      script.src = \`/_cloudcannon/bookshop-live.js\`;
      script.onload = function() {
        window.bookshopLive = new window.BookshopLive({ remoteGlobals: [] });
        whenLoaded();
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
</script>
${BOOKSHOP_LIVE_END_MARKER}`;
}

const getEditableRegionsConnector = () => {
  return `${BOOKSHOP_LIVE_MARKER}
<script>
(function(){
    const bookshopLiveSetup = (CloudCannon) => {
      window.bookshopDataBindings = false;
      CloudCannon?.setLoading?.("Loading Bookshop Live Editing");
      let triggeredLoad = false;
      const whenLoaded = () => {
        triggeredLoad = true;
        CloudCannon?.setLoading?.(false);
      }
      setTimeout(() => {
        if (!triggeredLoad) {
          CloudCannon?.setLoading?.("Error Loading Bookshop Live Editing");
          setTimeout(() => {
            if (!triggeredLoad) { whenLoaded() }
          }, 2000);
        }
      }, 12000);

      const head = document.querySelector('head');
      const script = document.createElement('script');
      script.src = \`/_cloudcannon/bookshop-live.js\`;
      script.onload = function() {
        window.bookshopLive = new window.BookshopLive({
          remoteGlobals: [],
          loadedFn: whenLoaded,
        });

        window.cc_components = window.cc_components || {};
        window.cc_components = new Proxy(window.cc_components, {
          get(target, key) {
            if (typeof key !== "string") {
              return undefined;
            }

            if (key in target) {
              return target[key];
            }

            /**
             * Wrapper function that renders the Bookshop Live component to an HTMLElement.
             *
             * @param {any} props - Props to pass to the Bookshop Live component
             * @returns {Promise<HTMLElement>} The rendered component as an HTMLElement
             */
            const wrappedComponent = async (props) => {
              const rootEl = document.createElement("div");

              if (!window.bookshopLive) {
                throw new Error("Bookshop Live is not initialized");
              }

              await window.bookshopLive.renderElement(
                key,
                props,
                rootEl,
              )

              return rootEl;
            };

            return wrappedComponent;
          }
        });
        document.dispatchEvent(new CustomEvent('editable-regions:registered-proxy'));
      }
      head.appendChild(script);
    }

    document.addEventListener('cloudcannon:load', function (e) {
      bookshopLiveSetup(e.detail.CloudCannon);
    });
  })();
</script>
${BOOKSHOP_LIVE_END_MARKER}`;
}

/**
 * Remove any existing bookshop live connector scripts from the content.
 * This prevents duplicates - running generate multiple times won't add duplicate scripts.
 */
const removeExistingConnectors = (contents) => {
  // Remove scripts with markers (new format)
  let result = contents.replace(EXISTING_CONNECTOR_REGEX, '');
  // Remove legacy scripts without markers (backwards compatibility)
  result = result.replace(LEGACY_CONNECTOR_REGEX, '');
  return result;
};

export const hydrateLiveForSite = async (siteRoot, options) => {
  const siteHTMLFiles = await fastGlob(`**/*.html`, {
    cwd: siteRoot,
    dot: !!options.dot
  });

  const injectedHTML = options.editableRegions ? getEditableRegionsConnector() : getLiveEditingConnector(options);

  let connected = 0;
  let updated = 0;
  for (const file of siteHTMLFiles) {
    const filePath = path.join(siteRoot, file);
    let contents = fs.readFileSync(filePath, "utf8");
    const contains_bookshop = /<!--bookshop/.test(contents);
    if (!contains_bookshop) {
      continue;
    }

    // Check if there's an existing connector to replace
    const hadExisting = EXISTING_CONNECTOR_REGEX.test(contents) || LEGACY_CONNECTOR_REGEX.test(contents);
    
    // Remove any existing connectors first (prevents duplicates)
    contents = removeExistingConnectors(contents);
    
    // Inject the new connector
    contents = contents.replace('</body>', `${injectedHTML}\n</body>`);

    fs.writeFileSync(filePath, contents);
    connected += 1;
    if (hadExisting) {
      updated += 1;
    }
  }

  if (!connected) {
    console.log(chalk.gray(`No live editing connected as no pages contained Bookshop components`));
    return false;
  }

  console.log(chalk.green(`Added live editing to ${connected} page${connected === 1 ? '' : 's'} containing Bookshop components`));
  if (updated) {
    console.log(chalk.gray(`(${updated} page${updated === 1 ? '' : 's'} had existing connectors that were replaced)`));
  }
  const skipped = siteHTMLFiles.length - connected;
  if (skipped) {
    console.log(chalk.gray(`Skipped ${skipped} page${skipped === 1 ? '' : 's'} that didn't contain Bookshop components.`));
  }
  if (options.disableBindings) {
    console.log(chalk.green(`Disabled data binding panels when live editing`));
  }
  return true;
}
