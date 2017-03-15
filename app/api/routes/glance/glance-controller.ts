import { Logger, LoggerFactory, RestController } from '../../../common';
import { GlanceService } from '../../../services';

export class GlanceController extends RestController {
  constructor(private glanceService: GlanceService) {
    super();
  }

  private static LOGGER: Logger = LoggerFactory.getLogger();

  proxyRequest(req, res): Promise<any> {
    return this.glanceService.checkEndpointId(req.headers['endpoint-id'])
      .then(() => {
        return this.glanceService.callServiceApi(req);
      })
      .then((result) => {
        this.forwardResponse(res, result.body, result.statusCode);
      });
  }
}