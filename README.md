# ![p5-icon](./favicon.ico) p5-notebook ![p5-icon](./favicon.ico)

[![Github Actions Status](https://github.com/jtpio/p5-notebook/workflows/Build/badge.svg)](https://github.com/jtpio/p5-notebook/actions)

A minimal Jupyter Notebook UI for [p5.js](https://p5js.org) kernels.

![intro-retro](https://user-images.githubusercontent.com/591645/135836629-4fb3e6f7-fde5-41d7-bea7-7bd714c5f428.gif)

## Usage

**✨ [Try it in your browser!](https://p5nb.now.sh/) ✨**

## Features 🎁

### Opens with RetroLab by default 📒

By default, the p5 notebook opens with the simpler [retro](https://github.com/jupyterlab/retrolab) interface.

![intro-retro](https://user-images.githubusercontent.com/591645/135836629-4fb3e6f7-fde5-41d7-bea7-7bd714c5f428.gif)

### JupyterLab interface 🧪

The JupyterLab interface is still accessible via the `View > Open in JupyterLab` menu:

![open-jupyterlab](https://user-images.githubusercontent.com/591645/135836658-f315dffb-3733-405c-af8b-a40444c3a55a.gif)

### Live preview of HTML-based sketches ⚡

With the JupyterLab interface, `.html` files can be edited and rendered live with the built-in HTML viewer:

![html-viewer](https://user-images.githubusercontent.com/591645/135836723-7e80fe17-4587-43ce-94cf-45d7353cb57c.gif)

### Support for themes 🌈

The p5 notebook includes the default JupyterLab Light and Dark themes, as well as `p5.js` branded Light and Dark themes:

![themes](https://user-images.githubusercontent.com/591645/135837172-69d1d709-eb8f-4071-87b9-132a035e08cf.gif)

### Support for additional display languages 🌐

Just like in JupyterLab, the p5 notebook also supports additional display languages like French and Simplified Chinese:

![display-languages](https://user-images.githubusercontent.com/591645/135838407-2ff06596-10da-4d04-ad71-3139ae692211.gif)

### Real Time Collaboration

Users can edit code and work together on the same sketch:

![rtc](https://user-images.githubusercontent.com/591645/135981928-901c93a5-9c90-4ffe-8254-ad3e28d8a145.gif)

### JupyterLab and RetroLab features 🎨

Most of the JupyterLab and RetroLab features are also available, such as switching to the Simple Interface and opening the command palette:

![simple-palette](https://user-images.githubusercontent.com/591645/135837214-860c5a92-b46e-4cd6-aeac-3b0c47ad9329.gif)

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
