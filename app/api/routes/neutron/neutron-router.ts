import { RestRouter } from '../../../common';
import { NeutronController } from './neutron-controller';
import { NeutronService } from '../../../services';
import { RouterUtils } from '../../../utils';

export class NeutronRouter extends RestRouter {
  neutronController: NeutronController;

  constructor(neutronService: NeutronService) {
    super();
    this.neutronController = new NeutronController(neutronService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.all(
      '/*', RouterUtils.checkEndpointID,
      this.wrapRouteFn(this.neutronController, this.neutronController.proxyRequest));
  }
}
