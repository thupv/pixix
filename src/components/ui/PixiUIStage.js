import * as PixiUI from "pixi-ui";
import PixiUIComponent from "./PixiUIComponent";

const PERMITTED_PROPS = [
  'width',
  'height'
];
export default class PixiUIStage extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let uiStage = new PixiUIStage();
    uiStage.setProps(props, PERMITTED_PROPS);
    uiStage.renderer = new PixiUI.UI.Stage(props.width, props.height);
    uiStage.parent = parent;
    return uiStage;
  }
}
