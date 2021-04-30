import React, { Component } from 'react';
import { Days } from '../../constants/constants';

export class WeekendRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekend1: '',
      weekend2: '',
    };
  }

  componentDidMount() {
    let weekend1 = Days.filter((day) => day.value == this.props.node.data.weekend1)[0];
    let weekend2 = Days.filter((day) => day.value == this.props.node.data.weekend2)[0];
    console.log(weekend1, weekend2);
    this.setState({ weekend1, weekend2 });
  }
  render() {
    return (
      <>
        <span className="badge badge-primary">{this.state.weekend1.day}</span>
        <span className="badge badge-primary ml-1">{this.state.weekend2.day}</span>
      </>
    );
  }
}
