import { RestRouter } from '../../../common';
import { IdentityController } from './identity-controller';
import { IdentityService } from '../../../services';
import { RouterUtils } from '../../../utils';

export class IdentityRouter extends RestRouter {
  identityController: IdentityController;

  constructor(identityService: IdentityService) {
    super();
    this.identityController = new IdentityController(identityService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/', this.wrapRouteFn(this.identityController, this.identityController.listVersions));
    this.router.post('/tokens', RouterUtils.checkCredentials, this.wrapRouteFn(this.identityController, this.identityController.authenticate));
    this.router.delete('/tokens', RouterUtils.checkCredentials, this.wrapRouteFn(this.identityController, this.identityController.logout));
    this.router.get('/extensions', this.wrapRouteFn(this.identityController, this.identityController.listExtensions));
    this.router.get('/tenants', this.wrapRouteFn(this.identityController, this.identityController.listTenants));
    this.router.get('/logout', this.wrapRouteFn(this.identityController, this.identityController.logout));
    this.router.get('/service-catalog', this.wrapRouteFn(this.identityController, this.identityController.getServiceCatalog));
    this.router.all('/', this.wrapRouteFn(this.identityController, this.identityController.throwMethodNotAllowedError));
  }
}
