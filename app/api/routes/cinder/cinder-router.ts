import { RestRouter } from '../../../common';
import { CinderController } from './cinder-controller';
import { CinderService } from '../../../services';
import { RouterUtils } from '../../../utils';

export class CinderRouter extends RestRouter {
  cinderController: CinderController;

  constructor(cinderService: CinderService) {
    super();
    this.cinderController = new CinderController(cinderService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.all(
      '/*', RouterUtils.checkEndpointID, RouterUtils.checkTenantID,
      this.wrapRouteFn(this.cinderController, this.cinderController.proxyRequest));
  }
}
