import { OpenstackService } from './openstack-service';
import { OpenstackAPIModel } from './openstack-api-model';
import { EventEmitter, RabbitClient, NotImplementedError, InternalError } from '../common';
import { AuthenticationUtils } from '../utils';
import { Topology } from '../config';

export class IdentityService extends OpenstackAPIModel {
  private apiHost: string;
  private apiPath: string;
  private apiPort: number;
  private apiVersion: string;

  private static apiEndpoints = {
    getToken: {'2.0': '/tokens', '3': '/auth/tokens'},
    getTenants: {},
    getServiceCatalog: {},
  
  }
  constructor(apiHost: string, apiPort: number, apiPath: string, apiVersion: string) {
    super();
    this.name = 'keystone';
    this.type = 'identity';
    this.apiHost = apiHost;
    this.apiPath = apiPath;
    this.apiPort = apiPort;
    this.apiVersion = apiVersion;
  }
  
  registerMessageHandlers() {
    EventEmitter.eventEmitter.on(EventEmitter.events.newServiceCatalog, OpenstackService.updateServiceCatalog);
    EventEmitter.eventEmitter.on(EventEmitter.events.serviceCatalogUpdate.keystone, IdentityService.updateEndpoint);
  }

  /**
   * Abstracts the logic needed to get a new token, the list of tenants and a service catalog
   * 
   * @todo Add logic for V3 API
   * @param {{}} credentials 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  authenticate(credentials: {}): Promise<any> {
    let result = {};
    let parsedCredentials = {};
    return AuthenticationUtils.parseCredentials(credentials, this.apiVersion)
      .then((authObj) => {
        parsedCredentials = authObj;
        return this.getToken(authObj);
      })
      .then(response => {
        if (response.body.access.serviceCatalog.length === 0) {
          result = response.body;
          return this.listTenants(response.body.access.token.id);
        } else {
          EventEmitter.eventEmitter.emit(
            EventEmitter.events.newServiceCatalog,
            response.body.access.serviceCatalog
          );
          return Promise.resolve(response);
        }
      })
      .then((response) => {
        if (Object.getOwnPropertyNames(result).length !== 0) {
          result = response.body;
          let reqObject = credentials;
          reqObject['tenant'] = response.body.tenants[0].name;
          return this.getServiceCatalog(reqObject);
        } else return Promise.resolve(response);
      })
      .then((response) => {
        if (Object.getOwnPropertyNames(result).length !== 0) {
          response.body['tenants'] = result;
          return Promise.resolve(response);
        } else return Promise.resolve(response);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Destroy a token provided by Keystone
   * 
   * @param {string} token 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  //destroySession(token: string): Promise<any> {
  //  
  //}

  /**
   * 
   * @todo Abstract endpoint for different API versions
   * @param {{}} credentials 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  getToken(credentials: {}): Promise<any> {
    OpenstackAPIModel.LOGGER.debug(`Requesting token from Keystone on - ${JSON.stringify(credentials)}`);

    return OpenstackService.callOSApi( {
      path: this.apiPath + '/tokens',
      port: this.apiPort,
      host: this.apiHost,
      method: 'POST'
    }, credentials);
  }

  /**
   * Request a new service catalaog from Keystone and notify other services on the response
   * 
   * @param {{}} [authObj] 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  getServiceCatalog(authObj?: {}): Promise<any> {
    if (authObj) {
      if (this.apiVersion === '2.0') {
        return AuthenticationUtils.parseCredentials(authObj, this.apiVersion)
          .then((authBody) => {
            return this.getToken(authBody);
          })
          .then((result) => {
            EventEmitter.eventEmitter.emit(
              EventEmitter.events.newServiceCatalog,
              result.body.access.serviceCatalog
            );
            return Promise.resolve(result);
          });
      } else {
        return Promise.reject(
          new NotImplementedError(`Feature is not available for this OpenStack API version ${this.apiVersion}`)
        );
      }
    }
  }

  /**
   * 
   * 
   * @param {string} apiToken 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  listTenants(apiToken: string): Promise<any> {
    OpenstackAPIModel.LOGGER.debug(`Getting tenant list for ${apiToken}`);
    return OpenstackService.callOSApi({
      path: this.apiPath + '/tenants',
      port: this.apiPort,
      host: this.apiHost,
      headers: { 'X-Auth-Token': apiToken }
    });
  }

  /**
   * 
   * 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  listExtensions(): Promise<any> {
    OpenstackAPIModel.LOGGER.debug('Listing extensions');
    return OpenstackService.callOSApi({
      path: this.apiPath + '/extensions',
      port: this.apiPort,
      host: this.apiHost
    });
  }

  /**
   * 
   * 
   * @returns {Promise<any>} 
   * 
   * @memberOf IdentityService
   */
  listVersions(): Promise<any> {
    OpenstackAPIModel.LOGGER.debug('Listing OpenStack API versions');
    return OpenstackService.callOSApi({
      path: this.apiPath,
      port: this.apiPort,
      host: this.apiHost
    });
  }
}