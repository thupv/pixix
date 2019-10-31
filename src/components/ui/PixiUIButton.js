import * as PixiUI from "pixi-ui";
import PixiUIComponent from "./PixiUIComponent";
import AssetsManager from "../../assetsManager";

const PERMITTED_PROPS = [
  'width',
  'height',
  'left',
  'right',
  'scale',
  'top',
  'onClick',
  'renderable'
];
export default class PixiUIButton extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let uiStage = new PixiUIButton();
    uiStage.setProps(props, PERMITTED_PROPS);
    let texture = AssetsManager.resolveAsset(props['src']);
    let button = new PixiUI.UI.Button({
      background: new PixiUI.UI.Sprite(texture),
      text: new PixiUI.UI.DynamicText(props.text || ' ')
    });

    button.on("hover", function (over) {
      let ease = over ? PixiUI.UI.Ease.Bounce.BounceOut : PixiUI.UI.Ease.Circ.CircOut;
      PixiUI.UI.Tween.to(button.background, 0.5, {scale: over ? 1.15 : 1, tint: over ? "#d8ff6e" : "#ffffff"}, ease);
    });
    button.onPress = props.onClick;
    if (props.renderable === false) {
      button.renderable = false;
      button.interactive = false;
    }
    uiStage.renderer = button;
    uiStage.parent = parent;
    return uiStage;
  }
}
