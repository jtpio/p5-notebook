import { KernelMessage } from "@jupyterlab/services";

import { PromiseDelegate } from "@lumino/coreutils";

import { IDisposable } from "@lumino/disposable";

import p5 from "!!raw-loader!p5/lib/p5.min.js";

import { IJupyterServer } from "../tokens";

/**
 * A kernel that executes code in an IFrame.
 */
export class KernelIFrame implements IJupyterServer.IKernelIFrame, IDisposable {
  /**
   * Instantiate a new IFrameKernel
   * @options The instantiation options for a new IFrameKernel
   */
  constructor(options: IFrameKernel.IOptions) {
    const { id, sendMessage, sessionId } = options;
    this._id = id;
    // TODO: handle session id
    this._sessionId = sessionId;
    this._sendMessage = sendMessage;

    // create the main IFrame
    this._iframe = document.createElement("iframe");
    this._iframe.style.visibility = "hidden";
    document.body.appendChild(this._iframe);

    this._initIFrame(this._iframe).then(() => {
      // TODO: handle kernel ready
      this._evalFunc(this._iframe.contentWindow, `
        console._log = console.log;
        console._error = console.error;

        window._bubbleUp = function(msg) {
          window.parent.postMessage({
            ...msg,
            "parentHeader": window._parentHeader
          });
        }

        console.log = function() {
          const args = Array.prototype.slice.call(arguments);
          window._bubbleUp({
            "event": "stream",
            "name": "stdout",
            "text": args.join(' ') + '\\n'
          });
        };
        console.info = console.log;

        console.error = function() {
          const args = Array.prototype.slice.call(arguments);
          window._bubbleUp({
            "event": "stream",
            "name": "stderr",
            "text": args.join(' ') + '\\n'
          });
        };
        console.warn = console.error;
      `);
      window.addEventListener('message', (e: MessageEvent) => {
        const msg = e.data;
        const parentHeader = msg.parentHeader as KernelMessage.IHeader<KernelMessage.MessageType>;
        if (msg.event === 'stream') {
          const content = msg as KernelMessage.IStreamMsg['content'];
          this._stream(parentHeader, content);
        }
      });
    });
  }

  /**
   * Whether the kernel is disposed.
   */
  get isDisposed() {
    return this._isDisposed;
  }

  /**
   * Get the kernel id
   */
  get id() {
    return this._id;
  }

  /**
   * Dispose the kernel.
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }
    this._isDisposed = true;
  }

  /**
   * Get the kernel iframe.
   */
  async registerIFrame(iframe: HTMLIFrameElement) {
    await this._initIFrame(iframe);
    for (const cell of this._cells) {
      this._evalFunc(iframe.contentWindow, cell);
    }
    // call the setup function
    this._evalFunc(iframe.contentWindow, "if (window.setup) window.setup()");
    this._iframes.push(iframe);
  }

  /**
   * Handle an incoming message from the client.
   * @param msg The message to handle
   */
  async handleMessage(msg: KernelMessage.IMessage) {
    // console.log(msg)
    this._busy(msg);

    const msgType = msg.header.msg_type;
    switch (msgType) {
      case "kernel_info_request":
        this._kernelInfo(msg);
        break;
      case "execute_request":
        this._execute(msg);
        break;
      case "status":
        this._status(msg);
        break;
      case "complete_request":
        this._complete(msg);
        break;
      default:
        break;
    }

    this._idle(msg);
  }

  /**
   * Send an 'idle' status message.
   * @param parent The parent message
   */
  private _idle(parent: KernelMessage.IMessage) {
    const message = KernelMessage.createMessage<KernelMessage.IStatusMsg>({
      msgType: "status",
      session: "",
      parentHeader: parent.header,
      channel: "iopub",
      content: {
        execution_state: "idle"
      }
    });
    this._sendMessage(message);
  }

  /**
   * Send a 'busy' status message.
   * @param parent The parent message
   */
  private _busy(parent: KernelMessage.IMessage) {
    const message = KernelMessage.createMessage<KernelMessage.IStatusMsg>({
      msgType: "status",
      session: "",
      parentHeader: parent.header,
      channel: "iopub",
      content: {
        execution_state: "busy"
      }
    });
    this._sendMessage(message);
  }

  /**
   * Handle a kernel_info_request message
   */
  private _kernelInfo(parent: KernelMessage.IMessage) {
    const content: KernelMessage.IInfoReply = {
      implementation: "p5",
      implementation_version: "0.1.0",
      language_info: {
        codemirror_mode: {
          name: "javascript"
        },
        file_extension: ".js",
        mimetype: "text/javascript",
        name: "javascript",
        nbconvert_exporter: "javascript",
        pygments_lexer: "javascript",
        version: "es2017"
      },
      protocol_version: "5.3",
      status: "ok",
      banner: "A p5.js kernel running in the browser",
      help_links: [
        {
          text: "p5.js Kernel",
          url: "https://github.com/jtpio/p5-notebook"
        }
      ]
    };

    const message = KernelMessage.createMessage<KernelMessage.IInfoReplyMsg>({
      msgType: "kernel_info_reply",
      channel: "shell",
      session: this._sessionId,
      content
    });

    this._sendMessage(message);
  }

  /**
   * Handle a execute_request message
   */
  private _execute(msg: KernelMessage.IMessage) {
    const parent = msg as KernelMessage.IExecuteRequestMsg;
    this._execution_count++;
    const content: KernelMessage.IExecuteReply = {
      execution_count: this._execution_count,
      status: "ok",
      user_expressions: {},
      payload: []
    };

    this._executeInput(parent);


    // store previous parent header
    this._evalFunc(this._iframe.contentWindow, `
      window._parentHeader = ${JSON.stringify(parent.header)};
    `);

    // TODO: handle errors
    this._executeResult(parent);

    const message = KernelMessage.createMessage<KernelMessage.IExecuteReplyMsg>(
      {
        msgType: "execute_reply",
        channel: "shell",
        parentHeader: parent.header,
        session: this._sessionId,
        content
      }
    );
    this._sendMessage(message);
  }

  /**
   * Send an `execute_input` message.
   */
  private _executeInput(msg: KernelMessage.IMessage) {
    const parent = msg as KernelMessage.IExecuteInputMsg;
    const code = parent.content.code;
    const message = KernelMessage.createMessage<KernelMessage.IExecuteInputMsg>(
      {
        msgType: "execute_input",
        parentHeader: parent.header,
        channel: "iopub",
        session: this._sessionId,
        content: {
          code,
          execution_count: this._execution_count
        }
      }
    );
    this._sendMessage(message);
  }

  /**
   * Send an `execute_result` message.
   */
  private _executeResult(msg: KernelMessage.IMessage) {
    const parent = msg as KernelMessage.IExecuteRequestMsg;
    const code = parent.content.code;
    const result = this._eval(code);
    const message = KernelMessage.createMessage<
      KernelMessage.IExecuteResultMsg
    >({
      msgType: "execute_result",
      parentHeader: parent.header,
      channel: "iopub",
      session: this._sessionId,
      content: {
        execution_count: this._execution_count,
        data: {
          "text/plain": result
        },
        metadata: {}
      }
    });
    this._sendMessage(message);
  }

  /**
   * Handle a status message
   */
  private _status(parent: KernelMessage.IMessage) {}

  /**
   * Handle a stream event from the kernel
   */
  private _stream(parentHeader: KernelMessage.IHeader<KernelMessage.MessageType>, content: KernelMessage.IStreamMsg['content']) {
    const message = KernelMessage.createMessage<KernelMessage.IStreamMsg>({
      channel: 'iopub',
      msgType: 'stream',
      session: this._sessionId,
      parentHeader,
      content
    })
    this._sendMessage(message);
  }

  /**
   * Handle an complete_request message
   */
  private _complete(msg: KernelMessage.IMessage) {
    const parent = msg as KernelMessage.ICompleteRequestMsg;

    // naive completion on window names only
    // TODO: improve and move logic to the iframe
    const vars = this._evalFunc(
      this._iframe.contentWindow,
      "Object.keys(window)"
    ) as string[];
    const { code, cursor_pos } = parent.content;
    const words = code.slice(0, cursor_pos).match(/(\w+)$/) ?? [];
    const word = words[0] ?? "";
    const matches = vars.filter(v => v.startsWith(word));

    const message = KernelMessage.createMessage<
      KernelMessage.ICompleteReplyMsg
    >({
      msgType: "complete_reply",
      parentHeader: parent.header,
      channel: "shell",
      session: this._sessionId,
      content: {
        matches,
        cursor_start: cursor_pos - word.length,
        cursor_end: cursor_pos,
        metadata: {},
        status: "ok"
      }
    });

    this._sendMessage(message);
  }

  /**
   * Execute code in the kernel IFrame.
   * @param code The code to execute.
   */
  private _eval(code: string) {
    // TODO: handle magics
    if (code.startsWith("%show")) {
      return "";
    }
    this._cells.push(code);
    for (const frame of this._iframes) {
      if (frame?.contentWindow) {
        this._evalFunc(frame.contentWindow, code);
      }
    }
    return this._evalFunc(this._iframe.contentWindow, code);
  }

  /**
   * Create a new IFrame
   */
  private async _initIFrame(iframe: HTMLIFrameElement) {
    const delegate = new PromiseDelegate<void>();
    if (!iframe.contentWindow) {
      delegate.reject("IFrame not ready");
      return;
    }
    const doc = iframe.contentWindow.document;
    const script = doc.createElement("script");
    doc.body.appendChild(script);
    script.textContent = p5 as string;
    script.id = "p5-src";
    this._evalFunc(
      iframe.contentWindow,
      `
      new p5();
      setTimeout(() => {
        var body = document.body;
        body.style.margin = 0;
        body.style.padding = 0;
        body.style.overflow = "hidden";
      });
    `
    );
    delegate.resolve();
    await delegate.promise;
    return iframe;
  }

  private _id: string;
  private _iframe: HTMLIFrameElement;
  private _iframes: HTMLIFrameElement[] = [];
  private _cells: string[] = [];
  private _evalFunc = new Function(
    "window",
    "code",
    "return window.eval(code);"
  );
  private _execution_count = 0;
  private _sessionId: string;
  private _isDisposed = false;
  private _sendMessage: (msg: KernelMessage.IMessage) => void;
}

/**
 * A namespace for IFrameKernel statics.
 */
export namespace IFrameKernel {
  /**
   * The instantiation options for an IFrameKernel.
   */
  export interface IOptions {
    /**
     * The kernel id.
     */
    id: string;

    /**
     * The session id.
     */
    sessionId: string;

    /**
     * The method to send messages back to the server.
     */
    sendMessage: (msg: KernelMessage.IMessage) => void;
  }
}
