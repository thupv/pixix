import * as PIXI from "pixi.js";
import PixiComponent from "./PixiComponent";
import {Scrollbox} from 'pixi-scrollbox';

const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'scale',
  'renderable',
  'interactiveChildren',
  'parentGroup',
  'zIndex',
  'boxWidth',
  'boxHeight'
];
export default class PixiScrollContainer extends PixiComponent {
  addChild(child) {
    super.addChild(child);
    if (child) {
      child.parent = this;
    }
  }

  static create(parent = null, props = {}) {
    let pixiContainer = new PixiScrollContainer();
    pixiContainer.setProps(props, PERMITTED_PROPS);
    pixiContainer.renderer = new Scrollbox({
      boxWidth: props.boxWidth || 400,
      boxHeight: props.boxHeight || 400,
      overflowY: 'scroll'
    });
    pixiContainer.isScrollContainer = true;
    pixiContainer.parent = parent;
    return pixiContainer;
  }
}
