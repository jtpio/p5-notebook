import { IThemeManager } from '@jupyterlab/apputils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ThemeManager } from '../theme/manager';

/**
 * The theme plugin.
 */
const plugin: JupyterFrontEndPlugin<IThemeManager> = {
  id: '@jupyterlab/apputils-extension:themes',
  autoStart: true,
  provides: IThemeManager,
  activate: (app: JupyterFrontEnd): IThemeManager => {
    const manager = new ThemeManager();
    return manager;
  }
};

export default plugin;
