# ![p5-icon](./favicon.ico) p5-notebook ![p5-icon](./favicon.ico)

[![Build](https://github.com/jtpio/p5-notebook/actions/workflows/build.yml/badge.svg)](https://github.com/jtpio/p5-notebook/actions/workflows/build.yml)

A minimal Jupyter Notebook UI for [p5.js](https://p5js.org) kernels, powered by [JupyterLite](https://github.com/jupyterlite/jupyterlite) and the [p5.js kernel](https://github.com/jupyterlite/p5-kernel).

https://github.com/jtpio/p5-notebook/assets/591645/7193d8bb-2e0a-4465-88fe-3f3793d51576

## Usage

**✨ [Try it in your browser!](https://p5nb.vercel.app/) ✨**

## Features 🎁

### Opens with Jupyter Notebook by default 📒

By default, the p5 notebook opens with the simpler [notebook](https://github.com/jupyter/notebook) interface.

https://github.com/jtpio/p5-notebook/assets/591645/7193d8bb-2e0a-4465-88fe-3f3793d51576

### JupyterLab interface 🧪

The JupyterLab interface is still accessible via the `View > Open in JupyterLab` menu entry:

https://github.com/jtpio/p5-notebook/assets/591645/f44186a4-51a3-4417-9968-af7a5fb6cbd6

### Live preview of HTML-based sketches ⚡

With the JupyterLab interface, `.html` files can be edited and rendered live with the built-in HTML viewer:

https://github.com/jtpio/p5-notebook/assets/591645/f1cc56d0-de44-4d3c-9aa9-9ad9ef90feb4

### Support for themes 🌈

The p5 notebook includes the default JupyterLab Light and Dark themes, as well as `p5.js` branded light and dark themes:

https://github.com/jtpio/p5-notebook/assets/591645/44cdd305-b00a-406d-8d38-860152565f24

### Support for additional display languages 🌐

Just like with JupyterLab, the p5 notebook also supports additional display languages: French, Italian, Polish, Simplified Chinese and Spanish:

https://github.com/jtpio/p5-notebook/assets/591645/316613d9-71b5-4912-9adf-95f83d22fea6

### JupyterLab and Notebook features 🎨

Most of the JupyterLab and Jupyter Notebook features are also available, such as switching to the Simple Interface and opening the command palette:

https://github.com/jtpio/p5-notebook/assets/591645/15104791-6481-4c37-8447-06535c66b060

### Real Time Collaboration

Coming soon!

## Development

This repo is a JupyterLite deployment with three JupyterLab extensions in `packages/`: the p5 logo and the p5.js light and dark themes. Make sure [Node.js](https://nodejs.org) and [uv](https://docs.astral.sh/uv/) are installed, then:

```bash
# create the environment, install the dependencies and build the extensions
uv sync

# link the extensions in development mode
uv run jlpm develop

# rebuild the extensions after making changes
uv run jlpm build

# or rebuild them automatically on changes
uv run jlpm watch

# build and serve the JupyterLite site
uv run jupyter lite build
uv run jupyter lite serve
```

To bump the version of all the packages:

```bash
uv run jlpm bump:version 0.2.0
```

### UI tests

The UI tests use [Galata](https://github.com/jupyterlab/jupyterlab/tree/main/galata) and [Playwright](https://playwright.dev) against a JupyterLite build of the site:

```bash
cd ui-tests
uv run jlpm install
uv run jlpm playwright install chromium

# build the site with the Galata helpers
uv run jlpm build

# run the tests
uv run jlpm test
```

## Related projects

- nb5.js, a notebook for p5js sketches (proof of concept): https://github.com/aparrish/nb5js-proof-of-concept
- p5.js Jupyter Widget: https://github.com/jtpio/ipyp5
- [archived / demo] p5.js in the Classic Jupyter Notebook with Jupyter Widgets: https://github.com/jtpio/p5-jupyter-notebook
- Jupyter Kernels, right inside JupyterLab: https://github.com/deathbeds/jyve
- JupyterLite has:

  > - Python kernel backed by Pyodide running in a Web Worker
  >   - Initial support for interactive visualization libraries such as altair, bqplot, ipywidgets, matplotlib, and plotly
  > - JavaScript and P5.js kernels running in an IFrame

  https://github.com/jupyterlite/jupyterlite
