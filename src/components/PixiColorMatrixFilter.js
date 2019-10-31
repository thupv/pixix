import PixiComponent from "./PixiComponent";
import COLOR_MATRIX_TYPES from "./colorMatrixTypes";
import PixiFilterComponent from "./PixiFilterComponent";

const PERMITTED_PROPS = [
  'alpha',
  'autoFit',
  'blendMode',
  'enabled',
  'matrix'
];

export default class PixiColorMatrixFilter extends PixiFilterComponent {

  static create(parent, props = {}) {
    let filter = new PixiColorMatrixFilter();
    filter.setProps(props, PERMITTED_PROPS);
    filter.renderer = new PIXI.filters.ColorMatrixFilter();
    filter.renderer.enabled = !!props.enabled;
    switch (props.filter) {
      case COLOR_MATRIX_TYPES.DESATURATE:
        filter.renderer.desaturate();
        break;
      case COLOR_MATRIX_TYPES.GREYSCALE:
        filter.renderer.greyscale();
        break;
      case COLOR_MATRIX_TYPES.SEPIA:
        filter.renderer.sepia();
        break;
      default:
        break;
    }
    if (parent) {
      parent.renderer.filters = [filter.renderer];
    }
    return filter;
  }
}
