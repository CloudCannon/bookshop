// TODO: Windows tests are flaky with NPM:
//-┌───────────────────────────────────────────────────────────┐
//-│                  npm update check failed                  │
//-│            Try running with sudo or get access            │
//-│           to the local update config store via            │
//-│ sudo chown -R $USER:$(id -gn $USER) C:\Users\Liam\.config │
//-└───────────────────────────────────────────────────────────┘
const retries = process.platform === "win32" ? " --retry 2" : '';

module.exports = { 
    default: `--publish-quiet --require support${retries}`
}
