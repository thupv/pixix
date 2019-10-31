import PixiUIComponent from "./PixiUIComponent";
import * as PixiUI from "pixi-ui";
import AssetsManager from "../../assetsManager";
import * as PIXI from "pixi.js";

const PERMITTED_PROPS = [
  'width',
  'height',
  'scale',
  'left',
  'right',
  'top',
  'bottom',
  'alpha',
  'anchorY',
  'renderable'
];
export default class PixiUISprite extends PixiUIComponent {
  set image(src) {
    this.renderer.texture = PIXI.Texture.fromImage(src);
  }

  set width(w) {
    this.renderer.width = w;
  }

  set height(h) {
    this.renderer.height = h;
  }

  static create(parent = null, props = {}) {
    let texture = null;
    let sprite = new PixiUISprite();
    if (props['src']) {
      texture = AssetsManager.resolveAsset(props['src']);
    }
    if (props['image']) {
      texture = PIXI.Texture.fromImage(props['image']);
    }
    sprite.setProps(props, PERMITTED_PROPS);
    sprite.renderer = new PixiUI.UI.Sprite(texture);
    if (props['alpha']) {
      sprite.renderer.alpha = props.alpha;
    }

    if (props.renderable === false) {
      sprite.renderable = false;
    }

    sprite.parent = parent;
    return sprite;
  }
}
