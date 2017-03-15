import { Logger, LoggerFactory, RestController } from '../../../common';
import { SwiftService } from '../../../services';

export class SwiftController extends RestController {
  constructor(private swiftService: SwiftService) {
    super();
  }

  private static LOGGER: Logger = LoggerFactory.getLogger();

  proxyRequest(req, res): Promise<any> {
    return this.swiftService.checkEndpointId(req.headers['endpoint-id'])
      .then(() => {
        return this.swiftService.callServiceApi(req);
      })
      .then((result) => {
        this.forwardResponse(res, result.body, result.statusCode);
      });
  }
}