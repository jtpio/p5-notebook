// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { App } from './app/app';

import '@jupyterlab/application/style/index.css';

import '@jupyterlab/codemirror/style/index.css';

import '@jupyterlab/completer/style/index.css';

import '@jupyterlab/notebook/style/index.css';

import '@jupyterlab/theme-light-extension/style/index.css';

import '../style/index.css';

/**
 * The main function
 */
async function main(): Promise<void> {
  const plugins = [
    require('./app/plugins/notebook'),
    require('jupyterlab-topbar-extension')
  ];
  const app = new App();
  app.registerPluginModules(plugins);
  await app.start();
  await app.restored;
}

window.addEventListener('load', main);
