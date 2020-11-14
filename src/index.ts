// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { PageConfig } from '@jupyterlab/coreutils';
// eslint-disable-next-line
__webpack_public_path__ = PageConfig.getOption('fullStaticUrl') + '/';

import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { ITranslator, TranslationManager } from '@jupyterlab/translation';

import { settingsPlugin } from '@jupyterlab/apputils-extension/lib/settingsplugin';

import { App } from './app/app';

import '@jupyterlab/application/style/index.css';

import '@jupyterlab/codemirror/style/index.css';

import '@jupyterlab/completer/style/index.css';

import '@jupyterlab/documentsearch/style/index.css';

import '@jupyterlab/launcher/style/index.css';

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
 * A simplified Translator
 */
const translator: JupyterFrontEndPlugin<ITranslator> = {
  id: '@jupyterlab/translation:translator',
  activate: (app: App): ITranslator => {
    const translationManager = new TranslationManager();
    return translationManager;
  },
  autoStart: true,
  provides: ITranslator
};

/**
 * The main function
 */
async function main(): Promise<void> {
  const app = new App();
  const mods = [
    require('./app/plugins/launcher'),
    require('./app/plugins/notebook'),
    require('./app/plugins/theme'),
    require('./app/plugins/top'),
    require('./app/plugins/splash'),
    require('@jupyterlab/shortcuts-extension'),
    require('@jupyterlab/theme-dark-extension'),
    require('@jupyterlab/theme-light-extension'),
    require('jupyterlab-cell-flash'),
    require('jupyterlab-theme-toggle'),
    require('jupyterlab-topbar-extension')
  ];

  app.registerPlugin(paths);
  app.registerPlugin(translator);
  app.registerPlugin(settingsPlugin);
  app.registerPluginModules(mods);

  await app.start();
  await app.restored;
}

window.addEventListener('load', main);
