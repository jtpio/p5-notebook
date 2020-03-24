import { CommandRegistry } from '@lumino/commands';

import { MenuBar } from '@lumino/widgets';

import { FileMenu } from './file';

/**
 * The main menu.
 */
export class Menu extends MenuBar {
  /**
   * Construct the menu bar.
   *
   * @param options The instantiation options for a Menu.
   */
  constructor(options: Menu.IOptions) {
    super();
    const { commands } = options;
    this._fileMenu = new FileMenu({ commands });

    this.addMenu(this._fileMenu.menu);
  }

  private _fileMenu: FileMenu;
}

/**
 * A namespaces for `Menu` statics.
 */
export namespace Menu {
  /**
   * The instantiation options for a Menu.
   */
  export interface IOptions {
    /**
     * The command registry.
     */
    commands: CommandRegistry;
  }
}
