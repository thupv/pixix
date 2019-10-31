import PixiComponent from "./PixiComponent";
import TextInput from 'pixi-text-input';

const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'value',
  'fontFamily',
  'size',
  'align',
  'tint',
  'anchor',
  'placeholder',
  'input',
  'box'
];

export default class PixiTextInput extends PixiComponent {
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

  get text() {
    return this.renderer.text;
  }

  createTextInputRenderer() {
    this.renderer = new PIXI.TextInput({
      input: this.props.input || {},
      box: this.props.box || {}
    });
  }

  static create(parent, props = {}) {
    let text = new PixiTextInput();
    text.setProps(props, PERMITTED_PROPS);
    text.createTextInputRenderer();
    if (props.renderable === false) {
      text.renderable = false;
    }
    text.parent = parent;
    return text;
  }
}
