const path = require('path');
const fs = require('fs');
const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const FileTree = require('./filetree.js');

Before(function () {
  this.tmp_dir = path.join(process.cwd(), `.bookshop-tmp-test-dir/${uuidv4()}`);
  fs.mkdirSync(this.tmp_dir, { recursive: true });
});

After(function () {
  fs.rmdirSync(this.tmp_dir, { recursive: true });
});

class CustomWorld {
  constructor() {
    this.variable = 0;
    this.tmp_dir = null;
    this.commandError = null;
    this.stdout = null;
    this.stderr = null;
  }

  buildFileTree(input) {
    const tree = new FileTree(input);
    tree.parse().forEach(file => {
      const fullCreatePath = path.join(this.tmp_dir, file.create);
      const fullFromPath = path.join(__dirname, '../', file.from);
      fs.mkdirSync(path.dirname(fullCreatePath), { recursive: true });
      fs.copyFileSync(fullFromPath, fullCreatePath);
    });
  }

  createFile(filePath, input) {
    const fullPath = path.join(this.tmp_dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, input);
  }

  fileExists(name) {
    return fs.existsSync(path.join(this.tmp_dir, name));
  }

  fileContents(name) {
    return fs.readFileSync(path.join(this.tmp_dir, name), 'utf8');
  }

  async runCommand(command, dir) {
    const fullPath = path.join(this.tmp_dir, dir);
    return new Promise((resolve, reject) => {
      exec(command, { cwd: fullPath }, (error, stdout, stderr) => {
        this.commandError = error || "";
        this.stdout = stdout || "";
        this.stderr = stderr || "";
        resolve();
      });
    });
  }
}

setWorldConstructor(CustomWorld);