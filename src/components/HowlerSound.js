import AssetsManager from "../assetsManager";

//https://github.com/goldfire/howler.js#options

const PERMITTED_PROPS = [
  'autoPlay',
  'enabled',
  'loop',
  'volume'
];
export default class HowlerSound {
  constructor() {
    this._sound = null;
  }

  setProps(props, permitProps) {
    this.props = {};
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        if (permitProps.indexOf(key) > -1) {
          this.props[key] = props[key];
        }
      }
    }
  }

  play() {
    if (!this._sound.playing() && this.props.enabled) {
      this._sound.play();
    }
  }

  stop() {
    this._sound.stop();
  }

  set sound(sound) {
    this._sound = sound;
    if (this.props.loop) {
      this._sound.loop(true);
    }
  }

  set loop(loop) {
    this._sound.loop(loop);
  }

  destroy() {
    this._sound.stop();
  }

  set volume(v) {
    this._sound.volume(v);
  }

  set enabled(isEnabled) {
    this.props.enabled = isEnabled;
    if (isEnabled) {
      if (this.props.autoPlay) {
        this.play();
      }
    } else {
      this.stop();
    }
  }

  static create(parent = null, props = {}) {
    let howlerSound = new HowlerSound();
    howlerSound.setProps(props, PERMITTED_PROPS);
    howlerSound.sound = AssetsManager.resolveAsset(props.src);
    if (props.autoPlay && props.enabled) {
      console.log('play');
      howlerSound.play();
    }
    if (props.volume) {
      howlerSound.volume = parseFloat(props.volume);
    }
    return howlerSound;
  }
}
