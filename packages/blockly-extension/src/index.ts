import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';
import { jsonIcon } from '@jupyterlab/ui-components';
import { WidgetTracker, ICommandPalette } from '@jupyterlab/apputils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { CodeCell } from '@jupyterlab/cells';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ILauncher } from '@jupyterlab/launcher';
import { ITranslator } from '@jupyterlab/translation';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IKernelMenu, IMainMenu } from '@jupyterlab/mainmenu';

import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';

import {
  WidgetRenderer,
  registerWidgetManager
} from '@jupyter-widgets/jupyterlab-manager';

import { BlocklyEditorFactory } from 'jupyterlab-blockly';
import { IBlocklyRegistry } from 'jupyterlab-blockly';
import { BlocklyEditor } from 'jupyterlab-blockly';

import { blockly_icon } from './icons';

/**
 * The name of the factory that creates the editor widgets.
 */
const FACTORY = 'Blockly editor';

const PALETTE_CATEGORY = 'Blockly editor';

namespace CommandIDs {
  export const createNew = 'blockly:create-new-blockly-file';
}

/**
 * The id of the translation plugin.
 */
const PLUGIN_ID = '@jupyterlab/translation-extension:plugin';

/**
 * Initialization data for the jupyterlab-blocky extension.
 */
const plugin: JupyterFrontEndPlugin<IBlocklyRegistry> = {
  id: 'jupyterlab-blocky:plugin',
  autoStart: true,
  requires: [
    ILayoutRestorer,
    IRenderMimeRegistry,
    IEditorServices,
    IFileBrowserFactory,
    ISettingRegistry,
    ITranslator
  ],
  optional: [ILauncher, ICommandPalette, IMainMenu, IJupyterWidgetRegistry],
  provides: IBlocklyRegistry,
  activate: (
    app: JupyterFrontEnd,
    restorer: ILayoutRestorer,
    rendermime: IRenderMimeRegistry,
    editorServices: IEditorServices,
    browserFactory: IFileBrowserFactory,
    settings: ISettingRegistry,
    translator: ITranslator,
    launcher: ILauncher | null,
    palette: ICommandPalette | null,
    mainMenu: IMainMenu | null,
    widgetRegistry: IJupyterWidgetRegistry | null
  ): IBlocklyRegistry => {
    console.log('JupyterLab extension jupyterlab-blocky is activated!');

    // Namespace for the tracker
    const namespace = 'jupyterlab-blocky';

    // Creating the tracker for the document
    const tracker = new WidgetTracker<BlocklyEditor>({ namespace });

    // Handle state restoration.
    if (restorer) {
      // When restoring the app, if the document was open, reopen it
      restorer.restore(tracker, {
        command: 'docmanager:open',
        args: widget => ({ path: widget.context.path, factory: FACTORY }),
        name: widget => widget.context.path
      });
    }

    const { commands } = app;

    // Creating the widget factory to register it so the document manager knows about
    // our new DocumentWidget
    const widgetFactory = new BlocklyEditorFactory({
      name: FACTORY,
      modelName: 'text',
      fileTypes: ['blockly'],
      defaultFor: ['blockly'],

      // Kernel options, in this case we need to execute the code generated
      // in the blockly editor. The best way would be to use kernels, for
      // that reason, we tell the widget factory to start a kernel session
      // when opening the editor, and close the session when closing the editor.
      canStartKernel: true,
      preferKernel: false,
      shutdownOnClose: true,

      // The rendermime instance, necessary to render the outputs
      // after a code execution. And the mimeType service to get the
      // mimeType from the kernel language
      rendermime: rendermime,
      mimetypeService: editorServices.mimeTypeService,

      // The translator instance, used for the internalization of the plugin.
      translator: translator
    });

    // Add the widget to the tracker when it's created
    widgetFactory.widgetCreated.connect((sender, widget) => {
      // Adding the Blockly icon for the widget so it appears next to the file name.
      widget.title.icon = blockly_icon;

      // Notify the instance tracker if restore data needs to update.
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      tracker.add(widget);
    });
    // Registering the file type
    app.docRegistry.addFileType({
      name: 'blockly',
      displayName: 'Blockly',
      contentType: 'file',
      fileFormat: 'json',
      extensions: ['.jpblockly'],
      mimeTypes: ['application/json'],
      icon: jsonIcon,
      iconLabel: 'JupyterLab-Blockly'
    });
    // Registering the widget factory
    app.docRegistry.addWidgetFactory(widgetFactory);

    function getSetting(setting: ISettingRegistry.ISettings): string {
      // Read the settings and convert to the correct type
      const currentLocale: string = setting.get('locale').composite as string;
      return currentLocale;
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    settings.load(PLUGIN_ID).then(setting => {
      // Read the settings
      const currentLocale = getSetting(setting);

      // Listen for our plugin setting changes using Signal
      setting.changed.connect(getSetting);

      // Get new language and call the function that modifies the language name accordingly.
      // Also, make the transformation to have the name of the language package as in Blockly.
      const language = currentLocale !== 'default' ?
        (currentLocale[currentLocale.length - 2].toUpperCase() +
        currentLocale[currentLocale.length - 1].toLowerCase()) : 'En';
      console.log(`Current Language : '${language}'`);

      // Transmitting the current language to the manager.
      widgetFactory.registry.setlanguage(language);
    });

    commands.addCommand(CommandIDs.createNew, {
      label: args =>
        args['isPalette'] ? 'New Blockly Editor' : 'Blockly Editor',
      caption: 'Create a new Blockly Editor',
      icon: args => (args['isPalette'] ? null : blockly_icon),
      execute: async args => {
        // Get the directory in which the Blockly file must be created;
        // otherwise take the current filebrowser directory
        const cwd =
          args['cwd'] || browserFactory.tracker.currentWidget.model.path;

        // Create a new untitled Blockly file
        const model = await commands.execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: '.jpblockly'
        });

        // Open the newly created file with the 'Editor'
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: FACTORY
        });
      }
    });

    // Add the command to the launcher
    if (launcher) {
      launcher.add({
        command: CommandIDs.createNew,
        category: 'Other',
        rank: 1
      });
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command: CommandIDs.createNew,
        args: { isPalette: true },
        category: PALETTE_CATEGORY
      });
    }

    // Add the command to the main menu
    if (mainMenu) {
      mainMenu.kernelMenu.kernelUsers.add({
        tracker,
        interruptKernel: current => {
          const kernel = current.context.sessionContext.session?.kernel;
          if (kernel) {
            return kernel.interrupt();
          }
          return Promise.resolve(void 0);
        },
        reconnectToKernel: current => {
          const kernel = current.context.sessionContext.session?.kernel;
          if (kernel) {
            return kernel.reconnect();
          }
          return Promise.resolve(void 0);
        },
        restartKernel: current => {
          const kernel = current.context.sessionContext.session?.kernel;
          if (kernel) {
            return kernel.restart();
          }
          return Promise.resolve(void 0);
        },
        shutdownKernel: current => current.context.sessionContext.shutdown()
      } as IKernelMenu.IKernelUser<BlocklyEditor>);
    }

    if (widgetRegistry) {
      tracker.forEach(panel => {
        registerWidgetManager(
          panel.context as any,
          panel.content.rendermime,
          widgetRenderers([panel.content.cell])
        );
      });

      tracker.widgetAdded.connect((sender, panel) => {
        registerWidgetManager(
          panel.context as any,
          panel.content.rendermime,
          widgetRenderers([panel.content.cell])
        );
      });
    }

    return widgetFactory.registry;
  }
};

function* widgetRenderers(cells: CodeCell[]): IterableIterator<WidgetRenderer> {
  for (const w of cells) {
    if (w instanceof WidgetRenderer) {
      yield w;
    }
  }
}

export default plugin;
