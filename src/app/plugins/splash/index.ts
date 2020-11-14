import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * The default splash screen plugin.
 */
const splash: JupyterFrontEndPlugin<void> = {
  id: '@p5-notebook/splash',
  autoStart: true,
  activate: async (app: JupyterFrontEnd) => {
    const { restored } = app;

    // Create the splash element
    const splash = document.createElement('div');
    splash.id = 'p5-splash';
    const img = document.createElement('img');
    img.src = '/build/resources/p5js-square-logo.svg';
    splash.appendChild(img);
    document.body.appendChild(splash);

    requestAnimationFrame(() => {
      splash.classList.add('splash-fade-in');
    });

    restored.then(() => {
      splash.classList.add('splash-fade-out');
      window.setTimeout(() => {
        document.body.removeChild(splash);
      }, 1000);
    });
  }
};

export default splash;
