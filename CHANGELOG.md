## [2.3.1](https://github.com/CloudCannon/bookshop/compare/v2.3.0...v2.3.1) (2022-01-19)


### Bug Fixes

* live rendering error boundary around bad comments ([91e77f1](https://github.com/CloudCannon/bookshop/commit/91e77f1aad02a64b6e710c38eb43c37e5172b6d7))



# [2.3.0](https://github.com/CloudCannon/bookshop/compare/v2.2.3...v2.3.0) (2022-01-19)


### Features

* **generate:** add new structures cli to replace cc-ssg plugins ([8a4bff3](https://github.com/CloudCannon/bookshop/commit/8a4bff3deadd3ef9d39001d298aaab835a98cee6))



## [2.2.3](https://github.com/CloudCannon/bookshop/compare/v2.2.2...v2.2.3) (2021-12-14)


### Bug Fixes

* **live:** patch for complex layouts assigning html to variables ([#76](https://github.com/CloudCannon/bookshop/issues/76)) ([0a90a4d](https://github.com/CloudCannon/bookshop/commit/0a90a4de206df3f60c6cb076df6e16fc988c5400))



## [2.2.2](https://github.com/CloudCannon/bookshop/compare/v2.2.1...v2.2.2) (2021-12-08)


### Features

* support `_editor_link` and `_editorLink` as flags in component data ([1fa8591](https://github.com/CloudCannon/bookshop/commit/1fa859113a2b6a3a9a7f71ae46d430890e055839))



## [2.2.1](https://github.com/CloudCannon/bookshop/compare/v2.2.0...v2.2.1) (2021-12-07)


### Bug Fixes

* handle some editor link corner cases ([a45653a](https://github.com/CloudCannon/bookshop/commit/a45653aa63542d5d756e5d2c2674e6e9bf22cfe4))

### Features

* editor links can be toggled on a per-component basis by setting the `editor_links` or `editorLinks` flag in a components props



# [2.2.0](https://github.com/CloudCannon/bookshop/compare/v2.1.1...v2.2.0) (2021-12-05)


### Features

* **live:** automatically add cms editor links in the live renderer ([08fa8b3](https://github.com/CloudCannon/bookshop/commit/08fa8b3ad32f142357a9febe8146ff4c1d18aa65))

This will take effect with the upcoming CloudCannon editor panels release.


## [2.1.1](https://github.com/CloudCannon/bookshop/compare/v2.1.0...v2.1.1) (2021-11-16)


### Bug Fixes

* **init:** fix arguments to @bookshop/init command ([c15282d](https://github.com/CloudCannon/bookshop/commit/c15282d96bde4029491d53ad6bcfba72145cc11b))



# [2.1.0](https://github.com/CloudCannon/bookshop/compare/2.0.9...2.1.0) (2021-11-16)


### Bug Fixes

* **eleventy:** make eleventy engine more lenient for dynamic components ([f6de1f0](https://github.com/CloudCannon/bookshop/commit/f6de1f0ec108a36d7334455dd7a11b67e8588886))


### Features

* **eleventy:** eleventy 1.0.0-beta support ([35fce81](https://github.com/CloudCannon/bookshop/commit/35fce812dec4057aee36f45cb6a028bdfb2cd7a0))
* **hugo:** core hugo component support ([#60](https://github.com/CloudCannon/bookshop/issues/60)) ([75a9765](https://github.com/CloudCannon/bookshop/commit/75a97656cf11f8da1a87c9ba46aa3c415eb2473b))
* **init:** renamed the @bookshop/gen package to @bookshop/init ([86ad798](https://github.com/CloudCannon/bookshop/commit/86ad798d92ebcfd353f3233de6dfee58044aafb6))



## [2.0.10](https://github.com/CloudCannon/bookshop/compare/2.0.9...2.0.10) (2021-10-29)

* no-op release to reset npm latest tag

## [2.0.9](https://github.com/CloudCannon/bookshop/compare/2.0.8...2.0.9) (2021-10-13)


### Bug Fixes

* **eleventy-bookshop:** correctly handle nested liquidjs contexts ([c4899f7](https://github.com/CloudCannon/bookshop/commit/c4899f786d59b3475265f48f2b82ea68947e7e3d))
* **toml-narrator:** fix quotes in TOML comments ([50992f2](https://github.com/CloudCannon/bookshop/commit/50992f2da8360ef66103b1f32a0ac1ebcf7efdbc))

## [2.0.8](https://github.com/CloudCannon/bookshop/compare/2.0.7...2.0.8) (2021-10-12)


### Bug Fixes

* **live:** wrong injected window variable ([d226bcd](https://github.com/CloudCannon/bookshop/commit/d226bcdb754c10344ea2b24d8927392b472ec111))



## [2.0.7](https://github.com/CloudCannon/bookshop/compare/2.0.6...2.0.7) (2021-10-11)


### Bug Fixes

* **jekyll-engine:** correct jekyll highlight tag implementation ([020d8c2](https://github.com/CloudCannon/bookshop/commit/020d8c2368bfbd6d3c4e1623cf62f8f9dd69f766))
* **live:** handle more live editing edge cases ([9ee51c0](https://github.com/CloudCannon/bookshop/commit/9ee51c0bfda5ed5c98810d5960a2d56f9c0784fb))



## [2.0.6](https://github.com/CloudCannon/bookshop/compare/2.0.5...2.0.6) (2021-10-08)


### Bug Fixes

* normalize paths for fast-glob on windows ([d37e9ed](https://github.com/CloudCannon/bookshop/commit/d37e9ed226dda5d32a9105f988a3c013288f494b))
* use patched node-runner while awaiting next publish ([d98a91b](https://github.com/CloudCannon/bookshop/commit/d98a91b3634c2d29b917fc4e9b26d5d75e54e95f))



## [2.0.5](https://github.com/CloudCannon/bookshop/compare/2.0.4...2.0.5) (2021-10-06)


### Features

* automatically set the array structure id_key for components ([e9a1650](https://github.com/CloudCannon/bookshop/commit/e9a1650192c729d4c1211786aabcb351b493e3e3))



## [2.0.4](https://github.com/CloudCannon/bookshop/compare/2.0.3...2.0.4) (2021-10-06)


### Bug Fixes

* live rendering name parsing edge cases ([f7badef](https://github.com/CloudCannon/bookshop/commit/f7badefab019dd2ad76e3620e754025b5f404447))



## [2.0.3](https://github.com/CloudCannon/bookshop/compare/2.0.2...2.0.3) (2021-10-05)


### Bug Fixes

* retry components that error in jekyll due to a thread race ([1cc3172](https://github.com/CloudCannon/bookshop/commit/1cc31729e086197ca300a87f0b10df9521c8f6eb))



## [2.0.2](https://github.com/CloudCannon/bookshop/compare/2.0.1...2.0.2) (2021-10-05)

### Bug Fixes

* Fix incorrect live rendering behavior for @bookshop/live

## [2.0.1](https://github.com/CloudCannon/bookshop/compare/2.0.0...2.0.1) (2021-10-05)

### Features

* Provide an optional hosted component library outside of the website when running npx @bookshop/live
* Introduced npx @bookshop/gen command

## 2.0.0 (2021-10-05)

* Initial stable release for Jekyll and Eleventy