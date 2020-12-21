<h1 align="center">Welcome to @bookshop/ejs-engine 👋</h1>
<p>
  <a href="https://github.com/cloudcannon/bookshop#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/cloudcannon/bookshop/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> An extension to bookshop that allows support for .ejs modules

## Usage

### Import Syntax

Currently, the syntax for importing is: 
```ejs
<%- include("Components/button/button.ejs", { name: "BigIron" }) %>
```

## Local Development

```sh
npm i
npm run start
```

Also, don't forget to `npm link @bookshop/ejs-engine`.

**N.B.** This engine is transpiled (because ejs requires fs).

## Author

👤 **@CloudCannon**

* Website: https://cloudcannon.com
* Github: [@CloudCannon](https://github.com/CloudCannon)
