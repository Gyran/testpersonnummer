import path from "node:path";
import fsp from "node:fs/promises";

console.log("Starting to generate testpersonnummer file");

const libFilePath = path.join(import.meta.dirname, "./lib/index.js");
// "w" truncates the file so that we know that it's empty
const fh = await fsp.open(libFilePath, "w");
fh.appendFile("module.exports=[");

let writeInitialComma = false;
let nextUrl =
  "https://skatteverket.entryscape.net/rowstore/dataset/b4de7df7-63c0-4e7e-bb59-1f156a591763/json?_limit=500&_offset=0";
while (nextUrl) {
  console.log("Fetching", nextUrl);

  const response = await fetch(nextUrl, {
    headers: { accept: "application/json" },
  });
  const jsonData = await response.json();

  if (writeInitialComma) {
    fh.appendFile(",");
  } else {
    writeInitialComma = true;
  }

  const testpersonnummerStrings = jsonData.results.map(
    ({ testpersonnummer }) => `"${testpersonnummer}"`
  );
  fh.appendFile(testpersonnummerStrings.join(","));

  if (jsonData.next) {
    nextUrl = jsonData.next;
  } else {
    nextUrl = undefined;
  }
}

fh.appendFile("];");

console.log("All done!");
