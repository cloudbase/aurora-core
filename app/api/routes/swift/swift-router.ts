import { RestRouter } from '../../../common';
import { SwiftController } from './swift-controller';
import { SwiftService } from '../../../services';
import { RouterUtils } from '../../../utils';

export class SwiftRouter extends RestRouter {
  swiftController: SwiftController;

  constructor(swiftService: SwiftService) {
    super();
    this.swiftController = new SwiftController(swiftService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.all(
      '/*', RouterUtils.checkEndpointID,
      this.wrapRouteFn(this.swiftController, this.swiftController.proxyRequest)
    );
  }
}
