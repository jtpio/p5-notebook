import { Router } from './router';

/**
 * A class to handle requests to /api/settings
 */
export class Settings {
  /**
   * Construct a new Settings.
   */
  constructor() {
    this._router.add(
      'GET',
      '/api/settings',
      async (req: Request) => new Response(JSON.stringify(this._get()))
    );
  }

  /**
   * Get the settings
   */
  private _get(): any {
    return {
      settings: []
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
