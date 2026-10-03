/**
 * Set the same version in the root and workspace package.json files.
 * The root version is also the Python package version (hatch-nodejs-version).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Pre-release labels that hatch-nodejs-version can convert to a Python version
const PRE = '(a|b|c|rc|alpha|beta|pre|preview)[-.]?\\d*';
const DEV = 'dev[-.]?\\d*';
const VERSION = new RegExp(
  `^\\d+\\.\\d+\\.\\d+(-(${PRE}|${DEV}|${PRE}\\.${DEV}))?$`,
  'i'
);

const version = process.argv[2];
if (!VERSION.test(version ?? '')) {
  console.error('Usage: pnpm bump:version <x.y.z[-alpha.n]>');
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
