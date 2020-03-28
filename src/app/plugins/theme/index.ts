import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { ThemeManager } from '../theme/manager';

/**
 * The command IDs used by the plugin.
 */
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

    manager.themeChanged.connect((sender, args) => {
      const currentTheme = args.newValue;
      document.body.dataset.jpThemeLight = String(
        manager.isLight(currentTheme)
      );
      document.body.dataset.jpThemeName = currentTheme;
      if (
        document.body.dataset.jpThemeScrollbars !==
        String(manager.themeScrollbars(currentTheme))
      ) {
        document.body.dataset.jpThemeScrollbars = String(
          manager.themeScrollbars(currentTheme)
        );
      }
      // Set any CSS overrides
      manager.loadCSSOverrides();
      commands.notifyCommandChanged(CommandIDs.changeTheme);
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
