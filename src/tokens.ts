import { KernelMessage } from "@jupyterlab/services";

/**
 * A namespace for IJupyterServer statics.
 */
export namespace IJupyterServer {
  /**
   * An interface for a IFramed based kernel.
   */
  export interface IKernelIFrame {
    /**
     * Register an IFrame from the frontend.
     */
    registerIFrame(iframe: HTMLIFrameElement): void;

    /**
     * Handle an incoming message from the server.
     * @param msg The message to handle
     */
    handleMessage: (msg: KernelMessage.IMessage) => Promise<void>;
  }

  /**
   * An interface for routing requests.
   */
  export interface IRoutable {
    /**
     * Dispatch a request.
     * @param req The request to dispatch.
     */
    dispatch: (req: Request) => void;
  }
}
