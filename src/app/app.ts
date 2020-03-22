import { JupyterFrontEnd } from '@jupyterlab/application';

import { BrowserServiceManager } from './service';

import { Shell } from './shell';

/**
 * App is the main application class. It is instantiated once and shared.
 */
export class App extends JupyterFrontEnd<Shell> {
  /**
   * Construct a new App object.
   *
   * @param options The instantiation options for an App.
   */
  constructor(options: App.IOptions = { shell: new Shell() }) {
    super({
      shell: options.shell,
      serviceManager: new BrowserServiceManager()
    });
  }

  /**
   * The name of the application.
   */
  readonly name = 'p5-notebook';

  /**
   * A namespace/prefix plugins may use to denote their provenance.
   */
  readonly namespace = this.name;

  /**
   * The version of the application.
   */
  readonly version = 'unknown';
}

/**
 * A namespace for App statics.
 */
export namespace App {
  /**
   * The instantiation options for an App.
   */
  export type IOptions = JupyterFrontEnd.IOptions<Shell>;
}
