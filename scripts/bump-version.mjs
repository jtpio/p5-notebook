/**
 * Set the same version in the root and workspace package.json files.
 * The root version is also the Python package version (hatch-nodejs-version).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version ?? '')) {
  console.error('Usage: jlpm bump:version <x.y.z[-alpha.n]>');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  join(root, 'package.json'),
  ...readdirSync(join(root, 'packages'))
    .map(name => join(root, 'packages', name, 'package.json'))
    .filter(file => existsSync(file))
];

for (const file of files) {
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  data.version = version;
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

console.log(`Set version ${version} in ${files.length} package.json files`);
