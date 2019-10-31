import {FiberPixiXComponent} from "../fiber/FiberPixiXComponent";


export default class PixiFilterComponent extends FiberPixiXComponent {
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

  set parent(parent) {
    parent.renderer.filters = [this.renderer];
  }

  set enabled(isEnable) {
    this.renderer.enabled = isEnable;
  }
}
