import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { LabIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import { Menu } from './menu';

// icon from: https://github.com/processing/p5.js-web-editor/blob/master/client/images/p5-asterisk.svg
import p5IconStr from '../../../resources/p5-asterisk.svg';

/**
 * The top plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@p5-notebook/top',
  autoStart: true,
  activate: (app: JupyterFrontEnd): void => {
    const logo = new Widget();
    const icon = new LabIcon({ name: 'p5-icon', svgstr: p5IconStr });
    icon.element({
      container: logo.node,
      elementPosition: 'center',
      margin: '2px 2px 2px 8px',
      height: 'auto',
      width: '16px'
    });
    logo.id = 'p5-logo';

    const { commands } = app;
    const menu = new Menu({ commands });
    menu.id = 'p5-menu';

    app.shell.add(logo, 'top');
    app.shell.add(menu, 'top');
  }
};

export default plugin;
