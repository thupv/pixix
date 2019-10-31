import PixiComponent from "./PixiComponent";

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
  'strokeThickness',
  'strokeColor'
];

export default class PixiText extends PixiComponent {
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

  set size(s) {
    this.renderer.style.fontSize = s - 4;
  }

  createTextRenderer() {
    const style = new PIXI.TextStyle({
      fontFamily: this.props.fontFamily || "Verdana, Geneva, sans-serif",
      fontSize: this.props.size - 4 || 26,
      strokeThickness: this.props.strokeThickness || 0,
      breakWords: true,
      lineJoin: "round",
      stroke: this.props.strokeColor || 0x000000,
      fontWeight: this.props.fontWeight || "normal",
      align: this.props.align || "left",
      fill: [
        this.props.tint || 'white'
      ],
    });
    this.renderer = new PIXI.Text(this.props.value, style);
  }

  static create(parent, props = {}) {
    let text = new PixiText();
    text.setProps(props, PERMITTED_PROPS);
    text.createTextRenderer();
    if (props.renderable === false) {
      text.renderable = false;
    }
    text.parent = parent;
    return text;
  }
}
