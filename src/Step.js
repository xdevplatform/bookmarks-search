import React from "react";

export default class Step extends React.Component {
  render() {
    if (this.props.currentStep !== this.props.step) {
      return <></>;
    }

    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{textAlign: 'center', width: 640, minHeight: 400}}>{this.props.children}</div></div>;
  }
}