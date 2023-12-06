# ![p5-icon](./favicon.ico) p5-notebook ![p5-icon](./favicon.ico)

[![Github Actions Status](https://github.com/jtpio/p5-notebook/workflows/Build/badge.svg)](https://github.com/jtpio/p5-notebook/actions)

A minimal Jupyter Notebook UI for [p5.js](https://p5js.org) kernels.

https://github.com/jtpio/p5-notebook/assets/591645/7193d8bb-2e0a-4465-88fe-3f3793d51576

## Usage

**✨ [Try it in your browser!](https://p5nb.vercel.app/) ✨**

## Features 🎁

### Opens with Jupyter Notebook by default 📒

By default, the p5 notebook opens with the simpler [notebook](https://github.com/jupyter/notebook) interface.

https://github.com/jtpio/p5-notebook/assets/591645/7193d8bb-2e0a-4465-88fe-3f3793d51576

### JupyterLab interface 🧪

The JupyterLab interface is still accessible via the `View > Open in JupyterLab` menu:

https://github.com/jtpio/p5-notebook/assets/591645/f44186a4-51a3-4417-9968-af7a5fb6cbd6

### Live preview of HTML-based sketches ⚡

With the JupyterLab interface, `.html` files can be edited and rendered live with the built-in HTML viewer:

https://github.com/jtpio/p5-notebook/assets/591645/f1cc56d0-de44-4d3c-9aa9-9ad9ef90feb4

### Support for themes 🌈

The p5 notebook includes the default JupyterLab Light and Dark themes, as well as `p5.js` branded Light and Dark themes:

https://github.com/jtpio/p5-notebook/assets/591645/44cdd305-b00a-406d-8d38-860152565f24

### Support for additional display languages 🌐

Just like in JupyterLab, the p5 notebook also supports additional display languages like French and Simplified Chinese:

https://github.com/jtpio/p5-notebook/assets/591645/316613d9-71b5-4912-9adf-95f83d22fea6

### JupyterLab and RetroLab features 🎨

Most of the JupyterLab and RetroLab features are also available, such as switching to the Simple Interface and opening the command palette:

https://github.com/jtpio/p5-notebook/assets/591645/15104791-6481-4c37-8447-06535c66b060

### Real Time Collaboration

Coming soon!

## Dev install

This repo includes a couple of additional plugins to tweak the Jupyter UI. To setup a local environment and be able to iterate on them, make sure [Node.js](https://nodejs.org) is installed, then:

```bash
# install dependencies
pixi install

# Install package in development mode
pixi run develop

# Rebuild the extension Typescript source after making changes
pixi run build
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
