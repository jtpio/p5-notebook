import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the @p5-notebook/theme extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@p5-notebook/theme',
  requires: [IThemeManager],
  autoStart: true,
  activate: (app: JupyterFrontEnd, manager: IThemeManager) => {
    console.log('JupyterLab extension @p5-notebook/theme is activated!');
    const style = '@p5-notebook/theme/index.css';

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
