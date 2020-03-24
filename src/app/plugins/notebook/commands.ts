// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { sessionContextDialogs } from '@jupyterlab/apputils';

import { CompletionHandler } from '@jupyterlab/completer';

import {
  SearchInstance,
  NotebookSearchProvider
} from '@jupyterlab/documentsearch';

import { NotebookPanel, NotebookActions } from '@jupyterlab/notebook';

import { CommandRegistry } from '@lumino/commands';
import { IMainMenu } from '../top/tokens';

/**
 * The map of command ids used by the notebook.
 */
const CommandIDs = {
  invoke: 'completer:invoke',
  select: 'completer:select',
  invokeNotebook: 'completer:invoke-notebook',
  selectNotebook: 'completer:select-notebook',
  startSearch: 'documentsearch:start-search',
  findNext: 'documentsearch:find-next',
  findPrevious: 'documentsearch:find-previous',
  download: 'notebook:download',
  save: 'notebook:save',
  interrupt: 'notebook:interrupt-kernel',
  restart: 'notebook:restart-kernel',
  switchKernel: 'notebook:switch-kernel',
  run: 'notebook:run-cell',
  runAndAdvance: 'notebook-cells:run-and-advance',
  deleteCell: 'notebook-cells:delete',
  selectAbove: 'notebook-cells:select-above',
  selectBelow: 'notebook-cells:select-below',
  extendAbove: 'notebook-cells:extend-above',
  extendTop: 'notebook-cells:extend-top',
  extendBelow: 'notebook-cells:extend-below',
  extendBottom: 'notebook-cells:extend-bottom',
  editMode: 'notebook:edit-mode',
  merge: 'notebook-cells:merge',
  split: 'notebook-cells:split',
  commandMode: 'notebook:command-mode',
  undo: 'notebook-cells:undo',
  redo: 'notebook-cells:redo'
};

export const SetupCommands = (
  commands: CommandRegistry,
  menu: IMainMenu,
  nbWidget: NotebookPanel,
  handler: CompletionHandler
): void => {
  // Add commands.
  commands.addCommand(CommandIDs.invoke, {
    label: 'Completer: Invoke',
    execute: () => handler.invoke()
  });
  commands.addCommand(CommandIDs.select, {
    label: 'Completer: Select',
    execute: () => handler.completer.selectActive()
  });
  commands.addCommand(CommandIDs.invokeNotebook, {
    label: 'Invoke Notebook',
    execute: () => {
      if (nbWidget.content.activeCell?.model.type === 'code') {
        return commands.execute(CommandIDs.invoke);
      }
    }
  });
  commands.addCommand(CommandIDs.selectNotebook, {
    label: 'Select Notebook',
    execute: () => {
      if (nbWidget.content.activeCell?.model.type === 'code') {
        return commands.execute(CommandIDs.select);
      }
    }
  });
  commands.addCommand(CommandIDs.save, {
    label: 'Save',
    execute: () => nbWidget.context.save()
  });
  commands.addCommand(CommandIDs.download, {
    label: 'Download',
    execute: () => {
      console.log('download');
      nbWidget.context.download();
    }
  });

  let searchInstance: SearchInstance | undefined;
  commands.addCommand(CommandIDs.startSearch, {
    label: 'Find...',
    execute: () => {
      if (searchInstance) {
        searchInstance.focusInput();
        return;
      }
      const provider = new NotebookSearchProvider();
      searchInstance = new SearchInstance(nbWidget, provider);
      searchInstance.disposed.connect(() => {
        searchInstance = undefined;
        // find next and previous are now not enabled
        commands.notifyCommandChanged();
      });
      // find next and previous are now enabled
      commands.notifyCommandChanged();
      searchInstance.focusInput();
    }
  });
  commands.addCommand(CommandIDs.findNext, {
    label: 'Find Next',
    isEnabled: () => !!searchInstance,
    execute: async () => {
      if (!searchInstance) {
        return;
      }
      await searchInstance.provider.highlightNext();
      searchInstance.updateIndices();
    }
  });
  commands.addCommand(CommandIDs.findPrevious, {
    label: 'Find Previous',
    isEnabled: () => !!searchInstance,
    execute: async () => {
      if (!searchInstance) {
        return;
      }
      await searchInstance.provider.highlightPrevious();
      searchInstance.updateIndices();
    }
  });
  commands.addCommand(CommandIDs.interrupt, {
    label: 'Interrupt',
    execute: async () =>
      nbWidget.context.sessionContext.session?.kernel?.interrupt()
  });
  commands.addCommand(CommandIDs.restart, {
    label: 'Restart Kernel',
    execute: () =>
      sessionContextDialogs.restart(nbWidget.context.sessionContext)
  });
  commands.addCommand(CommandIDs.switchKernel, {
    label: 'Switch Kernel',
    execute: () =>
      sessionContextDialogs.selectKernel(nbWidget.context.sessionContext)
  });
  commands.addCommand(CommandIDs.run, {
    label: 'Run the current cell',
    execute: () => {
      return NotebookActions.run(
        nbWidget.content,
        nbWidget.context.sessionContext
      );
    }
  });
  commands.addCommand(CommandIDs.runAndAdvance, {
    label: 'Run and Advance',
    execute: () => {
      return NotebookActions.runAndAdvance(
        nbWidget.content,
        nbWidget.context.sessionContext
      );
    }
  });
  commands.addCommand(CommandIDs.editMode, {
    label: 'Edit Mode',
    execute: () => {
      nbWidget.content.mode = 'edit';
    }
  });
  commands.addCommand(CommandIDs.commandMode, {
    label: 'Command Mode',
    execute: () => {
      nbWidget.content.mode = 'command';
    }
  });
  commands.addCommand(CommandIDs.selectBelow, {
    label: 'Select Below',
    execute: () => NotebookActions.selectBelow(nbWidget.content)
  });
  commands.addCommand(CommandIDs.selectAbove, {
    label: 'Select Above',
    execute: () => NotebookActions.selectAbove(nbWidget.content)
  });
  commands.addCommand(CommandIDs.extendAbove, {
    label: 'Extend Above',
    execute: () => NotebookActions.extendSelectionAbove(nbWidget.content)
  });
  commands.addCommand(CommandIDs.extendTop, {
    label: 'Extend to Top',
    execute: () => NotebookActions.extendSelectionAbove(nbWidget.content, true)
  });
  commands.addCommand(CommandIDs.extendBelow, {
    label: 'Extend Below',
    execute: () => NotebookActions.extendSelectionBelow(nbWidget.content)
  });
  commands.addCommand(CommandIDs.extendBottom, {
    label: 'Extend to Bottom',
    execute: () => NotebookActions.extendSelectionBelow(nbWidget.content, true)
  });
  commands.addCommand(CommandIDs.merge, {
    label: 'Merge Cells',
    execute: () => NotebookActions.mergeCells(nbWidget.content)
  });
  commands.addCommand(CommandIDs.split, {
    label: 'Split Cell',
    execute: () => NotebookActions.splitCell(nbWidget.content)
  });
  commands.addCommand(CommandIDs.undo, {
    label: 'Undo',
    execute: () => NotebookActions.undo(nbWidget.content)
  });
  commands.addCommand(CommandIDs.redo, {
    label: 'Redo',
    execute: () => NotebookActions.redo(nbWidget.content)
  });
  const bindings = [
    {
      selector: '.jp-Notebook.jp-mod-editMode .jp-mod-completer-enabled',
      keys: ['Tab'],
      command: CommandIDs.invokeNotebook
    },
    {
      selector: '.jp-mod-completer-active',
      keys: ['Enter'],
      command: CommandIDs.selectNotebook
    },
    {
      selector: '.jp-Notebook',
      keys: ['Ctrl Enter'],
      command: CommandIDs.run
    },
    {
      selector: '.jp-Notebook',
      keys: ['Shift Enter'],
      command: CommandIDs.runAndAdvance
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel S'],
      command: CommandIDs.save
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel F'],
      command: CommandIDs.startSearch
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel G'],
      command: CommandIDs.findNext
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel Shift G'],
      command: CommandIDs.findPrevious
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['I', 'I'],
      command: CommandIDs.interrupt
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['0', '0'],
      command: CommandIDs.restart
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Enter'],
      command: CommandIDs.editMode
    },
    {
      selector: '.jp-Notebook.jp-mod-editMode',
      keys: ['Escape'],
      command: CommandIDs.commandMode
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Shift M'],
      command: CommandIDs.merge
    },
    {
      selector: '.jp-Notebook.jp-mod-editMode',
      keys: ['Ctrl Shift -'],
      command: CommandIDs.split
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['J'],
      command: CommandIDs.selectBelow
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['ArrowDown'],
      command: CommandIDs.selectBelow
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['K'],
      command: CommandIDs.selectAbove
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['ArrowUp'],
      command: CommandIDs.selectAbove
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Shift K'],
      command: CommandIDs.extendAbove
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Shift J'],
      command: CommandIDs.extendBelow
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Z'],
      command: CommandIDs.undo
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Y'],
      command: CommandIDs.redo
    }
  ];
  bindings.map(binding => commands.addKeyBinding(binding));

  // add commands to the menu
  if (menu) {
    menu.fileMenu.addGroup([{ command: CommandIDs.download }]);
  }
};
