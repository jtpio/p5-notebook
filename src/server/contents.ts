import { Router } from "./router";

import { IJupyterServer } from "../tokens";

/**
 * A class to handle requests to /api/contents
 */
export class Contents implements IJupyterServer.IRoutable {
  /**
   * Construct a new Contents.
   */
  constructor() {
    this._router.add(
      "GET",
      "/api/contents/(.*)/checkpoints",
      async (req: Request) => {
        return new Response(JSON.stringify(Private.DEFAULT_CHECKPOINTS));
      }
    );
    this._router.add("GET", "/api/contents/.*", async (req: Request) => {
      const nb = this.get();
      return new Response(JSON.stringify(nb));
    });
    this._router.add("PUT", "/api/contents/.*", async (req: Request) => {
      const nb = this.get();
      return new Response(JSON.stringify(nb));
    });
  }

  /**
   * Get the default notebook.
   */
  get() {
    return Private.DEFAULT_NOTEBOOK;
  }

  /**
   * Dispatch a request to the local router.
   * @param req The request to dispatch.
   */
  dispatch(req: Request) {
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
  export const CONTENTS_SERVICE_URL = "/api/contents";
}

/**
 * A namespace for private data.
 */
namespace Private {
  /**
   * The default checkpoints.
   */
  export const DEFAULT_CHECKPOINTS = [
    { id: "checkpoint", last_modified: "2020-03-15T13:51:59.816052Z" }
  ];

  /**
   * The default notebook to serve.
   */
  export const DEFAULT_NOTEBOOK = {
    name: "Untitled12.ipynb",
    path: "Untitled12.ipynb",
    last_modified: "2020-03-18T18:41:01.243007Z",
    created: "2020-03-18T18:41:01.243007Z",
    content: {
      cells: [
        {
          cell_type: "markdown",
          metadata: {},
          source:
            "# p5 notebook\n\nA minimal Jupyter notebook UI for [p5.js](https://p5js.org) kernels."
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: "First let's define a couple of variables:"
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source: "var n = 4;\nvar speed = 1;"
        },
        {
          cell_type: "markdown",
          metadata: {},
          source:
            "## The `setup` function\n\nThe usual p5 setup function, which creates the canvas."
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source:
            "function setup () {\n  createCanvas(innerWidth, innerHeight);\n  rectMode(CENTER);\n}"
        },
        {
          cell_type: "markdown",
          metadata: {},
          source:
            "## The `draw` function\n\nFrom the [p5.js documentation](https://p5js.org/reference/#/p5/draw):\n\n> The `draw()` function continuously executes the lines of code contained inside its block until the program is stopped or `noLoop()` is called."
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source:
            "function draw() {\n  background('#ddd');\n  translate(innerWidth / 2, innerHeight / 2);\n  for (let i = 0; i < n; i++) {\n    push();\n    rotate(frameCount * speed / 1000 * (i + 1));\n    fill(i * 5, i * 100, i * 150);\n    const s = 200 - i * 10;\n    rect(0, 0, s, s);\n    pop();\n  }\n}"
        },
        {
          cell_type: "markdown",
          metadata: {},
          source:
            "## Show the sketch\n\nNow let's show the sketch by using the `%show` magic:"
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source: "%show"
        },
        {
          cell_type: "markdown",
          metadata: {},
          source:
            "## Tweak the values\n\nWe can also tweak some values in real time:"
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source: "speed = 3"
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source: "n = 20"
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: "We can also show the sketch a second time:"
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: { trusted: true },
          outputs: [],
          source: "%show"
        }
      ],
      metadata: {
        kernelspec: {
          display_name: "p5.js",
          language: "javascript",
          name: "p5"
        },
        language_info: {
          codemirror_mode: { name: "javascript" },
          file_extension: ".js",
          mimetype: "text/javascript",
          name: "javascript",
          nbconvert_exporter: "javascript",
          pygments_lexer: "javascript",
          version: "es2017"
        }
      },
      nbformat: 4,
      nbformat_minor: 4
    },
    format: "json",
    mimetype: null,
    size: 3139,
    writable: true,
    type: "notebook"
  };
}
