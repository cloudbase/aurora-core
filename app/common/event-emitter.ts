import events = require('events');
import { Logger, LoggerFactory } from '../common';
import { OpenstackAPIModel } from '../services';

export class APIEvents {
  public eventEmitter: events.EventEmitter;
  public serviceInstances: {
    nova: OpenstackAPIModel,
    neutron: OpenstackAPIModel,
    glance: OpenstackAPIModel,
    cinder: OpenstackAPIModel,
    keystone: OpenstackAPIModel,
    swift: OpenstackAPIModel
  };
  public events = {
    updateServiceID: 'UPDATE_SERVICE_ID',
    serviceCatalogUpdate: {
      nova: 'NOVA_UPDATE',
      neutron: 'NEUTRON_UPDATE',
      glance: 'GLANCE_UPDATE',
      keystone: 'KEYSTONE_UPDATE',
      cinder: 'CINDER_UPDATE',
      swift: 'SWIFT_UPDATE',
    },
    newServiceCatalog: 'NEW_SERVICE_CATALOG'
  };

  private static LOGGER: Logger = LoggerFactory.getLogger();

  constructor() {
    this.eventEmitter = new events.EventEmitter();
  }

  /**
   * Emits serviceCatalogUpdate message on a specific service
   * 
   * @param {string} serviceName 
   * @param {{}} endpoint 
   * 
   * @memberOf APIEvents
   */
  emitUpdateEvent(serviceName: string, endpoint: {}) {
    this.eventEmitter.emit(
      this.events.serviceCatalogUpdate[serviceName],
      endpoint,
      this.serviceInstances[serviceName]
    );
  }
}
export let EventEmitter = new APIEvents();
