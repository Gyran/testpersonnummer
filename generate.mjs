import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import readline from 'node:readline';

const directoryEntries = await fsp.readdir('./data', { withFileTypes: true });
const csvFiles = directoryEntries.filter(
  (de) => de.isFile() && de.name.endsWith('.csv'),
);

const testpersonnummer = [];

for await (const csvFile of csvFiles) {
  const stream = fs.createReadStream(path.join('./data', csvFile.name));

  const rl = readline.createInterface({
    input: stream,
  });

  for await (const line of rl) {
    if (line !== 'Testpersonnummer' && line.length === 12) {
      testpersonnummer.push(line);
    }
  }
}

await fsp.writeFile(
  path.join('./lib/index.js'),
  `module.exports = ${JSON.stringify(testpersonnummer)};`,
);

console.log(`Generated file with ${testpersonnummer.length} testpersonnummer`);
