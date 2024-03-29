import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd,
  ILabShell
} from '@jupyterlab/application';

import { PageConfig } from '@jupyterlab/coreutils';

import { INotebookShell } from '@jupyter-notebook/application';

import { Widget } from '@lumino/widgets';

import { asteriskIcon, squareIcon } from './icons';

/**
 * The main application icon.
 */
const logo: JupyterFrontEndPlugin<void> = {
  id: '@p5-notebook/lab-extension:logo',
  optional: [ILabShell, INotebookShell],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    labShell: ILabShell | null,
    notebookShell: INotebookShell | null
  ) => {
    let logo: Widget | null = null;
    if (labShell) {
      logo = new Widget();
      asteriskIcon.element({
        container: logo.node,
        elementPosition: 'center',
        margin: '2px 2px 2px 8px',
        height: 'auto',
        width: '16px'
      });
    } else if (notebookShell) {
      const baseUrl = PageConfig.getBaseUrl();
      const node = document.createElement('a');
      node.href = `${baseUrl}tree`;
      node.target = '_blank';
      node.rel = 'noopener noreferrer';
      logo = new Widget({ node });
      squareIcon.element({
        container: logo.node,
        elementPosition: 'center',
        margin: '2px 2px 2px 8px',
        height: 'auto',
        width: '42px'
      });
    }
    if (logo) {
      logo.id = 'jp-MainLogo';
      app.shell.add(logo, 'top', { rank: 0 });
    }
  }
};

const plugins: JupyterFrontEndPlugin<any>[] = [logo];

export default plugins;
