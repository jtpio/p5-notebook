import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the @p5-notebook/p5-theme-ligh extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@p5-notebook/p5-theme-light',
  requires: [IThemeManager],
  autoStart: true,
  activate: (app: JupyterFrontEnd, manager: IThemeManager) => {
    const style = '@p5-notebook/p5-theme-light/index.css';

    manager.register({
      name: 'p5.js',
      isLight: true,
      themeScrollbars: true,
      load: () => manager.loadCSS(style),
      unload: () => Promise.resolve(undefined)
    });
  }
};

export default extension;
