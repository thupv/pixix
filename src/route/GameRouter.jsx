import React from "react";
import {Container} from "../index";

export default class GameRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScene: null
    };
  }

  render() {
    return (<Container></Container>);
  }
}
