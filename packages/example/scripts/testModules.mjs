import { readFile, writeFile } from "fs";
import process from "process";

const filePath = "dist/index.html";
const arg = process.argv[2];

readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let updatedData;
  if (arg === "cjs") {
    updatedData = data.replace("index.mjs", "index.js");
  } else {
    updatedData = data.replace("index.js", "index.mjs");
  }

  writeFile(filePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Import statement updated successfully!");
  });
});
