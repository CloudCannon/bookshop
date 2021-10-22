# Contribution Guidelines

## Wayfinding
All npm packages live in a yarn workspace under `javascript-modules` — please use yarn over npm commands within here.  
Non-javascript plugins live in the root-level `generator-plugins`

## How it all plugs together
There are a few distinct areas of modules:
* **Core generator plugins**, which provide the following:
  * Core Bookshop component/include tags
  * Bookshop component browser tag
  * _Extra integrations for the component browser, in some cases_
* **CMS generator plugins**, which provide the following:
  * Generation of CMS structured content
  * _Extra helpers for live editing, in some cases_
* **Javascript Tooling packages**
  * Everything around the developer tooling (like the component browser) 

### In (some) detail

#### Generator Plugins
* `jekyll-bookshop` 💎  
Core generator plugin for Jekyll builds.

* `cloudcannon-jekyll-bookshop` 💎  
CMS generator plugin for Jekyll builds.

* `@bookshop/eleventy-bookshop` 📦  
Core generator plugin for Eleventy builds.

* `@bookshop/cloudcannon-eleventy-bookshop` 📦  
CMS generator plugin for Eleventy builds.

#### Core Packages

* `@bookshop/cloudcannon-structures` 📦  
Primary interpreter of the `bookshop.toml` files.  
_Bundled into JS and Ruby generator plugins._

* `@bookshop/toml-narrator` 📦  
Utility for rewriting comments in a TOML file, to preserve them against their key regardless of parsing implementation.  
_Bundled into JS and Ruby generator plugins._

#### Developer Tooling

* `@bookshop/*-engine` 📦  
Engines for a given SSG that are provided a list of their source files and know how to render them into DOM elements.

* `@bookshop/browser` 📦  
Local and hostable UI explorer and playground of bookshop components. 

* `@bookshop/live` 📦  
Live rendering module, to re-render components that were output by a generator plugin, live in a CMS environment. 

* `@bookshop/builder` 📦  
ESbuild wrapper utility, used by the above frontend packages. Provides auto-imports for bookshop engines, files, schemas, etc.  
Responsible for loading the `bookshop.config.js` file.

* `@bookshop/styles` 📦  
An extension to the above builder, that handles compiling and transforming all Bookshop component SCSS files.

* `@bookshop/bookshop-sass` 📦  
Standalone CLI providing SCSS compilation and transformation for SSGs who do not have core Sass support.

* `@bookshop/init` 📦  
Standalone CLI that can create skeleton component files in a Bookshop.

_TODO: Expand upon all packages in their respective README files_

## Linting

_TODO_

## Testing

Make sure all dependencies are installed in:
* Repository root
* `javascript-modules` workspace
* Each `generator-plugins/**/*` folder

To run all tests, from the root of the repo run:
```
./scripts/publish.js test
```

This will run all unit tests across all packages, followed by the integration tests in `javascript-modules/integration-tests`  

## Commit conventions

Please follow the [angular commit conventions](https://gist.github.com/brianclements/841ea7bffdb01346392c). Examples:
```
feat: added new thing

the new thing does good things
```
```
fix: fixed the bad bug
```
```
docs: did words better
```
