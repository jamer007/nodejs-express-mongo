'use strict';

const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '../');

const setEnvFile = async () => {
  try {
    if (process.argv[2] === '--force' || !fs.existsSync(`${rootPath}.env`)) {
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
      }
      const envFile = `.env.${process.env.NODE_ENV}`;
      if (fs.statSync(rootPath + envFile)) {
        await fs
          .createReadStream(rootPath + envFile)
          .pipe(fs.createWriteStream(`${rootPath}.env`));
      }
    }
  } catch (err) {
    throw err;
  }
};

try {
  setEnvFile();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}
