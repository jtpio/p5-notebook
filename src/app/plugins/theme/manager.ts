import { IThemeManager } from '@jupyterlab/apputils';

import { IChangedArgs } from '@jupyterlab/coreutils';

import { IDisposable, DisposableSet } from '@lumino/disposable';

import { ISignal, Signal } from '@lumino/signaling';

/**
 * A class that provides theme management.
 *
 * Note: Custom Theme Manager than core JupyterLab to be
 * able to override the `loadCSS` method.
 *
 * TODO: extends from upstream ThemeManager?
 */
export class ThemeManager implements IThemeManager {
  /**
   * Get the name of the current theme.
   */
  get theme(): string | null {
    return '';
  }

  /**
   * The names of the registered themes.
   */
  get themes(): string[] {
    return [];
  }

  /**
   * A signal fired when the application theme changes.
   */
  get themeChanged(): ISignal<
    this,
    IChangedArgs<string, string | null, string>
  > {
    return this._themeChanged;
  }

  /**
   * Load a theme CSS file by path.
   *
   * @param path - The path of the file to load.
   */
  async loadCSS(path: string): Promise<void> {
    console.log('loadCSS');
  }

  /**
   * Register a theme with the theme manager.
   *
   * @param theme - The theme to register.
   *
   * @returns A disposable that can be used to unregister the theme.
   */
  register(theme: IThemeManager.ITheme): IDisposable {
    console.log('register theme');
    return new DisposableSet();
  }

  /**
   * Set the current theme.
   *
   * @param name The name of the theme.
   */
  async setTheme(name: string): Promise<void> {
    console.log('setTheme');
  }

  /**
   * Test whether a given theme is light.
   *
   * @param name The name of the theme.
   */
  isLight(name: string): boolean {
    console.log('isLight');
    return true;
  }

  /**
   * Test whether a given theme styles scrollbars,
   * and if the user has scrollbar styling enabled.
   *
   * @param name The name of the theme.
   */
  themeScrollbars(name: string): boolean {
    console.log('isLight');
    return true;
  }

  private _themeChanged = new Signal<this, IChangedArgs<string, string | null>>(
    this
  );
}
