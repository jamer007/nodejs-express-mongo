'use strict';

// Module root dir
process.env.NODE_PATH = __dirname;
// Enable import/export es6
// eslint-disable-next-line no-underscore-dangle
require('module').Module._initPaths();
module.exports = require('src/app.js');
