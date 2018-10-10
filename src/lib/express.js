'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const helmet = require('helmet');
const { promisify } = require('util');
const swaggerExpress = require('swagger-express-middleware');
const mquery = require('express-mquery');
const sanitizer = require('./express-lyssol');
const swagger = require('./swagger/swaggerAPI');
const { generateObjectSpec } = require('./swagger/swaggerGenerator');
const logger = require('./logger');

module.exports = async (config, routes) => {
  try {
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compress());
    app.use(helmet());
    app.use(cors({
      allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With'],
    }));

    if (config.env === 'development') {
      app.use(morgan('dev'));
    }

    if (config.apiDocs) {
      swagger(app, config);
    }
    // sanitize the request body
    app.use(sanitizer());
    // mquery initialization
    app.use(mquery());
    // IMPORTANT: swaggerMiddleware must be after swagger ui and before api routing
    const swaggerExpressPromise = promisify(swaggerExpress);
    const swaggerSpecs = await generateObjectSpec({
      srcPath: config.path.root,
      version: config.version,
    });

    const swaggerMiddleware = await swaggerExpressPromise(swaggerSpecs, app);
    app.use(swaggerMiddleware.metadata());
    app.use(swaggerMiddleware.parseRequest());
    // Error middleware for swagger
    app.use((err, req, res, next) => {
      const badRequestErr = new Error(err.message);
      badRequestErr.status = httpStatus.BAD_REQUEST;
      next(badRequestErr);
    });
    // add healthcheck route
    app.get('/health-check', (req, res) => res.send('OK'));
    // mount all routes on /api path
    app.use('/api', routes);
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const notFoundErr = new Error('NOT_FOUND');
      notFoundErr.status = httpStatus.NOT_FOUND;
      next(notFoundErr);
    });
    // error handler, send stacktrace only during development
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      let stack;
      if (config.env === 'development') {
        // log error stack
        if (
          err.status !== httpStatus.NOT_FOUND
          && err.status !== httpStatus.BAD_REQUEST
          && err.status !== httpStatus.UNAUTHORIZED
        ) {
          logger.error(err.stack);
        }
        // log error message
        if (err.status === httpStatus.BAD_REQUEST) {
          logger.warn(err.message);
        }
        // return the stack trace in the response
        if (err.status !== httpStatus.NOT_FOUND) {
          ({ stack } = err);
        }
      } else if (config.env === 'production') {
        // log error message and calling req url
        if (err.status === httpStatus.NOT_FOUND) {
          logger.warn(`${err.message} ${req.originalUrl}`);
        } else {
          logger.error(err.stack);
        }
      }
      // TODO use only toJSON after removing Express APIError
      let resultJSON;
      if (err.toJSON) {
        resultJSON = err.toJSON();
      } else {
        resultJSON = {
          message: err.message,
          code: err.code,
          data: err.data,
          stack,
        };
      }

      res.status(err.status).json(resultJSON);
    });

    app.listen(config.port, () => console.log(`listening on port ${config.port}!`));
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
