import * as PIXI from "pixi.js";
import PixiComponent, {getCullingObjects} from "./PixiComponent";
import {getGame} from "../pixiUtils";
import * as TWEEN from "es6-tween";

const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'scale',
  'renderable',
  'interactiveChildren'
];

export default class PixiCamera extends PixiComponent {

  set position(position) {
    this._renderer.position.set(position.x, position.y);
  }

  follow(targetPosition, duration) {
    if (this.checkBounds(targetPosition)) {
      if (this._followTween) {
        this._followTween.stop();
        TWEEN.remove(this._followTween);
      }
      if (!duration) {
        this._renderer.pivot.set(targetPosition.x, targetPosition.y);
      } else {
        let pivot = {x: this._renderer.pivot.x, y: this._renderer.pivot.y};
        this._followTween = new TWEEN.Tween(pivot)
          .to({x: targetPosition.x, y: targetPosition.y}, duration)
          .on('update', ({x, y}) => {
            this._renderer.pivot.set(x, y);
          })
          .on('end', () => {
            if (this._viewport) {
              this.culling();
            }
          })
          .start();
      }
    }
  }

  culling() {
    let allObjects = getCullingObjects();
    for (let i = 0; i < allObjects.length; i++) {
      let object = allObjects[i];
      let bounds = object.getBounds(true);
      object.renderable = bounds.x + bounds.width >= this._viewport.x1 &&
        bounds.y + bounds.height >= this._viewport.y1 &&
        bounds.x <= this._viewport.x2 &&
        bounds.y <= this._viewport.y2;
    }
  }

  set viewport(rect) {
    this._viewport = {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
      width: rect.width,
      height: rect.height
    };
  }

  get viewport() {
    return this._viewport;
  }

  set bounds(rect) {
    this._bounds = {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
      width: rect.width,
      height: rect.height
    };
  }

  checkBounds(targetPosition) {
    //Will implement for camera feature
    return true;
  }

  removeChildren() {
    this.renderer.removeChildren();
  }

  static create(parent = null, props = {}) {
    let camera = new PixiCamera();
    let game = getGame();
    camera.setProps(props, PERMITTED_PROPS);
    camera.renderer = new PIXI.Container();
    camera.viewport = new PIXI.Rectangle(0, 0, game.options.width, game.options.height);
    camera.parent = parent;
    return camera;
  }
}
