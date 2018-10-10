'use strict';

const FileHound = require('filehound');
const concatFile = require('concat');
const yaml = require('yamljs');

module.exports = {
  generateStringSpec,
  generateObjectSpec,
};

async function generateStringSpec({
  srcPath, version, host, protocol,
}) {
  const files = FileHound.create()
    .paths(srcPath)
    .ext('yaml')
    .match('*.doc*')
    .findSync();

  const globSwagg = files.filter(file => !file.includes('paths'));
  const pathFiles = FileHound.create()
    .paths(srcPath)
    .ext('yaml')
    .match('*.paths.doc*')
    .findSync();

  const pathSwagg = pathFiles.filter(file => !file.includes('base.paths'));
  const basePath = pathFiles.find(file => file.includes('base.paths'));
  pathSwagg.unshift(basePath);
  const swaggerStringSpec = await concatFile(globSwagg.concat(pathSwagg));

  return swaggerStringSpec
    .replace('{version}', version)
    .replace('{host}', host)
    .replace('{protocol}', protocol);
}

async function generateObjectSpec(config) {
  const swaggerStringSpec = await generateStringSpec(config);
  const swaggerObject = swaggerStringSpec.replace(/\t/g, ' ');
  return yaml.parse(swaggerObject);
}
