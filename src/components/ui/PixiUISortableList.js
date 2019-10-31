import PixiUIComponent from "./PixiUIComponent";
import * as PixiUI from "pixi-ui";
import * as PIXI from "pixi.js";
import AssetsManager from "../../assetsManager";

const PERMITTED_PROPS = [
];
export default class PixiUISortableList extends PixiUIComponent {
  static create(parent = null, props = {}) {
    let list = new PixiUISortableList();
    list.setProps(props, PERMITTED_PROPS);
    let sortableList = new PixiUI.UI.SortableList(true, 0, PIXI.UI.Ease.Power2.easeOut);
    sortableList.height = "100%";
    sortableList.width = "100%";
    list.renderer = sortableList;
    list.parent = parent;
    return list;
  }
}
