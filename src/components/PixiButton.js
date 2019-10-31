import PixiComponent from "./PixiComponent";
import AssetsManager from "../assetsManager";
import * as PIXI from "pixi.js";

const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'src',
  'image',
  'anchor',
  'scale',
  'parentGroup',
  'renderable',
  'hoverSrc',
  'buttonMode'
];

export default class PixiButton extends PixiComponent {
  set tint(color) {
    this.props.tint = color;
    this._renderer.tint = color;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onMouseOver(fn) {
    this._onMouseOver = fn;
  }

  set onMouseOut(fn) {
    this._onMouseOut = fn;
  }

  set onPointerUp(fn) {
    this._onPointerUp = fn;
  }

  set onPointerDown(fn) {
    this._onPointerDown = fn;
  }

  set disabled(isDisabled) {
    this._isDisabled = isDisabled;
  }

  set sprite(src) {
    let texture = AssetsManager.resolveAsset(src);
    this._renderer.texture = texture;
  }

  setButtonEffect() {
    this._renderer.on('pointerdown', this.pointerDown.bind(this));
    this._renderer.on('pointerup', this.onButtonUp.bind(this));
    this._renderer.on('pointerupoutside', this.onButtonUp.bind(this));
    this._renderer.on('pointerover', this.onButtonOver.bind(this));
    this._renderer.on('pointerout', this.onButtonOut.bind(this));
    this._renderer.on('click', this.onMouseClick.bind(this));
    this._renderer.on('tap', this.onTap.bind(this));
  }

  set sprite(src) {
    this._renderer.texture = AssetsManager.resolveAsset(src);
  }

  set image(url) {
    let texture = PIXI.Texture.fromImage(url);
    this.renderer.texture = texture;
  }

  set src(image) {
    let texture = AssetsManager.resolveAsset(image);
    this.renderer.texture = texture;
  }

  onMouseClick(event) {
    // this._onClick && this._onClick(event);
  }

  onTap(event) {
    // this._onClick && this._onClick(event);
  }

  pointerDown(event) {
    this._onClick && this._onClick(event);
    this._onPointerDown && this._onPointerDown();
  }

  onButtonUp() {
    this._onPointerUp && this._onPointerUp();
  }

  onButtonOver() {
    if (this.props.hoverSrc) {
      this._renderer.texture = PIXI.Texture.fromImage(this.props.hoverSrc);
    } else {
      this._renderer.alpha = 0.9;
    }
    this._onMouseOver && this._onMouseOver();
  }

  onButtonOut() {
    if (this.props.hoverSrc) {
      this._renderer.texture = PIXI.Texture.fromImage(this.props.src);
    } else {
      this._renderer.alpha = 1;
    }
    this._onMouseOut && this._onMouseOut();
  }

  set renderable(isRenderable) {
    this._renderer.renderable = isRenderable;
    this._renderer.interactive = isRenderable;
  }

  static create(parent, props = {}) {
    let button = new PixiButton();
    button.setProps(props, PERMITTED_PROPS);
    let texture = null;
    if (props['image']) {
      texture = PIXI.Texture.fromImage(props['image']);
    }
    if (props['src']) {
      texture = AssetsManager.resolveAsset(props['src']);
    }
    button.renderer = new PIXI.Sprite(texture);
    if (props.buttonMode !== false) {
      button.renderer.buttonMode = true;
    }
    button.renderer.interactive = true;
    button.renderer.alpha = 1;
    button.setButtonEffect();
    if (props.renderable === false) {
      button.renderable = false;
    }
    if (typeof props.onClick === 'function') {
      button.onClick = props.onClick;
    }
    if (typeof props.onMouseOver === 'function') {
      button.onMouseOver = props.onMouseOver;
    }
    if (typeof props.onMouseOut === 'function') {
      button.onMouseOut = props.onMouseOut;
    }
    if (typeof props.onPointerUp === 'function') {
      button.onPointerUp = props.onPointerUp;
    }
    if (typeof props.onPointerDown === 'function') {
      button.onPointerDown = props.onPointerDown;
    }
    if (parent) {
      parent.renderer.addChild(button.renderer);
    }
    return button;
  }
}
