import * as PIXI from "pixi.js";
import PixiComponent from "./PixiComponent";

// http://pixijs.download/release/docs/PIXI.Container.html

const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'scale',
  'renderable',
  'interactiveChildren',
  'parentGroup',
  'zIndex',
];
export default class PixiContainer extends PixiComponent {
  removeChildren() {
    this.renderer.removeChildren();
  }

  get bounds() {
    return this._renderer.getBounds();
  }

  get position() {
    return this._renderer.position;
  }

  set alpha(a) {
    this._renderer.alpha = a;
  }

  set renderable(isRenderable) {
    this._renderer.renderable = isRenderable;
    this._renderer.interactiveChildren = isRenderable;
  }

  static create(parent = null, props = {}) {
    let pixiContainer = new PixiContainer();
    pixiContainer.setProps(props, PERMITTED_PROPS);
    pixiContainer.renderer = new PIXI.Container();
    pixiContainer.parent = parent;
    return pixiContainer;
  }
}
