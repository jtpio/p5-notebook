// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { settingsPlugin } from '@jupyterlab/apputils-extension/lib/settingsplugin';

import { App } from './app/app';

import '@jupyterlab/application/style/index.css';

import '@jupyterlab/codemirror/style/index.css';

import '@jupyterlab/completer/style/index.css';

import '@jupyterlab/documentsearch/style/index.css';

import '@jupyterlab/notebook/style/index.css';

import 'jupyterlab-cell-flash/style/index.css';

import '../style/index.css';

/**
 * The default paths.
 */
const paths: JupyterFrontEndPlugin<JupyterFrontEnd.IPaths> = {
  id: '@jupyterlab/apputils-extension:paths',
  activate: (app: App): JupyterFrontEnd.IPaths => {
    return app.paths;
  },
  autoStart: true,
  provides: JupyterFrontEnd.IPaths
};

/**
 * The main function
 */
async function main(): Promise<void> {
  const app = new App();
  const mods = [
    require('./app/plugins/notebook'),
    require('./app/plugins/theme'),
    require('./app/plugins/top'),
    require('@jupyterlab/shortcuts-extension'),
    require('@jupyterlab/theme-dark-extension'),
    require('@jupyterlab/theme-light-extension'),
    require('jupyterlab-cell-flash'),
    require('jupyterlab-theme-toggle'),
    require('jupyterlab-topbar-extension')
  ];

  app.registerPlugin(paths);
  app.registerPlugin(settingsPlugin);
  app.registerPluginModules(mods);

  await app.start();
  await app.restored;
}

window.addEventListener('load', main);
