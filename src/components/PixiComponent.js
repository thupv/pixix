import * as TWEEN from 'es6-tween';
import {FiberPixiXComponent} from "../fiber/FiberPixiXComponent";

let cullingObjects = [];

export function getCullingObjects() {
  return cullingObjects;
}

export function addToCullingObjects(object) {
  cullingObjects.push(object);
}

export default class PixiComponent extends FiberPixiXComponent {
  set isCulling(isCullingObject) {
    this._isCulling = isCullingObject;
    isCullingObject ? cullingObjects.push(this._renderer) : cullingObjects.filter((object) => {
      return object !== this._renderer
    });
  }

  get isCulling() {
    return this._isCulling;
  }

  setProps(props, permitProps) {
    this.props = {};
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        if (permitProps.indexOf(key) > -1) {
          this.props[key] = props[key];
        }
      }
    }
  }

  set renderer(renderer) {
    if (this._parent) {
      if (this._parent.isLayer) {
        this._renderer.parentLayer = parent.renderer;
      } else if (parent.isScrollContainer) {
        this._parent.renderer.content.addChild(this._renderer);
        this._parent.renderer._drawScrollbars();
      } else {
        this._parent.renderer.addChild(this._renderer);
      }
    }
    this._renderer = renderer;
    for (let key in this.props) {
      if (this.props.hasOwnProperty(key)) {
        this._renderer[key] = this.props[key];
      }
    }
  }

  get renderer() {
    return this._renderer;
  }

  fadeOut(time = 1000) {
    let properties = {alpha: 1};
    new TWEEN.Tween(properties)
      .to({alpha: 0}, time)
      .on('update', ({alpha}) => {
        this._renderer.alpha = alpha;
      })
      .start();
  }

  fadeIn(time = 1000) {
    let properties = {alpha: 0};
    new TWEEN.Tween(properties)
      .to({alpha: 1}, time)
      .on('update', ({alpha}) => {
        this._renderer.alpha = alpha;
      })
      .start();
  }

  set x(x) {
    this.props.x = x;
    this._renderer.x = x;
  }

  set y(y) {
    this.props.y = y;
    this._renderer.y = y;
  }

  get x() {
    return this._renderer.x;
  }

  get y() {
    return this._renderer.y;
  }

  get anchor() {
    return this._renderer.anchor;
  }

  set anchor({x, y}) {
    if (!this._renderer.anchor) return;
    this._renderer.anchor.x = x;
    this._renderer.anchor.y = y;
  }

  set scale(s) {
    this._renderer.scale = s;
  }

  set rotation(r) {
    this._renderer.rotation = r;
  }

  set renderable(isRenderable) {
    this._renderer.renderable = isRenderable;
  }

  set alpha(alpha) {
    this._renderer.alpha = alpha;
  }

  set parentGroup(parentGroup) {
    this._renderer.parentGroup = parentGroup;
  }

  set zIndex(zIndex) {
    this._renderer.zIndex = zIndex;
  }

  set parent(parent) {
    if (!parent) return;
    if (this._renderer) {
      if (parent.isLayer) {
        this._renderer.parentLayer = parent.renderer;
      } else if (parent.isScrollContainer) {
        parent.renderer.content.addChild(this._renderer);
        parent.renderer._drawScrollbars();
      } else {
        parent.renderer.addChild(this._renderer);
      }
    }
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  set mask(component) {
    if (component && component.renderer) {
      this._renderer.mask = component.renderer;
    }
  }

  set enabled(isEnabled) {
    this._renderer.enabled = isEnabled;
  }

  addChild(child) {
    super.addChild(child);
    if (child) {
      child.parent = this;
    }
  }

  removeChild(child) {
    super.removeChild(child);
    if (child._renderer) {
      this._renderer.removeChild(child._renderer);
    }
    child.destroy();
  }

  destroy() {
    this._renderer.destroy();
  }
}
