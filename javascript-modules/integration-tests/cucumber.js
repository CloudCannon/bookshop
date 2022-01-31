// TODO: Windows tests are flaky with NPM:
//-┌───────────────────────────────────────────────────────────┐
//-│                  npm update check failed                  │
//-│            Try running with sudo or get access            │
//-│           to the local update config store via            │
//-│ sudo chown -R $USER:$(id -gn $USER) C:\Users\Liam\.config │
//-└───────────────────────────────────────────────────────────┘
const retries = process.platform === "win32" ? " --retry 2" : '';

// TODO: Puppeteer tests are flaky on Windows.
const web = process.platform === "win32" ? " --tags \"not @web\"" : '';

module.exports = { 
    default: `--publish-quiet --require support${retries}${web}`
}
