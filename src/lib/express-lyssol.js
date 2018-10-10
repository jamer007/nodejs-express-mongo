'use strict';

const sanitizer = require('sanitizer');

module.exports = () => {
  return (req, res, next) => {
    if (!req.body) return next();
    req.body = lyssol(req.body);
    return next();
  };

  function lyssol(obj) {
    Object.keys(obj).forEach((key) => {
      /* eslint-disable no-param-reassign */
      if (obj[key] && typeof obj[key] === 'object') {
        obj[key] = lyssol(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = sanitizer
          .unescapeEntities(
            sanitizer.sanitize(obj[key].trim()),
          );
      }
      /* eslint-enable no-param-reassign */
    });
    return obj;
  }
};
