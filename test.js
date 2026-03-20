const fs = require('fs');

const constantsPath = 'c:/Users/marke/Downloads/laboutiquerd/constants.ts';
const i18nPath = 'c:/Users/marke/Downloads/laboutiquerd/i18n.ts';

const constantsContent = fs.readFileSync(constantsPath, 'utf8');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

const regex = /(name|title|description):\s*['"]([^'"]+)['"]/g;
let match;
let missingKeys = [];

while ((match = regex.exec(constantsContent)) !== null) {
  const value = match[2];
  if (!i18nContent.includes(`"${value}"`)) {
    missingKeys.push(value);
  }
}

// Eliminate duplicates
missingKeys = [...new Set(missingKeys)];
console.log(JSON.stringify(missingKeys, null, 2));

const braidsNamesRegex = /name:\s*['"]([^'"]+)['"]/g;
let missingBraids = [];
// wait, constants.ts has all braids? no, it has BRAID_STYLES
while ((match = braidsNamesRegex.exec(constantsContent)) !== null) {
  if (!i18nContent.includes(match[1])) {
       // but wait, handled above!
  }
}

