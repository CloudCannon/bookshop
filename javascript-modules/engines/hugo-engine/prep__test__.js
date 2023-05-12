import fs from "fs";

let contents = fs.readFileSync("lib/engine.js", { encoding: "utf-8" });
contents = contents.replace("import compressedHugoWasm", "// import compressedHugoWasm");
fs.writeFileSync("lib/engine__test__.js", contents);
