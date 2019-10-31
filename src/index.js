import render from './render';
import {TYPES} from "./components/index";
import Loader from "./loader";
import PixiUtils from "./pixiUtils";
import Game from "./game";
import Scene from "./scene";
import Component from "./component";
import Builder from "./builder";
import COLOR_MATRIX_TYPES from "./components/colorMatrixTypes";
import {render as fiberRender} from "./fiber/render";
import {stopRender as stopFiberRender} from "./fiber/render";

export const ColorMatrixTypes = COLOR_MATRIX_TYPES;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const AdvancedText = TYPES.ADVANCED_TEXT;
export const TextInput = TYPES.TEXT_INPUT;
export const MultiStyleText = TYPES.MULTI_STYLE_TEXT;
export const Container = TYPES.CONTAINER;
export const Button = TYPES.BUTTON;
export const Rectangle = TYPES.RECTANGLE;
export const BitmapText = TYPES.BITMAP_TEXT;
export const Polygon = TYPES.POLYGON;
export const ColorMatrixFilter = TYPES.COLOR_MATRIX_FILTER;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const AnimatedSprite = TYPES.ANIMATED_SPRITE;
export const DisplacementFilter = TYPES.DISPLACEMENT_FILTER;
export const TiledMap = TYPES.TILED_MAP;
export const Camera = TYPES.CAMERA;
export const Layer = TYPES.LAYER;
export const Sound = TYPES.SOUND;
export const GSAPAnimation = TYPES.GSAP_ANIMATION;
export const ParticleEmitter = TYPES.PARTICLE_EMITTER;
export const AdvancedBloomFilter = TYPES.ADVANCED_BLOOM_FILTER;
export const GlowFilter = TYPES.GLOW_FILTER;
export const ScrollContainer = TYPES.SCROLL_CONTAINER;
export const UI_Container = TYPES.UI.CONTAINER;
export const UI_Stage = TYPES.UI.STAGE;
export const UI_Text = TYPES.UI.TEXT;
export const UI_ScrollingContainer = TYPES.UI.SCROLLING_CONTAINER;
export const UI_SliceSprite = TYPES.UI.SLICE_SPRITE;
export const UI_SortableList = TYPES.UI.SORTABLE_LIST;
export const UI_Sprite = TYPES.UI.SPRITE;
export const UI_ScrollBar = TYPES.UI.SCROLL_BAR;
export const UI_Button = TYPES.UI.BUTTON;

const PixiX = {
  render,
  fiberRender,
  stopFiberRender,
  Loader,
  changeScene: PixiUtils.changeScene,
  Game,
  Scene,
  Component,
  createElement: Builder.createElement,
  createElements: Builder.createElements,
};
export default PixiX;
