import React from "react";
import Subcomponent from "../subcomponent/subcomponent";

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div class="{{ 'c-component' | addmods: }}">
        <h1 class="c-component__name">{this.props.name}</h1>
        <Subcomponent text="I am a subcomponent" />
      </div>
    );
  }
}

export default Component;
