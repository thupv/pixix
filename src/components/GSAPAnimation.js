import AnimationComponent from "./AnimationComponent";

const PERMITTED_PROPS = [
  'keys',
  'repeat',
  'playOnCreate',
  'onEndTween',
  'delay',
  'target'
];

export default class GSAPAnimation extends AnimationComponent {
  constructor() {
    super();
    this.anim = null;
    this.timeline = null;
  }

  static create(parent, props = {}) {
    let animComponent = new GSAPAnimation();
    animComponent.setProps(props, PERMITTED_PROPS);
    return animComponent;
  }

  set parent(parent) {
    this._parent = parent;
    this._createTimelineAnimation();
  }

  _createTimelineAnimation() {
    let timeline = new window.TimelineMax({repeat: this.props.repeat || 0, paused: !this.props.playOnCreate});
    let target = this.props.target === 'component' ? this._parent : this._parent._renderer;
    this.props.keys.forEach((key) => {
      timeline = timeline.to(target, key.duration, key.properties);
    });
    if (this.props.onEndTween) {
      timeline.addCallback(this.props.onEndTween, "+=0");
    }
    if (this.props.delay) {
      timeline.delay(this.props.delay);
    }
    this.timeline = timeline;
  }

  play() {
    this.timeline.play();
  }

  restart() {
    this.timeline.restart();
  }

  stop() {
    this.timeline.stop();
  }
}
