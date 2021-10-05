# Bookshop Standalone Sass Compiler

To use Bookshop styles on your website, you can run the `bookshop-sass` command provided by `@bookshop/sass`.

```bash
npm i -D @bookshop/sass
# or
yarn add -D @bookshop/sass

# then

npx @bookshop/sass -b component-library -o site/css/bookshop.css
```

From within your `package.json` file you can add the script as: 
```
"sass:build": "bookshop-sass -b component-library -o site/css/bookshop.css",
"sass:watch": "bookshop-sass -b component-library -o site/css/bookshop.css -w"
```

This compiles all styles from the Bookshop (including running any Postcss plugins you have configured in your working directory), and outputs a css file ready to be referenced on your website.

See `npx @bookshop/sass --help` for available options.
