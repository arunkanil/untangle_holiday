import React, { Component } from 'react';
const DATE_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export class AgeingRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 'requested_on' };
  }
  ageCalculator = () => {
    let date1 = new Date(this.props.value);
    
    let date2 = new Date(); 
    let Difference_In_Time = date2.getTime() - date1.getTime(); 
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days,"days to",date2,date1 );
    return Difference_In_Days;
  };
  render() {
    return <>{Math.floor(this.ageCalculator())} days</>;
  }
}
