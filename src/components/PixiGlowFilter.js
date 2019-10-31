import PixiFilterComponent from "./PixiFilterComponent";
import * as filters from "pixi-filters";

const PERMITTED_PROPS = [
  'threshold',
  'bloomScale',
  'brightness',
  'blur',
  'quality',
  'kernels',
  'pixelSize'
];

export default class PixiAdvancedBloomFilter extends PixiFilterComponent {
  static create(parent, props = {}) {
    let filter = new PixiAdvancedBloomFilter();
    filter.setProps(props, PERMITTED_PROPS);
    filter.renderer = new filters.GlowFilter ();
    filter.renderer.enabled = !!props.enabled;
    if (parent) {
      parent.renderer.filters = [filter.renderer];
    }
    return filter;
  }
}
