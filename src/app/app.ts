import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

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

  /**
   * The JupyterLab application paths dictionary.
   */
  get paths(): JupyterFrontEnd.IPaths {
    return {
      urls: {
        base: '',
        notFound: '',
        app: '',
        static: '',
        settings: '',
        themes: '/api/themes',
        tree: '',
        workspaces: '',
        hubHost: '',
        hubPrefix: '',
        hubUser: '',
        hubServerName: ''
      },
      directories: {
        appSettings: '',
        schemas: '',
        static: '',
        templates: '',
        themes: '',
        userSettings: '',
        serverRoot: '',
        workspaces: ''
      }
    };
  }

  /**
   * Register plugins from a plugin module.
   *
   * @param mod - The plugin module to register.
   */
  registerPluginModule(mod: App.IPluginModule): void {
    let data = mod.default;
    // Handle commonjs exports.
    if (!Object.prototype.hasOwnProperty.call(mod, '__esModule')) {
      data = mod as any;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.forEach(item => {
      try {
        this.registerPlugin(item);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * Register the plugins from multiple plugin modules.
   *
   * @param mods - The plugin modules to register.
   */
  registerPluginModules(mods: App.IPluginModule[]): void {
    mods.forEach(mod => {
      this.registerPluginModule(mod);
    });
  }
}

/**
 * A namespace for App statics.
 */
export namespace App {
  /**
   * The instantiation options for an App.
   */
  export type IOptions = JupyterFrontEnd.IOptions<Shell>;

  /**
   * The interface for a module that exports a plugin or plugins as
   * the default value.
   */
  export interface IPluginModule {
    /**
     * The default export.
     */
    default: JupyterFrontEndPlugin<any> | JupyterFrontEndPlugin<any>[];
  }
}
