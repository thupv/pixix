import PixiSprite from "./PixiSprite";
import PixiText from "./PixiText";
import PixiContainer from "./PixiContainer";
import PixiButton from "./PixiButton";
import PixiRectangle from "./PixiRectangle";
import PixiBitmapText from "./PixiBitmapText";
import PixiPolygon from "./PixiPolygon";
import PixiColorMatrixFilter from "./PixiColorMatrixFilter";
import PixiParticleContainer from "./PixiParticleContainer";
import PixiAnimatedSprite from "./PixiAnimatedSprite";
import PixiDisplacementFilter from "./PixiDisplacementFilter";
import PixiTiledMap from "./PixiTiledMap";
import PixiCamera from "./PixiCamera";
import PixiStage from "./PixiStage";
import HowlerSound from "./HowlerSound";
import GSAPAnimation from "./GSAPAnimation";
import PixiParticleEmitter from "./PixiParticleEmitter";
import PixiAdvancedBloomFilter from "./PixiAdvancedBloomFilter";
import PixiGlowFilter from "./PixiGlowFilter";
import PixiScrollContainer from "./PixiScrollContainer";
import PixiMultiStyleText from "./PixiMultiStyleText";
import {UI} from "./ui";
import PixiTextInput from "./PixiTextInput";
import PixiAdvancedText from "./PixiAdvancedText";

export const TYPES = {
  SPRITE: "Sprite",
  TEXT: "Text",
  ADVANCED_TEXT: "Advanced_Text",
  CONTAINER: "Container",
  BUTTON: "Button",
  RECTANGLE: "Rectangle",
  BITMAP_TEXT: "BitmapText",
  POLYGON: "Polygon",
  COLOR_MATRIX_FILTER: "ColorMatrixFilter",
  PARTICLE_CONTAINER: "ParticleContainer",
  ANIMATED_SPRITE: "AnimatedSprite",
  DISPLACEMENT_FILTER: "DisplacementFilter",
  TILED_MAP: "TiledMap",
  CAMERA: "Camera",
  LAYER: "Layer",
  STAGE: "Stage",
  SOUND: "Sound",
  GSAP_ANIMATION: "GSAPAnimation",
  PARTICLE_EMITTER: "ParticleEmitter",
  ADVANCED_BLOOM_FILTER: "AdvancedBloomFilter",
  GLOW_FILTER: "GlowFilter",
  SCROLL_CONTAINER: "ScrollContainer",
  MULTI_STYLE_TEXT: "MultiStyleText",
  TEXT_INPUT: "TextInput",
  UI: {
    CONTAINER: 'UI_Container',
    STAGE: 'UI_Stage',
    TEXT: 'UI_Text',
    SCROLLING_CONTAINER: 'UI_ScrollingContainer',
    SLICE_SPRITE: 'UI_SliceSprite',
    SORTABLE_LIST: 'UI_SortableList',
    SPRITE: 'UI_Sprite',
    SCROLL_BAR: 'UI_ScrollBar',
    BUTTON: 'UI_Button'
  }
};

let mappingComponent = {};

//TODO: change to DI
mappingComponent[TYPES.GSAP_ANIMATION] = GSAPAnimation;
mappingComponent[TYPES.SPRITE] = PixiSprite;
mappingComponent[TYPES.TEXT] = PixiText;
mappingComponent[TYPES.ADVANCED_TEXT] = PixiAdvancedText;
mappingComponent[TYPES.TEXT_INPUT] = PixiTextInput;
mappingComponent[TYPES.MULTI_STYLE_TEXT] = PixiMultiStyleText;
mappingComponent[TYPES.CONTAINER] = PixiContainer;
mappingComponent[TYPES.BUTTON] = PixiButton;
mappingComponent[TYPES.RECTANGLE] = PixiRectangle;
mappingComponent[TYPES.BITMAP_TEXT] = PixiBitmapText;
mappingComponent[TYPES.POLYGON] = PixiPolygon;
mappingComponent[TYPES.COLOR_MATRIX_FILTER] = PixiColorMatrixFilter;
mappingComponent[TYPES.PARTICLE_CONTAINER] = PixiParticleContainer;
mappingComponent[TYPES.ANIMATED_SPRITE] = PixiAnimatedSprite;
mappingComponent[TYPES.DISPLACEMENT_FILTER] = PixiDisplacementFilter;
mappingComponent[TYPES.TILED_MAP] = PixiTiledMap;
mappingComponent[TYPES.CAMERA] = PixiCamera;
mappingComponent[TYPES.STAGE] = PixiStage;
mappingComponent[TYPES.SOUND] = HowlerSound;
mappingComponent[TYPES.PARTICLE_EMITTER] = PixiParticleEmitter;
mappingComponent[TYPES.ADVANCED_BLOOM_FILTER] = PixiAdvancedBloomFilter;
mappingComponent[TYPES.GLOW_FILTER] = PixiGlowFilter;
mappingComponent[TYPES.SCROLL_CONTAINER] = PixiScrollContainer;
mappingComponent[TYPES.UI.CONTAINER] = UI.PixiUIContainer;
mappingComponent[TYPES.UI.STAGE] = UI.PixiUIStage;
mappingComponent[TYPES.UI.TEXT] = UI.PixiUIText;
mappingComponent[TYPES.UI.SCROLLING_CONTAINER] = UI.PixiUIScrollingContainer;
mappingComponent[TYPES.UI.SLICE_SPRITE] = UI.PixiUISliceSprite;
mappingComponent[TYPES.UI.SORTABLE_LIST] = UI.PixiUISortableList;
mappingComponent[TYPES.UI.SPRITE] = UI.PixiUISprite;
mappingComponent[TYPES.UI.SCROLL_BAR] = UI.PixiUIScrollBar;
mappingComponent[TYPES.UI.BUTTON] = UI.PixiUIButton;

function create(tag, parent, props) {
  return mappingComponent[tag].create(parent, props);
}

function isRegistered(tag) {
  return typeof mappingComponent[tag] !== 'undefined';
}

function createContainer(parent, props) {
  return mappingComponent[TYPES.CONTAINER].create(parent, props);
}

function createStage(game) {
  return mappingComponent[TYPES.STAGE].create(game);
}

function createFiberComponent(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  return mappingComponent[type].create(null, props);
}

const Component = {
  create: create,
  isRegistered: isRegistered,
  createContainer: createContainer,
  createStage: createStage,
  createFiberComponent: createFiberComponent
};

export default Component;
