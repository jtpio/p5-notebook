const path = require('path');
const fs = require('fs-extra');

const basePath = path.resolve('.');
const dest = path.resolve(basePath, 'dist');
fs.ensureDirSync(dest);

['index.html', 'favicon.ico', './build/resources', './build/bundle.js'].forEach(
  f => {
    const src = path.resolve(basePath, f);
    const target = path.resolve(dest, f);
    console.log(src, target);
    fs.copySync(src, target);
  }
);
