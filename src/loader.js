import AssetsManager, {ASSET_TYPE} from "./assetsManager";
import * as tmx from "tmx-parser";
import * as path from "path";
import {Howl} from 'howler';

let addedIds = [];
PIXI.loader.onProgress.add((_, data) => {
  AssetsManager.addAsset(data.name, data);
});

PIXI.loader.onError.add((_, data) => {
  console.warn('Error loading ' + data.name);
});

function addAsset(id, path) {
  if (addedIds.indexOf(id) > -1) return;
  addedIds.push(id);
  return PIXI.loader.add(`${ASSET_TYPE.IMAGE}/${id}`, path);
}

function addSpriteSheet(id, path, frameWidth, frameHeight, frameCount) {
  if (!frameWidth || !frameWidth) {
    console.warn('Load SpriteSheet need frameWidth & frameWidth');
    return;
  }
  if (addedIds.indexOf(id) > -1) return;
  addedIds.push(id);
  return frameCount
    ? PIXI.loader.add(`${ASSET_TYPE.SPRITE_SHEET}/${id}/${frameWidth}/${frameHeight}/${frameCount}`, path)
    : PIXI.loader.add(`${ASSET_TYPE.SPRITE_SHEET}/${id}/${frameWidth}/${frameHeight}`, path);
}

function addTmxMap(id, tmxPath) {
  if (addedIds.indexOf(id) > -1) return;
  return PIXI.loader
    .add(`${ASSET_TYPE.TMX}/${id}`, tmxPath)
    .use(tiledMapLoaderMiddleware);
}

function load() {
  return PIXI.loader.load();
}

function addLoadingCallback(fn) {
  PIXI.loader.onProgress.add(fn);
}

function addCompleteCallback(fn) {
  PIXI.loader.onComplete.add(fn);
}

function reset() {
  PIXI.loader.reset();
  PIXI.loader.onComplete.detachAll();
}

function tiledMapLoaderMiddleware(resource, next) {
  if (!(resource.extension === 'tmx')) return next();

  let route = path.dirname(resource.url.replace(this.baseUrl, ''));
  tmx.parse(resource.xhr.responseText, route, function (err, map) {
    if (err) throw err;
    resource.data = map;
    next();
  });
}

function addSound(id, soundPath) {
  if (addedIds.indexOf(id) > -1) return;
  return PIXI.loader
    .add(`${ASSET_TYPE.SOUND}/${id}`, soundPath)
    .use(howlerLoaderMiddleware);
}

function howlerLoaderMiddleware(resource, next) {
  if (resource && ["wav", "ogg", "mp3", "mpeg"].includes(resource.extension)) {
    resource._setFlag(PIXI.loaders.Resource.STATUS_FLAGS.LOADING, true);
    resource._setFlag(PIXI.loaders.Resource.STATUS_FLAGS.COMPLETE, false);
    const options = JSON.parse(JSON.stringify(resource.metadata));
    options.src = [resource.url];
    options.onload = function () {
      next();
    };
    options.onloaderror = function (id, message) {
      console.error(resource);
      resource.abort(message);
      next();
    };
    resource.data = new Howl(options);
  } else {
    next();
  }
}

const Loader = {
  progress: PIXI.loader.progress,
  addLoadingCallback,
  addSound,
  addCompleteCallback,
  addAsset,
  addTmxMap,
  addSpriteSheet,
  load,
  reset,
};

export default Loader;
