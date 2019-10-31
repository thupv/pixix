import * as PixiUI from "pixi-ui";
import PixiUIComponent from "./PixiUIComponent";

const PERMITTED_PROPS = [
  'width',
  'height',
  'left',
  'right',
  'top',
  'bottom',
  'anchorRight',
  'anchorLeft',
  'anchorTop',
  'anchorBottom',
  'align',
  'tint',
  'renderable'
];
export default class PixiUIText extends PixiUIComponent {
  set value(text) {
    this._renderer.text = text;
  }

  static create(parent = null, props = {}) {
    let uiStage = new PixiUIText();
    uiStage.setProps(props, PERMITTED_PROPS);
    let fontStyles = new PIXI.TextStyle({
      fontFamily: props.fontFamily || "Arial",
      fontSize: props.fontSize || 24,
      fill: [props.tint || 'white'],
      strokeThickness: [props.strokeThickness || 0],
      stroke: [props.stroke || '0x000000'],
      align: props.align || 'left'
    });
    uiStage.renderer = new PixiUI.UI.Text(props.value.toString() || '', fontStyles);
    if (props.renderable === false) {
      uiStage.renderable = false;
    }
    uiStage.parent = parent;
    return uiStage;
  }
}
