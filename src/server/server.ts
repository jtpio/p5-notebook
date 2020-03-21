import { Contents } from "./contents";

import { KernelSpecs } from "./kernelspecs";

import { Kernels } from "./kernels";

import { Sessions } from "./sessions";

/**
 * A (very, very) simplified Jupyter Server running in the browser.
 */
export class JupyterServer {
  /**
   * Construct a new JupyterServer.
   * @options the instantiation options for the Jupyter Server.
   */
  constructor(options: JupyterServer.IOptions) {}

  /**
   * Handle an incoming request from the client.
   */
  async fetch(
    req: Request,
    init?: RequestInit | null | undefined
  ): Promise<Response> {
    // console.log('req', req);

    // dispatch requests
    // TODO: reuse an existing routing library?
    if (req.url.match(Contents.CONTENTS_SERVICE_URL)) {
      return this._contents.dispatch(req);
    } else if (req.url.match(KernelSpecs.KERNELSPEC_SERVICE_URL)) {
      return this._kernelspecs.dispatch(req);
    } else if (req.url.match(Sessions.SESSION_SERVICE_URL)) {
      return this._sessions.dispatch(req);
    } else if (req.url.match(Kernels.KERNEL_SERVICE_URL)) {
      return this._kernels.dispatch(req);
    }
    return new Response(null);
  }

  /**
   * Register an IFrame for the given kernel id.
   */
  async registerIFrame(kernelId: string, iframe: HTMLIFrameElement) {
    return this._kernels.registerIFrame(kernelId, iframe);
  }

  private _kernelspecs = new KernelSpecs();
  private _contents = new Contents();
  private _kernels = new Kernels();
  private _sessions = new Sessions({ kernels: this._kernels });
}

/**
 * A namespace for JupyterServer statics.
 */
export namespace JupyterServer {
  /**
   * The instantiation options for a Jupyter Server.
   */
  export interface IOptions {}
}
