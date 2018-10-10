'use strict';

const Joi = require('joi');
const path = require('path');
const dotEnv = require('dotenv');

dotEnv.config({ path: path.join(__dirname, '..', '.env') });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  USER: Joi.string(),
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  npm_package_version: Joi.string().default('0.0.0'),
  PROTOCOL: Joi.string()
    .allow(['http', 'https'])
    .default('http'),
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().default(4410),
  API_DOCS: Joi.boolean().default(false),
  SWAGGER_HOST: Joi.string(),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  user: envVars.USER,
  env: envVars.NODE_ENV,
  apiDocs: envVars.API_DOCS,
  version: envVars.npm_package_version,
  protocol: envVars.PROTOCOL,
  host: envVars.HOST,
  port: envVars.PORT,
  path: {
    root: __dirname,
    configs: path.join(__dirname, '/configs'),
  },
  swaggerHost: envVars.SWAGGER_HOST,
};

module.exports = config;
