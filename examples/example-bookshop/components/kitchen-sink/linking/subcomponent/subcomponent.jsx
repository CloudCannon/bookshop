import React from "react";
class Subcomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="c-subcomponent">
        <div className="c-subcomponent__text">{this.props.text}</div>
      </div>
    );
  }
}

export default Subcomponent;
