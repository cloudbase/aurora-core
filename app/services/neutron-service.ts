import { OpenstackAPIModel } from './openstack-api-model';
import { EventEmitter, RabbitClient } from '../common';

/**
 * 
 * @todo Abstract common API calls
 * @export
 * @class NeutronService
 * @extends {OpenstackAPIModel}
 */
export class NeutronService extends OpenstackAPIModel {
  constructor() {
    super();
    this.name = 'neutron';
    this.type = 'network';
  }
  
  registerMessageHandlers() {
    EventEmitter.eventEmitter.on(EventEmitter.events.serviceCatalogUpdate.neutron, NeutronService.updateEndpoint);
  }
  
  /**
   * Wrapper for the forwarding method from OpenstackAPIModel
   * 
   * @param {*} clientRequest 
   * @returns {Promise<any>} 
   * 
   * @memberOf NeutronService
   */
  callServiceApi(clientRequest: any): Promise<any> {
    return super.callServiceApi(
      clientRequest.headers['endpoint-id'],
      clientRequest.method,
      clientRequest.url,
      clientRequest.headers,
      clientRequest.body
    );
  }
}