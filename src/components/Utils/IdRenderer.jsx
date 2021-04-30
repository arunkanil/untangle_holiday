import React, { Component } from 'react';

export class IdRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 'employeeId' };
  }
  onIdClick = () => {
    this.props.context.componentParent.onRowClicked(this.props.node.data);
  };
  render() {
    return (
      <>
        <a onClick={this.onIdClick}>{this.props.value}</a>
      </>
    );
  }
}
