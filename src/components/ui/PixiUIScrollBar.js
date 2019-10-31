import * as PixiUI from "pixi-ui";
import PixiUIComponent from "./PixiUIComponent";
import AssetsManager from "../../assetsManager";

const PERMITTED_PROPS = [
  'trackSrc',
  'handleSrc',
  'scrollingContainer'
];
export default class PixiUIScrollBar extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let trackTexture = AssetsManager.resolveAsset(props['trackSrc']);
    let handleTexture = AssetsManager.resolveAsset(props['handleSrc']);
    let uiScrollBar = new PixiUIScrollBar();
    uiScrollBar.setProps(props, PERMITTED_PROPS);
    uiScrollBar.renderer = new PixiUI.UI.ScrollBar({
      track: new PixiUI.UI.SliceSprite(trackTexture),
      handle: new PixiUI.UI.SliceSprite(handleTexture),
      vertical: true,
      autohide: true,
      scrollingContainer: props['scrollingContainer']
    });
    uiScrollBar.renderer.track.width = 8;
    uiScrollBar.renderer.handle.width = 10;
    uiScrollBar.renderer.track.pivotX = -0.5;
    uiScrollBar.renderer.anchorTop = 38;
    uiScrollBar.renderer.anchorBottom = 1;
    uiScrollBar.renderer.anchorRight = 0;
    uiScrollBar.renderer.track.tint = 0x222222;
    uiScrollBar.renderer.track.blendMode = 0;
    uiScrollBar.parent = parent;
    return uiScrollBar;
  }
}
