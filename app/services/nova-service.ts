import { OpenstackAPIModel } from './openstack-api-model';
import { EventEmitter, RabbitClient } from '../common';

/**
 * 
 * @todo Abstract common API calls
 * @export
 * @class NovaService
 * @extends {OpenstackAPIModel}
 */
export class NovaService extends OpenstackAPIModel {
  constructor() {
    super();
    this.name = 'nova';
    this.type = 'compute'; }

  registerMessageHandlers() {
    EventEmitter.eventEmitter.on(EventEmitter.events.serviceCatalogUpdate.nova, NovaService.updateEndpoint);
  }
  
  createVM(vmInfo: any): Promise<any> {
    return Promise.resolve(vmInfo);
  } 
  /**
   * Wrapper for the forwarding method from OpenstackAPIModel
   * 
   * @param {*} clientRequest 
   * @returns {Promise<any>} 
   * 
   * @memberOf NovaService
   */
  callServiceApi(clientRequest: any): Promise<any> {
    return super.callServiceApi(
      clientRequest.headers['endpoint-id'],
      clientRequest.method,
      '/' + clientRequest.headers['tenant-id'] + clientRequest.url,
      clientRequest.headers,
      clientRequest.body
    );
  }
}
