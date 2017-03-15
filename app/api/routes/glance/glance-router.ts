import { RestRouter } from '../../../common';
import { GlanceController } from './glance-controller';
import { GlanceService } from '../../../services';
import { RouterUtils } from '../../../utils';

export class GlanceRouter extends RestRouter {
  glanceController: GlanceController;

  constructor(glanceService: GlanceService) {
    super();
    this.glanceController = new GlanceController(glanceService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.all(
      '/*', RouterUtils.checkEndpointID,
      this.wrapRouteFn(this.glanceController, this.glanceController.proxyRequest));
  }
}
