import React from 'react';
import {Container, Text} from "pixix";
import ComponentA from "./ComponentA";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'test'
    }
  }

  componentDidMount() {
    this.setState({test: 'testUpdated'})
  }

  render() {
    return (
      <Container x={100} y={100}>
        <Text value={this.state.test} tint={'0xcccccc'}/>
        <ComponentA/>
      </Container>
    );
  }
}

export default App;
