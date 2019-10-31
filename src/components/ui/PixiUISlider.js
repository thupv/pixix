import * as PixiUI from "pixi-ui";
import PixiUIComponent from "./PixiUIComponent";

const PERMITTED_PROPS = [
  'width',
  'height'
];
export default class PixiUISlider extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let uiSlider = new PixiUISlider();
    uiSlider.setProps(props, PERMITTED_PROPS);
    uiSlider.renderer = new PixiUI.UI.Slider(props.value || '', props.style || {});
    uiSlider.parent = parent;
    return uiSlider;
  }
}
