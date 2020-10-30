import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { StateDB } from '@jupyterlab/statedb';

import { LocalStorageConnector } from '../storage';

import { JSONObject, PartialJSONObject } from '@lumino/coreutils';

import stripJsonComments from 'strip-json-comments';

import { Router } from './router';

import themesSchema from '@jupyterlab/apputils-extension/schema/themes.json';

import shortcutsSchema from '@jupyterlab/shortcuts-extension/schema/shortcuts.json';

import topbarSchema from 'jupyterlab-topbar-extension/schema/plugin.json';

import themeToggleSchema from 'jupyterlab-theme-toggle/schema/plugin.json';

import cellFlashSchema from 'jupyterlab-cell-flash/schema/plugin.json';

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
    const connector = new LocalStorageConnector('settings');
    this._storage = new StateDB<string>({
      connector
    });

    this._router.add('GET', Private.PLUGIN_NAME_REGEX, async (req: Request) => {
      const pluginId = Private.parsePluginId(req.url);
      const settings = await this._get(pluginId);
      return new Response(JSON.stringify(settings));
    });
    this._router.add('GET', '/api/settings', async (req: Request) => {
      const plugins = await this._getAll();
      return new Response(JSON.stringify(plugins));
    });
    this._router.add('PUT', Private.PLUGIN_NAME_REGEX, async (req: Request) => {
      const pluginId = Private.parsePluginId(req.url);
      const raw = await req.text();
      this._storage.save(pluginId, stripJsonComments(raw));
      return new Response(null, { status: 204 });
    });
  }

  /**
   * Get settings by plugin name
   *
   * @param plugin the name of the plugin
   *
   */
  private async _get(plugin: string): Promise<IPlugin | undefined> {
    const all = await this._getAll();
    const settings = all.settings as IPlugin[];
    return settings.find((setting: IPlugin) => {
      return setting.id === plugin;
    });
  }

  /**
   * Get the settings
   */
  private async _getAll(): Promise<{ settings: IPlugin[] }> {
    const settings = await Promise.all(
      DEFAULT_SETTINGS.map(async plugin => {
        const { id } = plugin;
        const raw = (await this._storage.fetch(id)) ?? plugin.raw;
        return {
          ...plugin,
          raw,
          settings: JSON.parse(stripJsonComments(raw))
        };
      })
    );
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
  private _storage: StateDB<string>;
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
    raw: '{ "theme-scrollbars": true }',
    schema: themesSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '3.0.0-rc.6' // TODO: fetch from package.json
  },
  {
    id: '@jupyterlab/shortcuts-extension:shortcuts',
    raw: '{}',
    schema: shortcutsSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '3.0.0-rc.6' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-topbar-extension:plugin',
    raw: '{}',
    schema: topbarSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '0.6.0' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-theme-toggle:plugin',
    raw: '{}',
    schema: themeToggleSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '0.6.0' // TODO: fetch from package.json
  },
  {
    id: 'jupyterlab-cell-flash:plugin',
    raw: '{}',
    schema: cellFlashSchema as ISettingRegistry.ISchema,
    settings: {},
    version: '0.3.0' // TODO: fetch from package.json
  }
];

/**
 * A namespace for Private data.
 */
namespace Private {
  /**
   * The regex to match plugin names.
   */
  export const PLUGIN_NAME_REGEX = new RegExp(
    /(?:@([^/]+?)[/])?([^/]+?):(\w+)/
  );

  /**
   * Parse the plugin id from a URL.
   *
   * @param url The request url.
   */
  export const parsePluginId = (url: string): string => {
    const matches = new URL(url).pathname.match(PLUGIN_NAME_REGEX);
    return matches?.[0] ?? '';
  };
}
