# ![p5-icon](./favicon.ico) p5-notebook ![p5-icon](./favicon.ico)

[![Github Actions Status](https://github.com/jtpio/p5-notebook/workflows/Build/badge.svg)](https://github.com/jtpio/p5-notebook/actions)

A minimal Jupyter Notebook UI for [p5.js](https://p5js.org) kernels.

![jupyterlite-demo](https://user-images.githubusercontent.com/591645/135714189-8ca296e5-22de-4369-bd9d-62ad07bb53f9.gif)

## Usage

**✨ [Try it in your browser!](https://p5-notebook.now.sh/) ✨**

## Dev install

This repo includes a couple of additional plugins to tweak the Jupyter UI. To setup a local environment and be able to iterate on them, make sure [Node.js](https://nodejs.org) is installed, then:

```bash
# Clone the repo to your local environment
# Change directory to the fork directory

# create a new enviroment
mamba create --name p5-notebook -c conda-forge python=3.9 yarn jupyterlab jupyter-packaging
conda activate p5-notebook

# Install package in development mode
python -m pip install -e .

# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite

# Rebuild the extension Typescript source after making changes
jlpm run build
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
