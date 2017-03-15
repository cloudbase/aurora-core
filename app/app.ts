import 'core-js/library';
import { Logger, LoggerFactory, RestErrorMiddleware } from './common';
import { Express, Router } from 'express';
import { ExpressAppFactory } from './express-app-factory';
import { ApiRouterFactory } from './api';
import http = require('http');
import util = require('util');
import { EventEmitter } from './common';
import { ServiceUtils } from './utils';
import { APP_CONFIG } from './config';
require('dotenv').config();

const LOGGER: Logger = LoggerFactory.getLogger();

const errorMiddleware = [
  RestErrorMiddleware.normalizeToRestError,
  RestErrorMiddleware.serializeRestError
];

/**
 *  Register the service and pass the service ID to further calls 
 *  @todo Send a "READY" state when the service finishes to initialize
 */
ServiceUtils.registerService()
  .then(serviceId => {
    LOGGER.info(`Service ID returned by the Service Manager - ${serviceId}`);
    const apiRouter: Router = ApiRouterFactory.getApiRouter(serviceId);
    const app: Express = ExpressAppFactory.getExpressApp(apiRouter, null, errorMiddleware);
    app.listen(APP_CONFIG.port, () => {
     LOGGER.info(`Express server listening on port ${APP_CONFIG.port}.`);
    });
  })
  .catch(error => {
    LOGGER.error(`Unable to register service - ${JSON.stringify(error)}`);  
    const apiRouter: Router = ApiRouterFactory.getApiRouter('CORE_NOTIFICATIONS');
    const app: Express = ExpressAppFactory.getExpressApp(apiRouter, null, errorMiddleware);
    app.listen(parseInt(process.env.PORT), () => {
     LOGGER.info(`Express server listening on port ${process.env.PORT}.`);
    });
  });



