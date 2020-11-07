import { KernelSpec } from '@jupyterlab/services';

import { Router } from './router';

import { IJupyterServer } from '../tokens';

/**
 * A class to handle requests to /api/kernelspecs
 */
export class KernelSpecs implements IJupyterServer.IRoutable {
  /**
   * Construct a new KernelSpecs.
   */
  constructor() {
    this._router.add('GET', '/api/kernelspecs', async (req: Request) => {
      const specs = this.get();
      return new Response(JSON.stringify(specs));
    });
  }

  /**
   * Get the kernel specs.
   */
  get(): KernelSpec.ISpecModels {
    return Private.DEFAULT_SPECS;
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
 * A namespace for KernelSpecs statics.
 */
export namespace KernelSpecs {
  /**
   * The url for the kernelspec service.
   */
  export const KERNELSPEC_SERVICE_URL = '/api/kernelspecs';
}

/**
 * A namespace for private data.
 */
namespace Private {
  export const DEFAULT_SPECS: KernelSpec.ISpecModels = {
    default: 'p5',
    kernelspecs: {
      p5: {
        name: 'p5',
        display_name: 'p5.js',
        language: 'javascript',
        argv: [],
        spec: {
          argv: [],
          env: {},
          display_name: 'p5.js',
          language: 'javascript',
          interrupt_mode: 'message',
          metadata: {}
        },
        resources: {
          'logo-32x32': '/kernelspecs/p5/logo-32x32.png',
          'logo-64x64': '/build/resources/p5js-square-logo.svg'
        }
      },
      pyp5: {
        name: 'pyp5',
        display_name: 'pyp5js',
        language: 'python',
        argv: [],
        spec: {
          argv: [],
          env: {},
          display_name: 'pyp5js',
          language: 'python',
          interrupt_mode: 'message',
          metadata: {}
        },
        resources: {
          'logo-32x32': '/kernelspecs/p5/logo-32x32.png',
          'logo-64x64': '/build/resources/pyp5js.svg'
        }
      }
    }
  };
}
