import { Logger, LoggerFactory, RestController } from '../../../common';
import { CinderService } from '../../../services';

export class CinderController extends RestController {
  constructor(private cinderService: CinderService) {
    super();
  }

  private static LOGGER: Logger = LoggerFactory.getLogger();

  proxyRequest(req, res): Promise<any> {
    return this.cinderService.checkEndpointId(req.headers['endpoint-id'])
      .then(() => {
        return this.cinderService.callServiceApi(req);
      })
      .then((result) => {
        this.forwardResponse(res, result.body, result.statusCode);
      });
  }
}