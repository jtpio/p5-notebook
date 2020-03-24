import { JupyterFrontEnd } from '@jupyterlab/application';

import { IIterator, iter } from '@lumino/algorithm';

import { Panel, Widget, BoxLayout } from '@lumino/widgets';

/**
 * The application shell.
 */
export class Shell extends Widget implements JupyterFrontEnd.IShell {
  constructor() {
    super();
    this.id = 'main';

    const rootLayout = new BoxLayout();

    this._top = new Panel();
    this._main = new Panel();

    this._top.id = 'top-panel';
    this._main.id = 'main-panel';

    BoxLayout.setStretch(this._top, 0);
    BoxLayout.setStretch(this._main, 1);

    rootLayout.addWidget(this._top);
    rootLayout.addWidget(this._main);

    this.layout = rootLayout;
  }

  activateById(id: string): void {
    // no-op
  }

  add(widget: Widget, area?: Shell.Area): void {
    if (area === 'top') {
      return this._top.addWidget(widget);
    }
    this._main.widgets.forEach(w => w.dispose());
    this._main.addWidget(widget);
    this._main.update();
  }

  currentWidget: Widget | null;

  widgets(area: Shell.Area): IIterator<Widget> {
    if (area === 'top') {
      return iter(this._top.widgets);
    }
    return iter(this._main.widgets);
  }

  private _main: Panel;
  private _top: Panel;
}

/**
 * A namespace for Shell statics
 */
export namespace Shell {
  /**
   * The areas of the application shell where widgets can reside.
   */
  export type Area = 'main' | 'top';
}
