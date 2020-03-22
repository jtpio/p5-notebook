import { Contents as ServerContents } from '@jupyterlab/services';

import { Router } from './router';

import { IJupyterServer } from '../tokens';

import DEFAULT_NB from './resources/default.ipynb';

/**
 * A class to handle requests to /api/contents
 */
export class Contents implements IJupyterServer.IRoutable {
  /**
   * Construct a new Contents.
   */
  constructor() {
    this._router.add(
      'GET',
      '/api/contents/(.*)/checkpoints',
      async (req: Request) => {
        return new Response(JSON.stringify(Private.DEFAULT_CHECKPOINTS));
      }
    );
    this._router.add('GET', '/api/contents/.*', async (req: Request) => {
      const nb = this.get();
      return new Response(JSON.stringify(nb));
    });
    this._router.add('PUT', '/api/contents/.*', async (req: Request) => {
      const nb = this.get();
      return new Response(JSON.stringify(nb));
    });
  }

  /**
   * Get the default notebook.
   */
  get(): ServerContents.IModel {
    return Private.DEFAULT_NOTEBOOK;
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
}

/**
 * A namespace for Contents statics.
 */
export namespace Contents {
  /**
   * The url for the contents service.
   */
  export const CONTENTS_SERVICE_URL = '/api/contents';
}

/**
 * A namespace for private data.
 */
namespace Private {
  /**
   * The default checkpoints.
   */
  export const DEFAULT_CHECKPOINTS = [
    { id: 'checkpoint', last_modified: '2020-03-15T13:51:59.816052Z' }
  ];

  /**
   * The default notebook to serve.
   */
  export const DEFAULT_NOTEBOOK: ServerContents.IModel = {
    name: 'default.ipynb',
    path: 'default.ipynb',
    last_modified: '2020-03-18T18:41:01.243007Z',
    created: '2020-03-18T18:41:01.243007Z',
    content: JSON.parse(DEFAULT_NB),
    format: 'json',
    mimetype: '',
    size: DEFAULT_NB.length,
    writable: true,
    type: 'notebook'
  };
}
