import React from "react";
class Subcomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div class="c-subcomponent">
        <div class="c-subcomponent__text">{this.props.text}</div>
      </div>
    );
  }
}

export default Subcomponent;
