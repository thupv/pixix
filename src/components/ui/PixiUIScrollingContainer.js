import PixiUIComponent from "./PixiUIComponent";
import * as PixiUI from "pixi-ui";

const PERMITTED_PROPS = [
  'isScrollX',
  'isScrollY',
  'dragThreshold',
  'dragRestrictAxis',
  'width',
  'height',
  'horizontalAlign',
  'verticalAlign',
  'top'
];
export default class PixiUIScrollingContainer extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let uiscrollingContainer = new PixiUIScrollingContainer();
    uiscrollingContainer.setProps(props, PERMITTED_PROPS);
    uiscrollingContainer.renderer = new PixiUI.UI.ScrollingContainer({
      scrollX: props.isScrollX,
      scrollY: props.isScrollY
    });
    if (props.top) {
      uiscrollingContainer.renderer.top = props.top;
    }
    uiscrollingContainer.renderer.anchorLeft = uiscrollingContainer.renderer.anchorRight = uiscrollingContainer.renderer.anchorBottom = 0;
    uiscrollingContainer.renderer.anchorTop = 40;
    uiscrollingContainer.renderer.horizontalAlign = props.horizontalAlign || 'center';

    uiscrollingContainer.renderer.dragThreshold = 5;
    uiscrollingContainer.renderer.dragRestrictAxis = "y";

    uiscrollingContainer.parent = parent;
    return uiscrollingContainer;
  }
}
