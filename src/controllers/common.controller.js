'use strict';

const httpStatus = require('http-status');

module.exports = {
  initContext,
  responseHandler,
};
/**
 * Initialise request context object
 * @param req
 * @param res
 * @param next
 */
function initContext(req, res, next) {
  req.context = {};
  next();
}

/**
 * Build the response request
 * @param req
 * @param res
 * @param next
 */
function responseHandler(req, res, next) {
  try {
    let respHttpStatus = httpStatus.OK;
    if (req.method === 'DELETE') {
      respHttpStatus = httpStatus.NO_CONTENT;
    }

    if (req.context.resultHttpStatus) {
      respHttpStatus = req.context.resultHttpStatus;
    }
    return res.status(respHttpStatus).json(req.context.result);
  } catch (err) {
    return next(err);
  }
}
