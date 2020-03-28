import { JSONObject, JSONArray } from '@lumino/coreutils';

import stripJsonComments from 'strip-json-comments';

import { Router } from './router';

import themesSchema from '@jupyterlab/apputils-extension/schema/themes.json';

import topbarSchema from 'jupyterlab-topbar-extension/schema/plugin.json';

import themeToggleSchema from 'jupyterlab-theme-toggle/schema/plugin.json';

// TODO: type the settings
// TODO: automatically load the settings from the list of plugins?
const DEFAULT_SETTINGS = [
  {
    id: '@jupyterlab/apputils-extension:themes',
    raw: '{}',
    schema: themesSchema,
    settings: {},
    version: '2.0.2' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-topbar-extension:plugin',
    raw: '{}',
    schema: topbarSchema,
    settings: {},
    version: '2.0.2' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-theme-toggle:plugin',
    raw: '{}',
    schema: themeToggleSchema,
    settings: {},
    version: '2.0.2' // TODO: fetch from package.json
  }
];

/**
 * A class to handle requests to /api/settings
 */
export class Settings {
  /**
   * Construct a new Settings.
   */
  constructor() {
    // TODO: better regex
    this._router.add('GET', '/api/settings/.+', async (req: Request) => {
      const url = new URL(req.url);
      const pluginId = url.pathname.replace(
        `${Settings.SETTINGS_SERVICE_URL}/`,
        ''
      );
      return new Response(JSON.stringify(this._get(pluginId)));
    });
    this._router.add(
      'GET',
      '/api/settings',
      async (req: Request) => new Response(JSON.stringify(this._getAll()))
    );
    this._router.add('PUT', '/api/settings/.+', async (req: Request) => {
      const url = new URL(req.url);
      const pluginId = url.pathname.replace(
        `${Settings.SETTINGS_SERVICE_URL}/`,
        ''
      );
      const raw = await req.text();
      localStorage.setItem(pluginId, raw);
      return new Response(null, { status: 204 });
    });
    this._router.add(
      'PUT',
      '/api/settings',
      async (req: Request) => new Response(null, { status: 204 })
    );
  }

  /**
   * Get settings by plugin name
   *
   * @param plugin the name of the plugin
   *
   */
  private _get(plugin: string): any {
    const all = this._getAll();
    const settings = all.settings as JSONArray;
    return settings.find((setting: JSONObject) => {
      return setting['id'] === plugin;
    });
  }

  /**
   * Get the settings
   */
  private _getAll(): JSONObject {
    const settings = DEFAULT_SETTINGS.map(plugin => {
      const { id } = plugin;
      const raw = localStorage.getItem(id) ?? plugin.raw;
      return {
        ...plugin,
        raw,
        settings: JSON.parse(stripJsonComments(raw))
      };
    });
    return {
      settings
    };
  }

  /**
   * Dispatch a request to the local router.
   *
   * @param req The request to dispatch.
   */
  dispatch(req: Request): Promise<Response> {
    return this._router.route(req);
  }

  private _router = new Router();
}

/**
 * A namespace for Settings statics.
 */
export namespace Settings {
  /**
   * The url for the settings service.
   */
  export const SETTINGS_SERVICE_URL = '/api/settings';
}
