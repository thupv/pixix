import PixiComponent from "./PixiComponent";
import "pixi-particles";

const PERMITTED_PROPS = [
  'images',
  'config'
];

export default class PixiParticleEmitter {
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

  createParticle() {
    let emitter = new PIXI.particles.Emitter(
      this.__parent,
      this.props.images.map((url) => PIXI.Texture.fromImage(url)),
      this.props.config
    );
    let elapsed = Date.now();

    let update = function () {
      requestAnimationFrame(update);
      let now = Date.now();
      emitter.update((now - elapsed) * 0.001);
      elapsed = now;
    };
    emitter.emit = true;
    this.emitter = emitter;
    update();
  }

  static create(parent, props = {}) {
    let particle = new PixiParticleEmitter();
    particle.setProps(props, PERMITTED_PROPS);
    return particle;
  }

  set parent(container) {
    this.__parent = container;
    this.createParticle();
  }

  destroy() {
    this.emitter.destroy();
  }
}
