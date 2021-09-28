const path = require('path');

module.exports = class FileTree {
  constructor(input) {
    this.input = input;
    this.lines = input.split('\n').filter(l => l);
    this.files = [];
    this.tree = [];
  }
  
  parse() {
    this.lines.forEach(this.parseLine.bind(this));
    return this.files;
  }
  
  parseLine(rawLine) {
    if (FileTree.isBlank(rawLine)) return;
    let [line, comment] = FileTree.splitComment(rawLine);
    const backDepth = this.tree.length - FileTree.getDepth(line);
    if (backDepth % 1) {
      console.warn(`Bad depth found on line:\n${line}`);
      console.warn(`Expected a multiple of 2 spaces`);
      return;
    }
    if (backDepth < 0) {
      console.warn(`Bad depth found on line:\n${line}`);
      console.warn(`Didn't expect more than ${this.tree.length*2} spaces at this point`);
      return;
    }
    if (backDepth >= 1) this.tree.splice(-backDepth);
  
    if (FileTree.isDir(line)) {
      this.tree.push(line.trim());
    } else if (FileTree.isFile(line)) {
      const file = FileTree.parseFile(line);
      file.create = path.join(...this.tree, file.create);
      this.files.push(file);
    } else {
      console.warn(`Unknown line format:\n${line.trim()}`);
      console.warn(`Expected \`dir/\` or \`file/path.ext from file/path.ext\``)
    }
  }
  
  static parseFile(line) {
    const r = /^\s*(\S+) from (\S+)\s*$/;
    const [, create, from] = line.match(r);
    return { create, from };
  }
  
  static isBlank(line) {
    return /^\s*$/.test(line);
  }
  
  static isFile(line) {
    return /^\s*\S+ from \S+\s*$/.test(line.trim());
  }
  
  static isDir(line) {
    return /.+\/$/.test(line.trim());
  }
  
  static getDepth(line) {
    return line.match(/^(\s*)/g)[0].length/2;
  }

  static splitComment(line) {
    return line.split(/\s*#\s*/);
  }
}
