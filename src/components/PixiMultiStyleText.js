import PixiComponent from "./PixiComponent";
import MultiStyleText from "pixi-multistyle-text";

const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'value',
  'styles',
];

export default class PixiMultiStyleText extends PixiComponent {
  set value(text) {
    this._renderer.text = text;
  }

  set y(y) {
    this._renderer.y = y;
  }

  set alpha(a) {
    this._renderer.alpha = a;
  }

  set tint(color) {
    this.renderer.style.fill = [color];
  }

  set renderable(isRenderable) {
    this.renderer.renderable = isRenderable;
  }

  createTextRenderer() {
    this.renderer = new MultiStyleText(this.props.value, this.props.styles);
  }

  static create(parent, props = {}) {
    let text = new PixiMultiStyleText();
    text.setProps(props, PERMITTED_PROPS);
    text.createTextRenderer();
    if (props.renderable === false) {
      text.renderable = false;
    }
    text.parent = parent;
    return text;
  }
}
