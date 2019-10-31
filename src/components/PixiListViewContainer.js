import * as PIXI from "pixi.js";
import PixiComponent from "./PixiComponent";


const PERMITTED_PROPS = [
  'x',
  'y',
  'width',
  'height',
  'itemHeight'
];
export default class PixiListViewContainer extends PixiComponent {
  static create(parent = null, props = {}) {
    let pixiContainer = new PixiListViewContainer();
    pixiContainer.setProps(props, PERMITTED_PROPS);
    pixiContainer.createScrollContainer();
    return pixiContainer;
  }

  createScrollContainer() {
    let container = new PIXI.Container();
    let scrollContainer = new PIXI.Container();
    container.addChild(scrollContainer);
    let mask = new PIXI.Graphics();
    mask.beginFill(0xffffff).drawRect(0, 0, this.props.width, this.props.height).endFill();
    scrollContainer.x = 0;
    scrollContainer.y = 0;
    this._y = this.props.y;
    container.addChild(mask);
    this.items = [];
    scrollContainer.mask = mask;
    this.mousedown = false;
    this.lastPos = null;
    this.lastDiff = null;
    this.scrollTween = null;

    container.interactive = true;
    this.renderer = container;
    this.scrollContainer = scrollContainer;

    this.renderer.mousemove = e => this.onmousemove(e);
    this.renderer.mousedown = e => this.onmousedown(e);
    this.renderer.mouseup = e => this.onmouseup(e);
    this.renderer.mouseupoutside = e => this.onmouseup(e);
    this.renderer.touchstart = e => this.onmousedown(e);
    this.renderer.touchend = e => this.onmouseup(e);
    this.renderer.touchendoutside = e => this.onmouseup(e);
  }

  onmousemove(e) {
    const {originalEvent} = e.data;
    let clientY = !originalEvent.touches ? originalEvent.clientY : originalEvent.touches[0].clientY;

    if (this.mousedown) {
      this.lastDiff = clientY - this.lastPos.y;
      this.lastPos.y = clientY;

      if (-this.scrollContainer.y < 0) {
        this.scrollContainer.y += this.lastDiff / 2;
      } else {
        this.scrollContainer.y += this.lastDiff;
      }
    }
  }

  onmousedown(e) {
    const {originalEvent} = e.data;
    const clientY = !originalEvent.touches ? originalEvent.clientY : originalEvent.touches[0].clientY;
    this.mousedown = true;
    if (this.scrollTween) {
      this.scrollTween.kill();
    }
    this.lastPos = {
      y: clientY
    };
  }

  onmouseup() {
    if (this.lastDiff) {
      let goY = this.scrollContainer.y + this.lastDiff * 10;
      let ease = window.Quad.easeOut;
      let time = Math.abs(this.lastDiff / 150);
      if (goY < -this.items.length * this.props.itemHeight + this.height + this._y) {
        goY = -this.items.length * this.props.itemHeight + this.height + this._y;
        ease = window.Back.easeOut;
        time = 0.1 + Math.abs(this.lastDiff / 150);
      }
      if (goY > this._y) {
        goY = this._y;
        ease = window.Back.easeOut;
        time = 0.1 + Math.abs(this.lastDiff / 150);
      }

      if (this.scrollContainer.y > 0) {
        time = 1 + this.scrollContainer.y / 500;
        ease = window.Elastic.easeOut;
      }
      if (this.scrollContainer.y < -this.items.length * this.props.itemHeight + this.height) {
        time = 1 + (this.items.length * this.props.itemHeight + this.height + this.scrollContainer.y) / 500;
        ease = window.Elastic.props.easeOut;
      }
      this.scrollTween = window.TweenMax.to(this.scrollContainer, time, {
        y: goY,
        ease
      });
    }

    this.mousedown = false;
    this.lastPos = null;
    this.lastDiff = null;
  }

  addChild(child) {
    super.addChild(child);
    this.scrollContainer.addChild(child.renderer);
    this.items.push(child);
    child.y = (this.items.length - 1) * this.props.itemHeight;
  }
}
