import React from "react";
import Subcomponent from "Components/linking/subcomponent/subcomponent";

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="c-component">
        <h1 className="c-component__name">{this.props.name}</h1>
        <Subcomponent text="I am a subcomponent" />
      </div>
    );
  }
}

export default Component;
