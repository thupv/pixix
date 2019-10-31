import * as PIXI from "pixi.js";
import PixiComponent, {addToCullingObjects} from "./PixiComponent";
import AssetsManager from "../assetsManager";
import 'pixi-layers';
import * as EasyStar from 'easystarjs';


const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'scale',
  'anchor',
  'renderable',
  'interactiveChildren',
  'isAnimated'
];

const LAYER_TYPE = {
  TILE: 'tile',
  OBJECT: 'object',
};

export default class PixiTiledMap extends PixiComponent {
  constructor(data, mapTexture, extraProps) {
    super();
    this._tileSets = [];
    this._mapData = data;
    this.width = data.width;
    this.height = data.height;
    this.tileWidth = data.tileWidth;
    this.tileHeight = data.tileHeight;
    this._mapTexture = mapTexture;
    this._tileLayers = [];
    this._objectLayers = [];
    this._otherLayer = [];
    this._objects = null;
    this.collisionLayers = [];
    this.createTileSet();

    this.objParentGroup = extraProps.objParentGroup;
  }

  findPath(fromX, fromY, toX, toY) {
    if (!this.collisionLayer) return Promise.reject('PixiX: No collision layer');
    return this.collisionLayer.findPath(fromX, fromY, toX, toY);
  }

  checkCollision(x, y, width) {
    return this.collisionLayers.every(collisionLayer => collisionLayer.checkCollision(x, y, width));
  }

  get objects() {
    if (this._objects !== null) {
      return this._objects;
    }
    this._objects = {};
    this._objectLayers.forEach((layer) => {
      layer.objects.forEach((object) => {
        this._objects[object.type] = [...(this._objects[object.type] || []), object];
      });
    });
    return this._objects;
  }

  createMapRenderer() {
    let container = new PIXI.Container();
    this.createBGLayer(container);
    this.createMapLayer(container);
    container.pivot.set(this.width * this.tileWidth * this.props.anchor.x, this.height * this.tileHeight * this.props.anchor.y);
    return container;
  }

  createTileSet() {
    this._mapData.tileSets.forEach((tileSet) => {
      if (tileSet.image) {
        this._tileSets.push(PixiTileSet.fromTiledTileSet(tileSet, this._mapTexture));
      } else {
        this._tileSets.push(PixiImageTileSet.fromTiledTileSet(tileSet, this._mapTexture));
      }
    });
  }

  createBGLayer(container) {
    let background = new PIXI.Graphics();
    background.beginFill(0x5fa9df, 0);
    background.drawRect(0, 0, this.width * this.tileWidth, this.height * this.tileHeight);
    background.endFill();
    container.addChild(background);
    return background
  }

  createMapLayer(container) {
    this._mapData.layers.forEach((layerData) => {
      if (layerData.name.includes('block=true')) {
        this.collisionLayers.push(PixiCollisionLayer.newFromTiledData(layerData));
      } else {
        switch (layerData.type) {
          case LAYER_TYPE.TILE:
            let tileLayer = PixiTileLayer.newFromTiledData(layerData, this._tileSets, this.objParentGroup, this.props.isAnimated);
            this._tileLayers.push(tileLayer);
            container.addChild(tileLayer);
            break;
          case LAYER_TYPE.OBJECT:
            this._objectLayers.push(layerData);
            break;
          default:
            this._otherLayer.push(layerData);
        }
      }
    });
  }

  static create(parent = null, props = {anchor: {x: 0, y: 0}}) {
    let mapData = AssetsManager.resolveAsset(props.tmxSrc);
    let mapTexture = AssetsManager.resolveAsset(props.tileSetsSrc);
    let map = new PixiTiledMap(mapData.data, mapTexture, props);
    map.setProps(props, PERMITTED_PROPS);
    map.renderer = map.createMapRenderer();
    map.parent = parent;
    return map;
  }
}

class PixiCollisionLayer {
  constructor() {
    this.collisionsMap = {};
    this.layerData = null;
    this.tileHeight = 0;
    this.tileWidth = 0;
    this.width = 0;
    this.height = 0;
    this.easyStar = null;
  }

  findPath(starX, startY, targetX, targetY) {
    let startPosX = Math.floor(starX / this.tileWidth);
    let startPosY = Math.floor(startY / this.tileHeight);
    let targetPosX = Math.floor(targetX / this.tileWidth);
    let targetPosY = Math.floor(targetY / this.tileHeight);
    if (!this.easyStar) {
      this.easyStar = new EasyStar.js();
    }
    this.easyStar.setGrid(this.collisionsMap);
    this.easyStar.setAcceptableTiles([0]);
    return new Promise((resolve, reject) => {
      this.easyStar.findPath(startPosX, startPosY, targetPosX, targetPosY, (path) => {
        if (path === null) {
          reject("Path was not found.");
        } else {
          resolve(path);
        }
      });
      this.easyStar.calculate();
    });
  }

  convert2Dto1D(x, y) {
    return x * this.width + y;
  }

  checkPointInBlockedCell(x, y) {
    let posX = Math.floor(x / this.tileWidth);
    let posY = Math.floor(y / this.tileHeight);
    return !!this.collisionsMap[this.convert2Dto1D(posX, posY)];
  }

  // Player at (x, y) with width
  // If the Square of (x, y) cut some blocked cell, one of its corner must be in the blocked cell;
  checkCollision(_y, _x, width) {
    width = Math.min(width, Math.min(this.tileHeight, this.tileWidth));

    let x = _x - (this.layerData.properties.offsetX || 0);
    let y = _y - (this.layerData.properties.offsetY || 0);


    return !(this.checkPointInBlockedCell(x - width / 2, y - width / 2)
      || this.checkPointInBlockedCell(x - width / 2, y + width / 2)
      || this.checkPointInBlockedCell(x + width / 2, y - width / 2)
      || this.checkPointInBlockedCell(x + width / 2, y + width / 2)
    );
  }

  static newFromTiledData(layerData) {
    let layer = new PixiCollisionLayer();
    layer.layerData = layerData;
    layer.tileHeight = layerData.map.tileHeight / 2;
    layer.tileWidth = layerData.map.tileWidth / 2;
    layer.width = layerData.map.width * 2;
    layer.height = layerData.map.height * 2;

    layer.createCollision(layerData.map.width, layerData.map.height);
    return layer;
  }

  createCollision(mapWidth, mapHeight) {
    let tileIdx = 0;
    for (let i = 0; i < mapHeight; i++) {
      for (let j = 0; j < mapWidth; j++) {
        let tile = this.layerData.tiles[tileIdx];
        tileIdx += 1;

        if (tile) {
          if (["cell", "top", "left", "top-left"].includes(tile.properties["type"])) {
            this.collisionsMap[this.convert2Dto1D(i * 2, j * 2)] = true;
          }
          if (["cell", "top", "right", "top-right"].includes(tile.properties["type"])) {
            this.collisionsMap[this.convert2Dto1D(i * 2, j * 2 + 1)] = true;
          }
          if (["cell", "bottom", "left", "bottom-left"].includes(tile.properties["type"])) {
            this.collisionsMap[this.convert2Dto1D(i * 2 + 1, j * 2)] = true;
          }
          if (["cell", "bottom", "right", "bottom-right"].includes(tile.properties["type"])) {
            this.collisionsMap[this.convert2Dto1D(i * 2 + 1, j * 2 + 1)] = true;
          }
        }
      }
    }
  }
}

class PixiTileLayer extends PIXI.Container {
  constructor(maxSize, properties, batchSize, autoResize) {
    super(maxSize, properties, batchSize, autoResize);
    this._tiles = [];
  }

  static newFromTiledData(layerData, tileSets, objParentGroup, isAnimated) {
    let tileLayer = new PixiTileLayer(40000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    tileLayer.layerData = layerData;
    tileLayer.createTile(tileSets, objParentGroup, isAnimated);
    return tileLayer;
  }

  createTile(tileSets, objParentGroup, isAnimated) {
    const TileClass = isAnimated ? PixiAnimatedTile : PixiStaticTile;
    for (let y = 0; y < this.layerData.map.height; y++) {
      for (let x = 0; x < this.layerData.map.width; x++) {
        let i = x + (y * this.layerData.map.width);
        if (this.layerData.tiles[i] && this.layerData.tiles[i].gid && this.layerData.tiles[i].gid !== 0) {
          let tileSet = PixiTileLayer.findTileSet(this.layerData.tiles[i].gid, tileSets);
          let tile = new TileClass(this.layerData.tiles[i], tileSet, this.layerData.horizontalFlips[i],
            this.layerData.verticalFlips[i], this.layerData.diagonalFlips[i]);
          addToCullingObjects(tile);
          let textureHeight = isAnimated ? tile.textures[0].height : tile.texture.height;
          tile.x = x * (this.layerData.map.tileWidth);
          tile.y = y * (this.layerData.map.tileHeight) + (this.layerData.map.tileHeight - textureHeight);

          tile._x = x;
          tile._y = y;

          if (tileSet.tileOffset) {
            tile.x += tileSet.tileOffset.x;
            tile.y += tileSet.tileOffset.y;
          }
          tile.x += this.layerData.properties.offsetX || 0;
          tile.y += this.layerData.properties.offsetY || 0;

          if (this.layerData.tiles[i].properties.zIndex !== undefined && objParentGroup) {
            tile.parentGroup = objParentGroup;
            tile.zIndex = tile.y + this.layerData.map.tileHeight * (this.layerData.tiles[i].properties.zIndex) + 0.5;
          }

          this._tiles.push(tile);
          this.addChild(tile);
        }
      }
    }
  }

  static findTileSet(gid, tileSets) {
    let tileSet;
    for (let i = tileSets.length - 1; i >= 0; i--) {
      tileSet = tileSets[i];
      if (tileSet.firstGid < gid) break;
    }
    return tileSet;
  }
}

class PixiStaticTile extends PIXI.Sprite {
  constructor(tileData, tileSet, horizontalFlip, verticalFlip, diagonalFlip) {
    let textures = PixiTileSet.getTextures(tileData, tileSet);
    super(textures[0]);
    this.setFlips(horizontalFlip, verticalFlip, diagonalFlip)
  }

  setFlips(horizontalFlip, verticalFlip, diagonalFlip) {
    if (horizontalFlip) {
      this.anchor.x = 1;
      this.scale.x = -1;
    }

    if (verticalFlip) {
      this.anchor.y = 1;
      this.scale.y = -1;
    }

    if (diagonalFlip) {
      if (horizontalFlip) {
        this.anchor.x = 0;
        this.scale.x = 1;
        this.anchor.y = 1;
        this.scale.y = 1;

        this.rotation = PIXI.DEG_TO_RAD * 90;
      }
      if (verticalFlip) {
        this.anchor.x = 1;
        this.scale.x = 1;
        this.anchor.y = 0;
        this.scale.y = 1;

        this.rotation = PIXI.DEG_TO_RAD * -90;
      }
    }
  }
}

class PixiAnimatedTile extends PIXI.extras.AnimatedSprite {
  constructor(tileData, tileSet, horizontalFlip, verticalFlip, diagonalFlip) {
    let textures = PixiTileSet.getTextures(tileData, tileSet);
    super(textures);
  }
}

class PixiTileSet {
  constructor(texture) {
    this._baseTexture = texture;
    this._textures = [];
  }

  static fromTiledTileSet(tileSetData, baseTexture) {
    let tileSet = new PixiTileSet(baseTexture);
    tileSet.margin = tileSetData.margin || 0;
    tileSet.image = tileSetData.image;
    tileSet.tileHeight = tileSetData.tileHeight;
    tileSet.tileWidth = tileSetData.tileWidth;
    tileSet.spacing = tileSetData.spacing || 0;
    tileSet.firstGid = tileSetData.firstGid;
    tileSet.createTileTextures();
    return tileSet;
  }

  get textures() {
    return this._textures;
  }

  createTileTextures() {
    for (let y = this.margin; y < this.image.height; y += this.tileHeight + this.spacing) {
      for (let x = this.margin; x < this.image.width; x += this.tileWidth + this.spacing) {
        this._textures.push(new PIXI.Texture(this._baseTexture, new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight)))
      }
    }
  }

  static getTextures(tileData, tileSet) {
    let textures = [];
    if (tileData.animations.length) {
      tileData.animations.forEach(function (frame) {
        textures.push(tileSet.textures[frame.tileId])
      }, this);
    } else {
      textures.push(tileSet.textures[tileData.gid - tileSet.firstGid])
    }
    return textures;
  }
}

class PixiImageTileSet {
  constructor(texture) {
    this._baseTexture = texture;
    this._textures = [];
  }

  static fromTiledTileSet(tileSetData, baseTexture) {
    let tileSet = new PixiImageTileSet(baseTexture);
    tileSet.margin = tileSetData.margin || 0;
    tileSet.image = tileSetData.image;
    tileSet.tileHeight = tileSetData.tileHeight;
    tileSet.tileWidth = tileSetData.tileWidth;
    tileSet.spacing = tileSetData.spacing || 0;
    tileSet.firstGid = tileSetData.firstGid;
    tileSet.tiles = tileSetData.tiles;
    tileSet.createTileTextures();
    return tileSet;
  }

  get textures() {
    return this._textures;
  }

  createTileTextures() {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i]) {
        this._textures.push(AssetsManager.resolveAsset(`@img/${this.tiles[i].image.source}`));
      } else {
        this._textures.push(null);
      }
    }
  }

  static getTextures(tileData, tileSet) {
    let textures = [];
    if (tileData.animations.length) {
      tileData.animations.forEach(function (frame) {
        textures.push(tileSet.textures[frame.tileId])
      }, this);
    } else {
      textures.push(tileSet.textures[tileData.gid - tileSet.firstGid])
    }
    return textures;
  }
}
