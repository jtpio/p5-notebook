import { Session } from '@jupyterlab/services';

import { UUID } from '@lumino/coreutils';

import { Kernels } from './kernels';

import { Router } from './router';

import { IJupyterServer } from '../tokens';

const DEFAULT_NAME = 'test.ipynb';

/**
 * A class to handle requests to /api/sessions
 */
export class Sessions implements IJupyterServer.IRoutable {
  /**
   * Construct a new Sessions.
   *
   * @param options The instantiation options for a Sessions.
   */
  constructor(options: Sessions.IOptions) {
    this._kernels = options.kernels;

    this._router.add('POST', '/api/sessions.*', async (req: Request) => {
      const session = this.startNew();
      return new Response(JSON.stringify(session), { status: 201 });
    });
  }

  /**
   * Start a new session
   * TODO: read path and name
   */
  startNew(): Session.IModel {
    const sessionId = UUID.uuid4();
    const kernel = this._kernels.startNew('');
    const session: Session.IModel = {
      id: sessionId,
      path: DEFAULT_NAME,
      name: DEFAULT_NAME,
      type: 'notebook',
      kernel: {
        id: kernel.id,
        name: kernel.name
      }
    };
    return session;
  }

  /**
   * Dispatch a request to the local router.
   *
   * @param req The request to dispatch.
   */
  dispatch(req: Request): Promise<Response> {
    return this._router.route(req);
  }

  private _router = new Router();
  private _kernels: Kernels;
}

/**
 * A namespace for sessions statics.
 */
export namespace Sessions {
  /**
   * The url for the sessions service.
   */
  export const SESSION_SERVICE_URL = '/api/sessions';

  /**
   * The instantiation options for the sessions.
   */
  export interface IOptions {
    /**
     * A reference to the kernels service.
     */
    kernels: Kernels;
  }
}
