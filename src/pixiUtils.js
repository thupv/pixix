import * as PIXI from "pixi.js";
import Component from "./components/index";
import Game from "./game";

const DEFAULT_OPTIONS = {
  width: 1120,
  height: 630,
  resolution: 2,
  autoResize: true,
  autoResizeBasedOnHeight: false,
  antialias: false,
  transparent: true,
  roundPixels: false,
};

let game = null;

export function getGame() {
  return game;
}

function initGame(element, options) {
  options = Object.assign(DEFAULT_OPTIONS, options);
  if (typeof element === 'object') {
    let renderer = PixiUtils.createRenderer(options);
    game = new Game();
    game.options = options;
    game.fetchScenes(element.props.children);
    game.stage = Component.createStage(game);
    game.renderer = renderer;
    game.props = element.props;
    game.startTicker();
    game.start();

    return game;
  }
}

function initFiberGame(options) {
  options = Object.assign(DEFAULT_OPTIONS, options);
  let renderer = PixiUtils.createRenderer(options);
  game = new Game();
  game.options = options;
  // game.fetchScenes(element.props.children);
  game.stage = Component.createStage(game);
  game.renderer = renderer;
  game.props = {};
  game.startTicker();
  // game.start();

  return game;
}

function createRenderer(options) {
  if (!options.view) {
    options.view = document.createElement('canvas');
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(options.view);
  }
  let renderer = new PIXI.autoDetectRenderer(options);
  renderer.plugins.interaction.autoPreventDefault = true;
  renderer.view.style.touchAction = 'auto';
  if (options.autoResize) {
    renderer.view.style.width = '100%';
    renderer.view.style.height = 'auto';
  }
  if (options.autoResizeBasedOnHeight) {
    renderer.view.style.height = '100%';
    renderer.view.style.width = 'auto';
  }
  return renderer;
}

const PixiUtils = {
  createRenderer,
  initGame,
  initFiberGame
};

export default PixiUtils;
