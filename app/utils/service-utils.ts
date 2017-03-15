import { Logger, LoggerFactory, InternalError  } from '../common';
import http = require('http');
import express = require('express');
import { Response } from 'express';
import { APP_CONFIG } from '../config';


export class ServiceUtils {
  private static LOGGER: Logger = LoggerFactory.getLogger();
  
  /**
   * Sends a request to the Service Manager in order to register the new service
   * 
   * @static
   * @returns 
   * 
   * @memberOf ServiceUtils
   */
  static registerService() {
    const serviceOptions = {
      name: APP_CONFIG.name,
      port: APP_CONFIG.port,
      routingPath: APP_CONFIG.gatewayRoutingPath,
      options: { 'AUTHENTICATION': '/api/identity/tokens' }
    };
    
    ServiceUtils.LOGGER.info(`Registering new service with ${JSON.stringify(serviceOptions)}`);
    return ServiceUtils.sendRequest({
        protocol: 'http:',
        host: APP_CONFIG.serviceManagerHost,
        port: APP_CONFIG.serviceManagerPort,
        path: '/register',
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }, serviceOptions
    )
    .then(result => {
      return Promise.resolve(JSON.parse(result['body'])['data']);
    });
  }
  
  /**
   * Creates a new request with the specified parameters, parses and returns the response
   * 
   * @static
   * @param {http.RequestOptions} requestOptions 
   * @param {*} [requestBody] 
   * @returns 
   * 
   * @memberOf ServiceUtils
   */
  static sendRequest(requestOptions: http.RequestOptions, requestBody?: any) {
    if (requestBody) {
      requestBody = JSON.stringify(requestBody);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(requestBody).toString();
    }

    ServiceUtils.LOGGER.debug(`Sending new request with ${JSON.stringify(requestOptions)}`);
    return new Promise((resolve, reject) => {
      let responseBody: string = '';
      const newRequest = http.request(requestOptions, res => {
        res.setEncoding('utf8');
        res.on('data', chunk => {
          responseBody += chunk;
        });

        res.on('end', () => {
          res['body'] = responseBody;
          return resolve(res);
        });
      });
      
      newRequest.on('error', requestError => {
        ServiceUtils.LOGGER.error(`Request error - ${JSON.stringify(requestError)}`);
        return reject(new InternalError(requestError));
      });

      if (requestBody) {
        newRequest.write(requestBody);
      }

      newRequest.end();
    });
  }
}
