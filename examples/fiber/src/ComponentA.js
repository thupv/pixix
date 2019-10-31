import React from 'react';
import {Container, Text} from "pixix";

class ComponentA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'test'
    }
  }

  componentDidMount() {
    this.setState({test: 'testUpdatedInComponentA'})
  }

  render() {
    return (
      <Container x={100} y={100}>
        <Text value={this.state.test} tint={'0xcccccc'}/>
      </Container>
    );
  }
}

export default ComponentA;
