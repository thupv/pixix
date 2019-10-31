import {renderer as PixiXFiberRenderer} from "./renderer";
import PixiUtils from "../pixiUtils";
import stopAllSound from "../assetsManager";
let rootContainer = null;
let canvas = null;

function createRenderer(options) {
  let game = PixiUtils.initFiberGame(options);
  return PixiXFiberRenderer.createContainer(game.stage);
}

function render(element, container, options = {}) {
  options.view = container;
  canvas = container;
  rootContainer = createRenderer(options);
  PixiXFiberRenderer.updateContainer(element, rootContainer, null);
  return PixiXFiberRenderer.getPublicRootInstance(rootContainer);
}

function unmountComponentAtNode(container) {
  if (container._reactRootContainer) {
    ThreeXFiberRenderer.unbatchedUpdates(() => {
      ThreeXFiberRenderer.updateContainer(null, null, null, () => {
        container._reactRootContainer = null;
      });
    });
    return true;
  } else {
    return false;
  }
}

function stopRender() {
  unmountComponentAtNode(canvas);
  stopAllSound.stopAllSound();
}

export {render, stopRender};
