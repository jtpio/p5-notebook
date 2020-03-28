import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { ThemeManager } from '../theme/manager';

namespace CommandIDs {
  export const changeTheme = 'apputils:change-theme';
}

/**
 * The theme plugin.
 */
const plugin: JupyterFrontEndPlugin<IThemeManager> = {
  id: '@jupyterlab/apputils-extension:themes',
  autoStart: true,
  provides: IThemeManager,
  requires: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    settings: ISettingRegistry
  ): IThemeManager => {
    const host = app.shell;
    const commands = app.commands;
    const key = plugin.id;
    const manager = new ThemeManager({
      key,
      host,
      settings,
      splash: undefined,
      url: ''
    });

    commands.addCommand(CommandIDs.changeTheme, {
      execute: args => {
        const theme = args['theme'] as string;
        if (theme === manager.theme) {
          return;
        }
        return manager.setTheme(theme);
      }
    });

    return manager;
  }
};

export default plugin;
