const testpersonnummer = require("./lib/index");

if (!Array.isArray(testpersonnummer)) {
  throw new Error("Export is not an array");
}
if (testpersonnummer.length <= 0) {
  throw new Error("Testpersonnummer array is empty");
}
