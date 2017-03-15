import { OpenstackAPIModel } from './openstack-api-model';
import { EventEmitter, RabbitClient } from '../common';

/**
 * 
 * @todo Abstract common calls
 * @export
 * @class GlanceService
 * @extends {OpenstackAPIModel}
 */
export class GlanceService extends OpenstackAPIModel {
  constructor() {
    super();
    this.name = 'glance';
    this.type = 'image';
  }

  registerMessageHandlers() {
    EventEmitter.eventEmitter.on(EventEmitter.events.serviceCatalogUpdate.glance, GlanceService.updateEndpoint);
  }

  /**
   * Wrapper for the forwarding method from OpenstackAPIModel
   * 
   * @param {*} clientRequest 
   * @returns {Promise<any>} 
   * 
   * @memberOf GlanceService
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