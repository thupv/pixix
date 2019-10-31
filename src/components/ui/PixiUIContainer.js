import PixiUIComponent from "./PixiUIComponent";
import * as PixiUI from "pixi-ui";

const PERMITTED_PROPS = [
  'width',
  'height',
  'listIndex',
  'left',
  'top',
  'verticalAlign',
  'horizontalAlign',
  'tint',
  'minWidth',
  'minHeight',
  'renderable'
];
export default class PixiUIContainer extends PixiUIComponent {
  set parent(parent) {
    if (!parent) return;
    if (this._renderer) {
      if (parent.isLayer) {
        this._renderer.parentLayer = parent.renderer;
      } else {
        if (this.props.listIndex) {
          parent.renderer.addChild(this._renderer, () => this.props.listIndex, () => this.props.listIndex);
        } else {
          parent.renderer.addChild(this._renderer);
        }
      }
    }
    this._parent = parent;
  }

  static create(parent = null, props = {}) {
    let uiContainer = new PixiUIContainer();
    uiContainer.setProps(props, PERMITTED_PROPS);
    let renderer = new PixiUI.UI.Container(props.width || 100, props.height || 100);
    if (props.verticalAlign) {
      renderer.verticalAlign = props.verticalAlign
    }

    if (props.horizontalAlign) {
      renderer.horizontalAlign = props.horizontalAlign;
    }

    if (props.height) {
      renderer.height = props.height
    }

    if (props.width) {
      renderer.width = props.width
    }

    if (props.minWidth) {
      renderer.minWidth = props.minWidth;
    }
    if (props.top) {
      renderer.top = props.top;
    }

    if (props.left) {
      renderer.left = props.left;
    }
    uiContainer.renderer = renderer;
    uiContainer.parent = parent;
    return uiContainer;
  }
}
