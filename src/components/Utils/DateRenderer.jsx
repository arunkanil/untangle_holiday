import React, { Component } from "react";
const DATE_OPTIONS = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  
export class DateRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "requested_on" };
  }

  render() {
    return <>{this.props.value ? new Date(this.props.value).toLocaleDateString("en-US", DATE_OPTIONS) : null}</>;
  }
}
