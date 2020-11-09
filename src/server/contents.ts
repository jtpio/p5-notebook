import { Contents as ServerContents } from '@jupyterlab/services';

import { INotebookContent } from '@jupyterlab/nbformat';

import { Router } from './router';

import { IJupyterServer } from '../tokens';

import DEFAULT_NB from '../resources/default.ipynb';

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
    this._router.add('GET', Private.FILE_NAME_REGEX, async (req: Request) => {
      const filename = Private.parseFilename(req.url);
      const nb = this.get(filename);
      return new Response(JSON.stringify(nb));
    });
    this._router.add('PUT', Private.FILE_NAME_REGEX, async (req: Request) => {
      const filename = Private.parseFilename(req.url);
      const nb = this.get(filename);
      return new Response(JSON.stringify(nb));
    });
  }

  /**
   * Get a notebook by name.
   *
   * @param name The name of the notebook.
   */
  get(name: string): ServerContents.IModel {
    if (name === 'example.ipynb') {
      return Private.DEFAULT_NOTEBOOK;
    }
    return Private.EMPTY_NOTEBOOK;
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
   * The regex to match file names.
   */
  export const FILE_NAME_REGEX = new RegExp(/(\w+\.ipynb)/);

  /**
   * Parse the file name from a URL.
   *
   * @param url The request url.
   */
  export const parseFilename = (url: string): string => {
    const matches = new URL(url).pathname.match(FILE_NAME_REGEX);
    return matches?.[0] ?? '';
  };

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
    name: 'example.ipynb',
    path: 'example.ipynb',
    last_modified: '2020-03-18T18:41:01.243007Z',
    created: '2020-03-18T18:41:01.243007Z',
    content: JSON.parse(DEFAULT_NB),
    format: 'json',
    mimetype: '',
    size: DEFAULT_NB.length,
    writable: true,
    type: 'notebook'
  };

  /**
   * The content for an empty notebook.
   */
  const EMPTY_NB: INotebookContent = {
    metadata: {
      orig_nbformat: 4
    },
    nbformat_minor: 4,
    nbformat: 4,
    cells: []
  };

  /**
   * The default notebook to serve.
   */
  export const EMPTY_NOTEBOOK: ServerContents.IModel = {
    name: 'untitled.ipynb',
    path: 'untitled.ipynb',
    last_modified: '2020-03-18T18:41:01.243007Z',
    created: '2020-03-18T18:41:01.243007Z',
    content: EMPTY_NB,
    format: 'json',
    mimetype: 'application/json',
    size: JSON.stringify(EMPTY_NB).length,
    writable: true,
    type: 'notebook'
  };
}
