import PixiComponent from "./PixiComponent";
import {WRITING_WORD_STATUS} from "../../../src/utils/constants";

// Only for result text langamon data
const PERMITTED_PROPS = [
  'alpha',
  'x',
  'y',
  'value',
  'fontFamily',
  'size',
  'align',
  'tint',
  'anchor',
  'strokeThickness',
  'data',
  'onClickWord',
  'breakLineX',
  'lineHeight'
];

export default class PixiAdvancedText extends PixiComponent {
  set data(words) {
    this.props.data = words;
    this.createTextContent();
  }

  createRenderer() {
    this.renderer = new PIXI.Container();
    this.createTextContent();
  }

  createTextContent() {
    if (!this.props.data) return;
    this.renderer.removeChildren();
    let prevX = 0;
    let prevY = 0;
    const redStyle = new PIXI.TextStyle({
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: this.props.size - 4 || 26,
      strokeThickness: this.props.strokeThickness || 0,
      fill: [
        this.props.tint || 'red'
      ],
    });
    const orangeStyle = new PIXI.TextStyle({
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: this.props.size - 4 || 26,
      strokeThickness: this.props.strokeThickness || 0,
      fill: [
        this.props.tint || 'orange'
      ],
    });
    const greenStyle = new PIXI.TextStyle({
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: this.props.size - 4 || 26,
      strokeThickness: this.props.strokeThickness || 0,
      fill: [
        this.props.tint || 'green'
      ],
    });

    const greyStyle = new PIXI.TextStyle({
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: this.props.size - 4 || 26,
      strokeThickness: this.props.strokeThickness || 0,
      fill: [
        this.props.tint || 0x828282
      ],
    });

    const getStyle = (word) => {
      if (word.status === WRITING_WORD_STATUS.INCORRECT) {
        return greyStyle;
      } else {
        if (word.hasOwnProperty('quality_score')) {
          if (word.quality_score < 60) {
            return redStyle;
          } else if (word.quality_score < 80) {
            return orangeStyle;
          } else if (word.quality_score <= 100) {
            return greenStyle;
          }
        }
      }
    };

    const drawStrokeThroughtLine = (text) => {
      let bound = text.getLocalBounds();
      const line = new PIXI.Graphics();
      line.lineStyle(2, 0x828282, 1);
      line.moveTo(0, bound.height * 2 / 3);
      line.lineTo(bound.width, bound.height * 2 / 3);
      return line;
    };

    let lineContainer = new PIXI.Container();
    this.props.data.forEach((word, idx) => {
      let textContainer = new PIXI.Container();
      textContainer.interactive = true;
      textContainer.buttonMode = true;
      let text = new PIXI.Text(word.word + ' ', getStyle(word));
      textContainer.addChild(text);
      if (word.status === WRITING_WORD_STATUS.INCORRECT) {
        const line = drawStrokeThroughtLine(text);
        textContainer.addChild(line);
      }

      lineContainer.addChild(textContainer);
      this.renderer.addChild(lineContainer);
      textContainer.x = prevX;
      textContainer.on('pointerdown', () => {
        if (word.syllables && word.syllables.length > 0) {
          this.props.onClickWord(word, textContainer.x, idx);
        }
      });
      prevX = lineContainer.getLocalBounds().width;
      if (prevX >= this.props.breakLineX) {
        lineContainer.y = -this.props.lineHeight / 2;
        lineContainer = new PIXI.Container();
        lineContainer.y = this.props.lineHeight / 2;
        this.renderer.addChild(lineContainer);
        prevX = 0;
      }
    });
  }

  static create(parent, props = {}) {
    let text = new PixiAdvancedText();
    text.setProps(props, PERMITTED_PROPS);
    text.createRenderer();
    if (props.renderable === false) {
      text.renderable = false;
    }
    text.parent = parent;
    return text;
  }
}
