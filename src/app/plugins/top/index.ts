import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { LabIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import { MainMenu } from './menu';

import { IMainMenu } from './tokens';

// icon from: https://github.com/processing/p5.js-web-editor/blob/master/client/images/p5-asterisk.svg
import p5IconStr from '../../../resources/p5-asterisk.svg';

/**
 * A list of resources to show in the help menu.
 */
const RESOURCES = [
  {
    text: 'p5.js Reference',
    url: 'https://p5js.org/reference'
  },
  {
    text: 'About Jupyter',
    url: 'https://jupyter.org'
  },
  {
    text: 'Markdown Reference',
    url: 'https://commonmark.org/help/'
  }
];

/**
 * The command IDs used by the top plugin.
 */
namespace CommandIDs {
  export const open = 'help:open';

  export const about = 'help:about';
}

/**
 * The top plugin.
 */
const plugin: JupyterFrontEndPlugin<IMainMenu> = {
  id: '@p5-notebook/top',
  autoStart: true,
  provides: IMainMenu,
  activate: (app: JupyterFrontEnd): IMainMenu => {
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
    const menu = new MainMenu({ commands });
    menu.id = 'p5-menu';

    commands.addCommand(CommandIDs.open, {
      label: args => args['text'] as string,
      execute: args => {
        const url = args['url'] as string;
        window.open(url);
      }
    });

    const resourcesGroup = RESOURCES.map(args => ({
      args,
      command: CommandIDs.open
    }));

    menu.helpMenu.addGroup(resourcesGroup);

    app.shell.add(logo, 'top');
    app.shell.add(menu, 'top');

    return menu;
  }
};

export default plugin;
