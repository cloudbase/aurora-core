import { Logger, LoggerFactory, RestController } from '../../../common';
import { IdentityService } from '../../../services';

export class IdentityController extends RestController {
  constructor(private identityService: IdentityService) {
    super();
  }

  private static LOGGER: Logger = LoggerFactory.getLogger();

  listVersions(req, res, next): Promise<any> {
    IdentityController.LOGGER.debug('Listing Openstack API Versions');
    return this.identityService.listVersions()
      .then((result) => {
        return this.forwardResponse(res, result.body, result.statusCode);
      });
  }

  authenticate(req, res, next): Promise<any> {
    IdentityController.LOGGER.debug(`Authenticating user ${req.body['username']}`);
    return this.identityService.authenticate(req.body)
      .then((result) => {
        return this.forwardResponse(res, result.body, result.statusCode);
      });
  };

  listExtensions(req, res, next): Promise<any> {
    IdentityController.LOGGER.debug('Listing extensions');

    return this.identityService.listExtensions()
      .then((result) => {
        return this.forwardResponse(res, result.body, result.statusCode);
      });
  };

  getServiceCatalog(req, res, next): Promise<any> {
    return this.identityService.getServiceCatalog()
      .then(result => {
        return this.respond(res, result);
      })
      .catch(error => { next(error); });
  }

  logout(req, res, next): Promise<any> {
    IdentityController.LOGGER.debug(`Log out for use - ${req.session.username}`);

    return this.identityService.destroySession(req.session)
      .then((result) => {
        return this.respond(res, result);
      });
  }
  listTenants(req, res, next): Promise<any> {
    IdentityController.LOGGER.debug('Listing tenants');

    return this.identityService.listTenants(req.headers['x-auth-token'])
      .then((result) => {
        return this.forwardResponse(res, result.body, result.statusCode);
      });
  };
}
