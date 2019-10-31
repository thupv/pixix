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
  'anchorY'
];
export default class PixiUISliceSprite extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let texture = null;
    let sliceSprite = new PixiUISliceSprite();
    if (props['src']) {
      texture = AssetsManager.resolveAsset(props['src']);
    }
    if (props['image']) {
      texture = PIXI.Texture.fromImage(props['image']);
      console.log(texture);
    }


    sliceSprite.setProps(props, PERMITTED_PROPS);
    sliceSprite.renderer = new PixiUI.UI.SliceSprite(texture, 2, true, false);
    sliceSprite.parent = parent;
    return sliceSprite;
  }
}
