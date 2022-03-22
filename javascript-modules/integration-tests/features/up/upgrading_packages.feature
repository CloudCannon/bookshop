@up
Feature: Bookshop Package Upgrades

  Background:
    Given the file tree:
      """
      package.json from starters/up/package.json  # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Upgrades old node packages
    Given a site/package.json file containing:
      """
      {
        "devDependencies": {
          "@bookshop/browser": "1.2.3"
        }
      }
      """
    When I run "npm start -- --dry-run --version 9.9.9" in the . directory
    Then stderr should be empty
    And stdout should contain "@bookshop/browser 1.2.3 → 9.9.9"
    And stdout should contain "Didn't detect yarn or npm locks"

  Scenario: Upgrades old node packages and installs
    Given a site/package.json file containing:
      """
      {
        "devDependencies": {
          "@bookshop/browser": "1.2.3",
          "@bookshop/live": "9.9.0"
        }
      }
      """
    And a site/package-lock.json file containing:
      """
      .
      """
    When I run "npm start -- --dry-run --version 9.9.9.pre-rc.1" in the . directory
    Then stderr should be empty
    And stdout should contain "@bookshop/browser 1.2.3 → 9.9.9.pre-rc.1"
    And stdout should contain "@bookshop/live 9.9.0 → 9.9.9.pre-rc.1"
    And stdout should contain "Running npm i"

  Scenario: Upgrades old node packages and installs with yarn
    Given a site/package.json file containing:
      """
      {
        "devDependencies": {
          "@bookshop/browser": "1.2.3",
          "@bookshop/live": "9.9.0"
        }
      }
      """
    And a site/yarn.lock file containing:
      """
      .
      """
    When I run "npm start -- --dry-run --version 9.9.9.pre-rc.1" in the . directory
    Then stderr should be empty
    And stdout should contain "@bookshop/browser 1.2.3 → 9.9.9.pre-rc.1"
    And stdout should contain "@bookshop/live 9.9.0 → 9.9.9.pre-rc.1"
    And stdout should contain "Running yarn install"

  Scenario: Upgrades old gems and installs
    Given a site/Gemfile file containing:
      """
      source "https://rubygems.org"

      group :jekyll_plugins do
        gem "jekyll-bookshop", ">= 2.2.2"
      end
      """
    And a site/Gemfile.lock file containing:
      """
      .
      """
    When I run "npm start -- --dry-run --version 9.9.9" in the . directory
    Then stderr should be empty
    And stdout should contain "gem \"jekyll-bookshop\", \">= 2.2.2\" → 9.9.9"
    And stdout should contain "Running bundle install"

  Scenario: Upgrades old gems in other files and installs
    Given a site/Gemfile.something.rb file containing:
      """
      source "https://rubygems.org"

      group :jekyll_plugins do
        gem "jekyll-bookshop", ">= 2.2.2"
      end
      """
    And a site/Gemfile.something.rb.lock file containing:
      """
      .
      """
    When I run "npm start -- --dry-run --version 9.9.9" in the . directory
    Then stderr should be empty
    And stdout should contain "gem \"jekyll-bookshop\", \">= 2.2.2\" → 9.9.9"
    And stdout should contain "Running BUNDLE_GEMFILE=\"Gemfile.something.rb\" bundle install"

  Scenario: Upgrades old go modules
    Given a site/go.mod file containing:
      """
      module a.b.c

      go 1.17

      require github.com/cloudcannon/bookshop/hugo/v2 v2.6.0 // indirect
      """
    When I run "npm start -- --dry-run --version 9.9.9" in the . directory
    Then stderr should be empty
    And stdout should contain "github.com/cloudcannon/bookshop/hugo/v2 v2.6.0 → v9.9.9"
    And stdout should contain "Running hugo mod tidy"
    And stdout should contain "Running hugo mod get github.com/cloudcannon/bookshop/hugo/v9@v9.9.9"
