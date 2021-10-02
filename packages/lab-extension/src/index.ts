import {
  JupyterFrontEndPlugin,
  JupyterFrontEnd,
  ILabShell,
} from "@jupyterlab/application";

import { IRetroShell } from "@retrolab/application";

import { Widget } from "@lumino/widgets";

import { asteriskIcon, squareIcon } from "./icons";

/**
 * The main application icon.
 */
const logo: JupyterFrontEndPlugin<void> = {
  id: "@p5-notebook/lab-extension:logo",
  optional: [ILabShell, IRetroShell],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    labShell: ILabShell | null,
    retroShell: IRetroShell | null
  ) => {
    const logo = new Widget();
    logo.id = "jp-MainLogo";
    if (labShell) {
      asteriskIcon.element({
        container: logo.node,
        elementPosition: "center",
        margin: "2px 2px 2px 8px",
        height: "auto",
        width: "16px",
      });
    } else if (retroShell) {
      squareIcon.element({
        container: logo.node,
        elementPosition: "center",
        margin: "2px 2px 2px 8px",
        height: "auto",
        width: "16px",
      });
    }
    app.shell.add(logo, "top", { rank: 0 });
  },
};

const plugins: JupyterFrontEndPlugin<any>[] = [logo];

export default plugins;
