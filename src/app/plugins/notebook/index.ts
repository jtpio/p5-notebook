import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { CodeCell } from '@jupyterlab/cells';

import { editorServices } from '@jupyterlab/codemirror';

import {
  CompleterModel,
  Completer,
  CompletionHandler,
  KernelConnector
} from '@jupyterlab/completer';

import { PageConfig } from '@jupyterlab/coreutils';

import { DocumentManager } from '@jupyterlab/docmanager';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { MathJaxTypesetter } from '@jupyterlab/mathjax2';

import {
  NotebookPanel,
  NotebookWidgetFactory,
  NotebookModelFactory,
  NotebookActions
} from '@jupyterlab/notebook';

import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';

import { Widget } from '@lumino/widgets';

import { SetupCommands } from './commands';

import { BrowserServiceManager } from '../../service';

import { IMainMenu } from '../top/tokens';

/**
 * The notebook plugin.
 */
const notebookPlugin: JupyterFrontEndPlugin<void> = {
  id: '@p5-notebook/notebook:plugin',
  autoStart: true,
  requires: [],
  optional: [IMainMenu],
  activate: async (app: JupyterFrontEnd, menu: IMainMenu): Promise<void> => {
    const { commands, serviceManager, shell } = app;

    // Setup the keydown listener for the document.
    document.addEventListener(
      'keydown',
      event => {
        commands.processKeydownEvent(event);
      },
      true
    );

    const rendermime = new RenderMimeRegistry({
      initialFactories: initialFactories,
      latexTypesetter: new MathJaxTypesetter({
        url: PageConfig.getOption('mathjaxUrl'),
        config: PageConfig.getOption('mathjaxConfig')
      })
    });

    const opener = {
      open: (widget: Widget): void => {
        // Do nothing for sibling widgets for now.
      }
    };

    const docRegistry = new DocumentRegistry();
    const docManager = new DocumentManager({
      registry: docRegistry,
      manager: app.serviceManager,
      opener
    });
    const mFactory = new NotebookModelFactory({});
    const editorFactory = editorServices.factoryService.newInlineEditor;
    const contentFactory = new NotebookPanel.ContentFactory({ editorFactory });

    const wFactory = new NotebookWidgetFactory({
      name: 'Notebook',
      modelName: 'notebook',
      fileTypes: ['notebook'],
      defaultFor: ['notebook'],
      preferKernel: true,
      canStartKernel: true,
      rendermime,
      contentFactory,
      mimeTypeService: editorServices.mimeTypeService
    });
    docRegistry.addModelFactory(mFactory);
    docRegistry.addWidgetFactory(wFactory);

    const notebookPath = 'example.ipynb';
    const nbWidget = docManager.open(notebookPath) as NotebookPanel;
    await nbWidget.context.sessionContext.ready;

    // TODO: use a CompletionManager instead
    const editor =
      nbWidget.content.activeCell && nbWidget.content.activeCell.editor;
    const model = new CompleterModel();
    const completer = new Completer({ editor, model });
    const connector = new KernelConnector({
      session: nbWidget.context.sessionContext.session
    });
    const handler = new CompletionHandler({ completer, connector });
    handler.editor = editor;
    nbWidget.content.activeCellChanged.connect((_, cell) => {
      handler.editor = cell && cell.editor;
    });
    completer.hide();

    // Add an iframe to the output cell
    // TODO: replace by a proper renderer
    NotebookActions.executed.connect(async (_, args) => {
      const { notebook, cell } = args;
      if (notebook !== nbWidget.content) {
        return;
      }
      if (cell.model.type !== 'code') {
        return;
      }
      const codeCell = cell as CodeCell;
      const host = codeCell.outputArea.node;
      if (host.lastChild?.nodeName === 'IFRAME') {
        // TODO: should the iframe be unregistered with server.ungregisterIFrame?
        host.removeChild(host.lastChild);
      }
      // TODO: better magics
      const re = /^%show(?: (.+)\s+(.+))?\s*$/;
      const matches = codeCell.model.value.text.match(re);
      if (!matches) {
        return;
      }
      const kernelId = nbWidget.sessionContext.session?.kernel?.id;
      if (!kernelId) {
        console.error('no kernel id');
        return;
      }
      const iframe = document.createElement('iframe');
      iframe.width = matches[1] ?? '100%';
      iframe.height = matches[2] ?? '400px';
      host.appendChild(iframe);
      const manager = serviceManager as BrowserServiceManager;
      manager.server.registerIFrame(kernelId, iframe);
    });

    SetupCommands(commands, menu, nbWidget, handler);
    Widget.attach(completer, document.body);

    shell.add(nbWidget);
  }
};

export default notebookPlugin;
