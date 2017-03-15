import { Logger, LoggerFactory, RestController } from '../../../common';
import { NeutronService } from '../../../services';

export class NeutronController extends RestController {
  constructor(private neutronService: NeutronService) {
    super();
  }

  private static LOGGER: Logger = LoggerFactory.getLogger();

  proxyRequest(req, res): Promise<any> {
    return this.neutronService.checkEndpointId(req.headers['endpoint-id'])
      .then(() => {
        return this.neutronService.callServiceApi(req);
      })
      .then((result) => {
        this.forwardResponse(res, result.body, result.statusCode);
      });
  }
}