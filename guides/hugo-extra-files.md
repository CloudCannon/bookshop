# Using extra files with Hugo Bookshop

Bookshop's Hugo engine supports defining custom files that can be used in the Visual Editor. This feature allows you to use custom partials and shortcodes without having to move those files into Bookshop's component directory.

Note that the templating within these files is constrained by Bookshop's [Hugo Live Editing Support](https://github.com/CloudCannon/bookshop/blob/main/guides/hugo.adoc#hugo-live-editing-support) in the same way as your core components, so this _doesn't_ provide a way to utilize site functions such as `resources.Get`.

To provide extra files to Hugo Bookshop, specify the path and content of each in your Bookshop configuration file.

E.g. for a component library at `component-lib`, the file `component-lib/bookshop/bookshop.config.js` file should contain:

```js
module.exports = {
  engines: {
    "@bookshop/hugo-engine": {
      extraFiles: {
        "layouts/shortcodes/name.html": `My name is {{ .Get "name" }}`
        "layouts/partials/test.html": `<!-- raw partial text -->`
      }
    }
  }
}
```

Bookshop uses a simulated Hugo file structure when live editing, so the path you specify should be relative to the root of a Hugo site — most of the time the files you're writing should be at `layouts/shortcodes/*` and `layouts/partials/*`.

This configuration file is evaluated at build-time, so you can use NodeJS APIs to load files rather than specifying them inline. For example:

```js
const fs = require("fs");

module.exports = {
  engines: {
    "@bookshop/hugo-engine": {
      extraFiles: {
        "layouts/shortcodes/name.html": fs.readFileSync("site/layouts/shortcodes/name.html", { encoding: "utf8" }),
        "layouts/partials/test.html": fs.readFileSync("site/layouts/partials/test.html", { encoding: "utf8" })
      }
    }
  }
}
```

The working directory will be the root of your repository, unless you have changed directory in your CloudCannon postbuild script before running `npx @bookshop/generate`.

If you need to be more explicit about the location, you can use `__dirname` to reference files relative to the Bookshop configuration file itself:

```js
const fs = require("fs");
const path = require("path");

module.exports = {
  engines: {
    "@bookshop/hugo-engine": {
      extraFiles: {
        "layouts/shortcodes/name.html": fs.readFileSync(
          path.join(__dirname, "../../site/layouts/shortcodes/name.html"),
          { encoding: "utf8" }
        ),
        "layouts/partials/test.html": fs.readFileSync(
          path.join(__dirname, "../../site/layouts/partials/test.html"),
          { encoding: "utf8" }
        )
      }
    }
  }
}
```

It is worth noting that *mounted files* are not available on their expected destination path. Use the source path instead. When using Hugo modules, the recommended approach would be to `vendor` the modules before referencing them.

Run `hugo mod vendor` in your repository root to store all the module files in the `_vendor` folder. For example, use the following configuration to reference the partial `button.html` provided by the Hugo module `github.com/owner/repo`:

```js
const fs = require('fs')

module.exports = {
  engines: {
    '@bookshop/hugo-engine': {
      extraFiles: {
        'layouts/partials/button.html': fs.readFileSync(
          '_vendor/github.com/owner/repo/layouts/partials/button.html',
          { encoding: 'utf8' }
        )
      }
    }
  }
}
```

Hugo might give you a warning when rerunning `hugo mod vendor`. If you use npm, you could define a custom script to clear the `_vendor` folder prior to the vendor command. The next example uses the `rimraf` package to ensure the removal of the directory works across different operating systems. Install `rimraf` as a development dependency with `npm i -D rimraf`. Next, add the following script to your `package.json`:

```javascript
{
  "scripts": {
    [...]
    "mod:vendor": "rimraf _vendor && hugo mod vendor",
    [...]
  }
}
```

You can then include the npm script in your build pipeline to automate the vendor command. Head over to the build configuration of your CloudCannon site. Add the npm script to the `Install command` defined in the section `Command Line Options`:

```bash
[ -f package.json ] && npm i && npm run -s mod:vendor
```