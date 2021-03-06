import { ObservableMap } from '@jupyterlab/observables';

import { Kernel, KernelMessage } from '@jupyterlab/services';

import {
  deserialize,
  serialize
} from '@jupyterlab/services/lib/kernel/serialize';

import { Server as WebSocketServer } from 'mock-socket';

import { KernelIFrame } from './kernel';

import { IJupyterServer } from '../tokens';

/**
 * A class to handle requests to /api/kernels
 */
export class Kernels implements IJupyterServer.IRoutable {
  /**
   * Start a new kernel.
   *
   * @param sessionId The session id.
   */
  startNew(sessionId: string): Kernel.IModel {
    const id = sessionId;
    const kernelUrl = `${Kernels.WS_BASE_URL}/api/kernels/${id}/channels`;
    const wsServer = new WebSocketServer(kernelUrl);

    // TODO: handle multiple connections to the same kernel
    wsServer.on('connection', socket => {
      const sendMessage = (msg: KernelMessage.IMessage): void => {
        const message = serialize(msg);
        socket.send(message);
      };

      const kernel = new KernelIFrame({ id, sendMessage, sessionId });
      this._kernels.set(id, kernel);

      socket.on('message', (message: string | ArrayBuffer) => {
        if (message instanceof ArrayBuffer) {
          message = new Uint8Array(message).buffer;
        }
        const msg = deserialize(message);
        kernel.handleMessage(msg);
      });

      socket.on('close', () => {
        kernel.dispose();
        this._kernels.delete(id);
      });
    });

    const model = {
      id,
      name: 'p5.js'
    };
    return model;
  }

  /**
   * Fetch an IFrame by kernel id
   *
   * @param kernelId The id of the kernel.
   * @param iframe The IFrame to register.
   */
  registerIFrame(
    kernelId: string,
    iframe: HTMLIFrameElement
  ): Promise<void> | undefined {
    return this._kernels.get(kernelId)?.registerIFrame(iframe);
  }

  /**
   * Dispatch a request to the local router.
   *
   * @param req The request to dispatch.
   */
  dispatch(req: Request): Response {
    // TODO: handle kernel lifecycle
    return new Response(null);
  }

  private _kernels = new ObservableMap<KernelIFrame>();
}

/**
 * A namespace for Kernels statics.
 */
export namespace Kernels {
  /**
   * The base url for the Kernels manager
   */
  export const WS_BASE_URL = `${
    window.location.protocol === 'https:' ? 'wss' : 'ws'
  }://${window.location.host}`;

  /**
   * The kernel service URL.
   */
  export const KERNEL_SERVICE_URL = '/api/kernels';
}
