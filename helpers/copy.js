'use strict';

const path = require('path');
const fs = require('./fs');

module.exports = async function copy(root, src, dest, list) {
  list = typeof list === 'undefined' ? [] : list;
  const sourceStat = await fs.statAsync(src);
  if (sourceStat.isDirectory()) {
    await fs.mkdirAsync(dest);
    const children = await fs.readdirAsync(src);
    await Promise.all(children.map(child => {
      return copy(root, path.join(src, child), path.join(dest, child), list);
    }));
  } else {
    await fs.linkAsync(src, dest);
    list.push(dest);
  }
  return list;
}
