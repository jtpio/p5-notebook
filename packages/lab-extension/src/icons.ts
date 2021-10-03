import { LabIcon } from '@jupyterlab/ui-components';

import asteriskIconSvgStr from '../style/icons/p5-asterisk.svg';

import squareIconSvgStr from '../style/icons/p5-square-logo.svg';

export const asteriskIcon = new LabIcon({
  name: 'p5-notebook:asterisk-icon',
  svgstr: asteriskIconSvgStr
});

export const squareIcon = new LabIcon({
  name: 'p5-notebook:square-icon',
  svgstr: squareIconSvgStr
});
