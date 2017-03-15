import { RestRouter } from '../../../common';
import { NovaController } from './nova-controller';
import { NovaService } from '../../../services';
import { RouterUtils } from '../../../utils';

export class NovaRouter extends RestRouter {
  novaController: NovaController;

  constructor(novaService: NovaService) {
    super();
    this.novaController = new NovaController(novaService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/vm', this.wrapRouteFn(this.novaController, this.novaController.createVM));
    this.router.all(
      '/*', RouterUtils.checkEndpointID, RouterUtils.checkTenantID,
      this.wrapRouteFn(this.novaController, this.novaController.proxyRequest)
    );
  }
}
