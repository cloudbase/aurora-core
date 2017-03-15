import { OpenstackService } from './openstack-service';
import { ResourceNotFoundError, Logger, LoggerFactory, ServicePropreties } from '../common';

import url = require('url');

/**
 * Base class for Openstack Services abstraction
 * 
 * @export
 * @class OpenstackAPIModel
 */
export class OpenstackAPIModel {
  public name: string;
  public type: string;
  public endpoints: {};

  public static LOGGER: Logger = LoggerFactory.getLogger();

  constructor() {
    this.endpoints = {};
  };

  /**
   * Parses and saves new endpoints on new service catalog requests
   * 
   * @static
   * @param {ServicePropreties} newEndpoint 
   * @param {OpenstackAPIModel} serviceInstance 
   * 
   * @memberOf OpenstackAPIModel
   */
  static updateEndpoint(newEndpoint: ServicePropreties, serviceInstance: OpenstackAPIModel) {
    OpenstackAPIModel.LOGGER.debug(`Parsing new endpoint - ${JSON.stringify(newEndpoint)}`);
    if (!(newEndpoint.id in serviceInstance.endpoints)) {
      // Remove tenant id from urls on nova and cinder
      if (newEndpoint.publicURL.split('/').length === 5) {
        newEndpoint.adminURL = newEndpoint.adminURL.substr(0, newEndpoint.adminURL.lastIndexOf('/'));
        newEndpoint.internalURL = newEndpoint.internalURL.substr(0, newEndpoint.internalURL.lastIndexOf('/'));
        newEndpoint.publicURL = newEndpoint.publicURL.substr(0, newEndpoint.publicURL.lastIndexOf('/'));
      }

      const parsedURL = url.parse(newEndpoint.publicURL);
      if (parsedURL.path === '/') {
        parsedURL.path = '';
      }
      
      serviceInstance.endpoints[newEndpoint['id']] = {
        adminUrl: newEndpoint.adminURL,
        region: newEndpoint.region,
        internalUrl: newEndpoint.internalURL,
        publicUrl: newEndpoint.publicURL,
        port: parsedURL.port,
        host: parsedURL.hostname,
        path: parsedURL.path
      };

      OpenstackAPIModel.LOGGER.debug(
        `Saved endpoint for ${serviceInstance.name} - ${JSON.stringify(serviceInstance.endpoints[newEndpoint.id])}`
      );
    }
  }

  /**
   * Fetchest the host, port, and API path for a given EndpointID
   * 
   * @param {string} requestEndpointId 
   * @returns {Promise<any>} 
   * 
   * @memberOf OpenstackAPIModel
   */
  checkEndpointId(requestEndpointId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.endpoints[requestEndpointId]) {
        return resolve({
          endpointId: requestEndpointId,
          port: this.endpoints[requestEndpointId].port,
          path: this.endpoints[requestEndpointId].path,
          host: this.endpoints[requestEndpointId].host
        });
      } else {
        return reject(new ResourceNotFoundError(`Specified endpoint ID could not be found`));
      }
    });
  }
  
  /**
   * Forwards calls to Openstack Services APIs based on the provided EndpointID 
   * 
   * @param {string} endpointId 
   * @param {string} method 
   * @param {string} path 
   * @param {{}} headers 
   * @param {{}} body 
   * @returns {Promise<any>} 
   * 
   * @memberOf OpenstackAPIModel
   */
  callServiceApi(endpointId: string, method: string, path: string, headers: {}, body: {}): Promise<any> {
    const requestOptions = {
      protocol: 'http:',
      host: this.endpoints[endpointId].host,
      port: this.endpoints[endpointId].port,
      path: this.endpoints[endpointId].path + path,
      method: method,
      headers: headers,
    };
    
    return OpenstackService.callOSApi(requestOptions, body);
  }
}