import {Logger, LoggerFactory, RestController} from '../../../common';
import { NovaService } from '../../../services';

export class NovaController extends RestController {
  constructor(private novaService: NovaService) {
    super();
  }

  private static LOGGER: Logger = LoggerFactory.getLogger();

  proxyRequest(req, res): Promise<any> {
    return this.novaService.checkEndpointId(req.headers['endpoint-id'])
      .then(() => {
        return this.novaService.callServiceApi(req);
      })
      .then((result) => {
        this.forwardResponse(res, result.body, result.statusCode);
      });
  }

  createVM(req, res): Promise<any> {
    return this.novaService.createVM(req.body)
      .then(result => {
        this.respond(res, result);
      });
  }
}