'use strict';

const swaggerUi = require('swagger-ui-express');
const { generateStringSpec } = require('./swaggerGenerator');


module.exports = function swagger(
  app,
  {
    path,
    protocol,
    host,
    port,
    version,
    swaggerHost,
  },
) {
  const srcPath = path.root;

  let hostUrl;
  let specUrl;
  if (swaggerHost) {
    hostUrl = swaggerHost;
    specUrl = `${protocol}://${swaggerHost}/api/swagger/specs`;
  } else {
    hostUrl = `${host}:${port}`;
    specUrl = `${protocol}://${host}:${port}/api/swagger/specs`;
  }

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerUrl: specUrl,
    }),
  );

  app.get('/api/swagger/specs', async (req, res) => {
    try {
      const swaggerSpecs = await generateStringSpec({
        srcPath, version, host: hostUrl, protocol,
      });
      return res.send(swaggerSpecs);
    } catch (err) {
      throw err;
    }
  });
};
