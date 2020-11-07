import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { ILauncher, LauncherModel, Launcher } from '@jupyterlab/launcher';

import { launcherIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import { IMainMenu } from '../top/tokens';

/**
 * The command IDs used by the launcher plugin.
 */
namespace CommandIDs {
  export const create = 'launcher:create';
}

/**
 * A service providing an interface to the launcher.
 */
const plugin: JupyterFrontEndPlugin<ILauncher> = {
  id: '@p5-notebook/launcher-extension:plugin',
  provides: ILauncher,
  optional: [IMainMenu],
  autoStart: true,
  activate: (app: JupyterFrontEnd, menu: IMainMenu) => {
    const { commands, shell } = app;
    const model = new LauncherModel();

    commands.addCommand(CommandIDs.create, {
      label: 'New Launcher',
      execute: () => {
        const id = 'launcher';
        const callback = (item: Widget): void => {
          shell.add(item, 'main', { ref: id });
        };
        const launcher = new Launcher({
          model,
          cwd: '',
          callback,
          commands
        });

        launcher.id = id;
        launcher.model = model;
        launcher.title.icon = launcherIcon;
        launcher.title.label = 'Launcher';

        shell.add(launcher, 'main');

        return launcher;
      }
    });

    // add commands to the menu
    if (menu) {
      menu.fileMenu.addGroup([{ command: CommandIDs.create }]);
    }

    // create a new launcher by default on app startup
    app.restored.then(() => {
      commands.execute(CommandIDs.create);
    });

    return model;
  }
};

/**
 * Export the plugins as default.
 */

export default plugin;
