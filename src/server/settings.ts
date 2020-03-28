import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { JSONObject, PartialJSONObject } from '@lumino/coreutils';

import stripJsonComments from 'strip-json-comments';

import { Router } from './router';

import themesSchema from '@jupyterlab/apputils-extension/schema/themes.json';

import topbarSchema from 'jupyterlab-topbar-extension/schema/plugin.json';

import themeToggleSchema from 'jupyterlab-theme-toggle/schema/plugin.json';

/**
 * An interface for the plugin settings.
 */
interface IPlugin extends PartialJSONObject {
  /**
   * The name of the plugin.
   */
  id: string;

  /**
   * The settings for the plugin.
   */
  settings: JSONObject;

  /**
   * The raw user settings data as a string containing JSON with comments.
   */
  raw: string;

  /**
   * The JSON schema for the plugin.
   */
  schema: ISettingRegistry.ISchema;

  /**
   * The published version of the NPM package containing the plugin.
   */
  version: string;
}

/**
 * A class to handle requests to /api/settings
 */
export class Settings {
  /**
   * Construct a new Settings.
   */
  constructor() {
    this._router.add('GET', Private.pluginNameRegex, async (req: Request) => {
      const pluginId = this._parsePluginId(req.url);
      return new Response(JSON.stringify(this._get(pluginId)));
    });
    this._router.add(
      'GET',
      '/api/settings',
      async (req: Request) => new Response(JSON.stringify(this._getAll()))
    );
    this._router.add('PUT', Private.pluginNameRegex, async (req: Request) => {
      const pluginId = this._parsePluginId(req.url);
      const raw = await req.text();
      localStorage.setItem(Private.getStorageKey(pluginId), raw);
      return new Response(null, { status: 204 });
    });
  }

  /**
   * Parse the plugin id from a URL.
   *
   * @param url The request url.
   */
  private _parsePluginId(url: string): string {
    const matches = new URL(url).pathname.match(Private.pluginNameRegex);
    return matches?.[0] ?? '';
  }

  /**
   * Get settings by plugin name
   *
   * @param plugin the name of the plugin
   *
   */
  private _get(plugin: string): any {
    const all = this._getAll();
    const settings = all.settings as IPlugin[];
    return settings.find((setting: IPlugin) => {
      return setting.id === plugin;
    });
  }

  /**
   * Get the settings
   */
  private _getAll(): { settings: IPlugin[] } {
    const settings = DEFAULT_SETTINGS.map(plugin => {
      const { id } = plugin;
      const raw = localStorage.getItem(Private.getStorageKey(id)) ?? plugin.raw;
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

// TODO: automatically load the settings from the list of available plugins
const DEFAULT_SETTINGS: IPlugin[] = [
  {
    id: '@jupyterlab/apputils-extension:themes',
    raw: '{}',
    schema: themesSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '2.0.2' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-topbar-extension:plugin',
    raw: '{}',
    schema: topbarSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '2.0.2' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-theme-toggle:plugin',
    raw: '{}',
    schema: themeToggleSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '2.0.2' // TODO: fetch from package.json
  }
];

/**
 * A namespace for Private data.
 */
namespace Private {
  /**
   * The regex to match plugin names.
   */
  export const pluginNameRegex = new RegExp(/(?:@([^/]+?)[/])?([^/]+?):(\w+)/);

  /**
   * Get the localStorage key for the plugin.
   *
   * @param plugin The plugin id
   * @returns The storage key for the plugin.
   */
  export const getStorageKey = (plugin: string): string => {
    return `settings-${plugin}`;
  };
}
