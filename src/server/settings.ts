import { JSONObject, JSONArray } from '@lumino/coreutils';

import { Router } from './router';

/**
 * A class to handle requests to /api/settings
 */
export class Settings {
  /**
   * Construct a new Settings.
   */
  constructor() {
    this._router.add('GET', '/api/settings/.+', async (req: Request) => {
      const plugin = req.url.replace(Settings.SETTINGS_SERVICE_URL, '');
      return new Response(JSON.stringify(this._get(plugin)));
    });
    this._router.add(
      'GET',
      '/api/settings',
      async (req: Request) => new Response(JSON.stringify(this._getAll()))
    );
    this._router.add(
      'PUT',
      '/api/settings/.+',
      async (req: Request) => new Response(null, { status: 204 })
    );
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
    return settings[0];
  }

  /**
   * Get the settings
   */
  private _getAll(): JSONObject {
    return {
      settings: [
        {
          id: '@jupyterlab/apputils-extension:themes',
          raw:
            '{\n    // Theme\n    // @jupyterlab/apputils-extension:themes\n    // Theme manager settings.\n    // *************************************\n\n    // Selected Theme\n    // Application-level visual styling theme\n    "theme": "JupyterLab Dark",\n\n    // Scrollbar Theming\n    // Enable/disable styling of the application scrollbars\n    "theme-scrollbars": true\n}',
          schema: {
            title: 'Theme',
            'jupyter.lab.setting-icon-label': 'Theme Manager',
            description: 'Theme manager settings.',
            type: 'object',
            additionalProperties: false,
            definitions: {
              cssOverrides: {
                type: 'object',
                additionalProperties: false,
                description:
                  "The description field of each item is the CSS property that will be used to validate an override's value",
                properties: {
                  'code-font-size': {
                    type: ['string', 'null'],
                    description: 'font-size'
                  },
                  'content-font-size1': {
                    type: ['string', 'null'],
                    description: 'font-size'
                  },
                  'ui-font-size1': {
                    type: ['string', 'null'],
                    description: 'font-size'
                  }
                }
              }
            },
            properties: {
              theme: {
                type: 'string',
                title: 'Selected Theme',
                description: 'Application-level visual styling theme',
                default: 'JupyterLab Dark'
              },
              'theme-scrollbars': {
                type: 'boolean',
                title: 'Scrollbar Theming',
                description:
                  'Enable/disable styling of the application scrollbars',
                default: false
              },
              overrides: {
                title: 'Theme CSS Overrides',
                description:
                  'Override theme CSS variables by setting key-value pairs here',
                $ref: '#/definitions/cssOverrides',
                default: {
                  'code-font-size': null,
                  'content-font-size1': null,
                  'ui-font-size1': null
                }
              }
            }
          },
          settings: {
            theme: 'JupyterLab Dark',
            'theme-scrollbars': true
          },
          version: '2.0.2'
        },
        {
          id: 'jupyterlab-theme-toggle:plugin',
          raw: '{}',
          schema: {
            'jupyter.lab.setting-icon-class': 'jp-SettingsIcon',
            'jupyter.lab.setting-icon-label': 'Theme Toggle',
            title: 'Theme Toggle',
            description: 'Toggle the JupyterLab theme',
            properties: {},
            additionalProperties: false,
            'jupyter.lab.shortcuts': [],
            type: 'object'
          },
          settings: {},
          version: '0.5.0'
        },
        {
          id: 'jupyterlab-topbar-extension:plugin',
          raw:
            '{\n    // Top Bar Extension\n    // jupyterlab-topbar-extension:plugin\n    // Top Bar Extension\n    // **********************************\n\n    // Items Order\n    // Ordered list of the Top Bar items\n    "order": [\n        "spacer",\n        "memory"\n    ],\n\n    // Top Bar Visibility\n    // Whether the top bar is visible or not\n    "visible": true\n}',
          schema: {
            'jupyter.lab.setting-icon-class': 'jp-BuildIcon',
            'jupyter.lab.setting-icon-label': 'Top Bar Extension',
            title: 'Top Bar Extension',
            description: 'Top Bar Extension',
            properties: {
              visible: {
                title: 'Top Bar Visibility',
                description: 'Whether the top bar is visible or not',
                default: true,
                type: 'boolean'
              },
              order: {
                title: 'Items Order',
                description: 'Ordered list of the Top Bar items',
                default: [],
                type: 'array'
              }
            },
            additionalProperties: false,
            type: 'object'
          },
          settings: {
            order: ['spacer', 'memory'],
            visible: true
          },
          version: '0.5.0'
        }
      ]
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
