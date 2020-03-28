import {
  ThemeManager as LabThemeManager,
  IThemeManager
} from '@jupyterlab/apputils';

import { IDisposable } from '@lumino/disposable';

import lightTheme from '!!raw-loader!@jupyterlab/theme-light-extension/style/index.css';
import lightThemeVars from '!!raw-loader!@jupyterlab/theme-light-extension/style/variables.css';

import darkTheme from '!!raw-loader!@jupyterlab/theme-dark-extension/style/index.css';
import darkThemeVars from '!!raw-loader!@jupyterlab/theme-dark-extension/style/variables.css';

const LIGHT_THEME = (lightThemeVars as string) + (lightTheme as string);
const DARK_THEME = (darkThemeVars as string) + (darkTheme as string);

/**
 * A class that provides theme management.
 *
 * Note: Custom Theme Manager than core JupyterLab to be
 * able to override the `loadCSS` method.
 *
 */
export class ThemeManager extends LabThemeManager {
  register(theme: IThemeManager.ITheme): IDisposable {
    const { name } = theme;

    return super.register({
      ...theme,
      name,
      load: () => this._loadCSS(name),
      unload: () => this._unloadCSS(name)
    });
  }

  private async _loadCSS(name: string): Promise<void> {
    const style = document.createElement('style');
    if (name === 'JupyterLab Dark') {
      style.textContent = DARK_THEME;
    } else {
      style.textContent = LIGHT_THEME;
    }
    document.body.appendChild(style);
    this._style = style;
  }

  private async _unloadCSS(name: string): Promise<void> {
    this._style?.parentElement?.removeChild(this._style);
  }

  private _style: HTMLStyleElement;
}
