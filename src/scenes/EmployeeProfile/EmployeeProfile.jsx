import React, { useState } from 'react';
import { Card, DatePicker } from 'antd';
import { Button, Form, Col } from 'react-bootstrap';

import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { GET_ADMINLEAVEDASHBOARDS, GET_LEAVETYPE, GET_MYLEAVEDASHBOARDS, POST_LEAVEREQUEST } from '../../constants/urls';
import { } from './EmployeeProfile.css';

import { Calendar, CalendarControls } from 'react-yearly-calendar';
import moment from 'moment';
import safeEval from 'notevil';

export default class EmployeeProfile extends React.Component {
  _isMounted = false;
  constructor() {
    const today = moment();
    super();
    this.state = {

      leaveTypeId: '',
      details: '',
      fromDate: '',
      toDate: '',

      customCSSclasses: {
        leaveRejected: [],
        leaveRequested: [],
        weekend: 'Sat,Sun',
        leaveApproved: []
      },
      leaveCount: {},

      year: today.year(),
      selectedDay: today,
      selectedRange: [today, moment(today).add(15, 'day')],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: false,
      firstDayOfWeek: 0,

      date: ''
    };

  }
  async componentDidMount() {
    this.getMyLeaveDashboards();
    var nameDisplay = document.getElementById('userName');
    var IDdisplay = document.getElementById('userID');

    nameDisplay.innerHTML += "<h5>" + localStorage.getItem('userName') + "</h5>"
    IDdisplay.innerHTML += "<span>Employee ID:" + localStorage.getItem('userID') + "</span>"
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  }

  async getMyLeaveDashboards() {
    let my_leavedashboard = await GetAPICall(GET_MYLEAVEDASHBOARDS + '?year=' + this.state.year);
    console.log("GET_MYLEAVEDASHBOARDS", my_leavedashboard.result.leaveTypeDetails);
    let leaveTypeDetails = my_leavedashboard.result.leaveTypeDetails;

    let leaveRequested = [];
    let leaveRejected = [];
    let leaveApproved = [];
    if (document.getElementById('dashboard') != null) {
      document.getElementById('dashboard').innerHTML = "";
    }

    leaveTypeDetails.forEach(leaveTypes => {

      let lxc = leaveTypes.rejectedCount, lac = leaveTypes.approvedCount, ltc = leaveTypes.takenCount, lqc = leaveTypes.requestedCount;
      console.log(lxc, lac, ltc, lqc)

      if ((lxc + lac + ltc + lqc) != 0) {
        document.getElementById('dashboard').innerHTML += "<div class='col-sm-3'><br/><h6>"
          + leaveTypes.leaveType + "</h6> <div id='fruit-meter' style='display: grid; grid-template-columns: "
          + lxc + "fr " + lac + "fr " + lac + "fr " + ltc + "fr " + lqc
          + "fr;'><div id='red'>"
          + lxc + "</div> <div id='blue'>"
          + lac + "</div ><div id='green'>"
          + lac + "</div><div id='yellow'>"
          + ltc + "</div><div id='orange'>"
          + lqc + "</div></div></div>"
      }


      leaveTypes.requested.forEach(requestDate => {
        let formatted_date = requestDate.slice(0, 10);
        leaveRequested.push(formatted_date);
      });
      leaveTypes.rejected.forEach(rejectDate => {
        let formatted_date = rejectDate.slice(0, 10);
        leaveRejected.push(formatted_date);
      });
      leaveTypes.approved.forEach(approvedDate => {
        let formatted_date = approvedDate.slice(0, 10);
        leaveApproved.push(formatted_date);
      });
    });


    this.setState({
      customCSSclasses: {
        leaveRejected: leaveRejected,
        leaveRequested: leaveRequested,
        weekend: 'Sat,Sun',
        leaveApproved: leaveApproved
      },
    });
    this.updateClasses();
  }

  async onPrevYear() {
    this.setState(prevState => ({
      year: prevState.year - 1,
    }), () => this.getMyLeaveDashboards());
  }

  async onNextYear() {
    this.setState(prevState => ({
      year: prevState.year + 1,
    }), () => this.getMyLeaveDashboards());
  }

  async goToToday() {
    const today = moment();

    this.setState({
      selectedDay: today,
      selectedRange: [today, moment(today).add(15, 'day')],
      year: today.year()
    });
  }

  async datePicked(date) {
    let datesArray = [];
    datesArray = datesArray.concat(this.state.customCSSclasses.leaveApproved,
      this.state.customCSSclasses.leaveRequested,
      this.state.customCSSclasses.leaveRejected);
    let formattedMoment = date.format().slice(0, 10);
    if (datesArray.includes(formattedMoment)) {
      this.props.history.push({ pathname: '/leave_details', state: { date: formattedMoment } });
    }

    this.setState({
      selectedDay: date,
      selectedRange: [date, moment(date).add(15, 'day')]
    });
  }

  async rangePicked(start, end) {
    this.setState({
      selectedRange: [start, end],
      selectedDay: start
    });
  }

  async toggleShowDaysOfWeek() {
    this.setState(prevState => ({
      showDaysOfWeek: !prevState.showDaysOfWeek
    }));
  }

  async toggleForceFullWeeks() {
    this.setState(prevState => ({
      showDaysOfWeek: true,
      forceFullWeeks: !prevState.forceFullWeeks
    }));
  }

  async toggleShowTodayBtn() {
    this.setState(prevState => ({
      showTodayBtn: !prevState.showTodayBtn
    }));
  }

  async toggleShowWeekSeparators() {
    this.setState(prevState => ({
      showWeekSeparators: !prevState.showWeekSeparators
    }));
  }

  async toggleSelectRange() {
    this.setState(prevState => ({
      selectRange: !prevState.selectRange
    }));
  }

  async selectFirstDayOfWeek(event) {
    this.setState({
      firstDayOfWeek: parseInt(event.target.value, 10)
    });
  }

  async updateClasses() {
    const { customCSSclasses } = this.state;
    // const input = 'customCSSclasses = {' + this.state.customCSSclasses + '}'
    const context = { customCSSclasses, moment };

    try {
      // safeEval(input, context);

      const nextCustomCSSclasses = context.customCSSclasses;
      this.setState({
        customCSSclasses: nextCustomCSSclasses,
        customClassesError: false
      });
    } catch (e) {
      this.setState({
        customClassesError: true
      });
      throw e;
    }
  }

  render() {
    const {
      year,
      showTodayBtn,
      selectedDay,
      showDaysOfWeek,
      forceFullWeeks,
      showWeekSeparators,
      firstDayOfWeek,
      selectRange,
      selectedRange,
      customCSSclasses
    } = this.state;
    return (
      <Card>
        <div className="page-heading">
          <h3>My Profile</h3>
        </div>
        <hr />
        <div className="container">
          <div className="row pl-3">
            <div className="col-2">
              <div className="user"></div>
            </div>
            <div className="col pt-4">
              <div className="row" id="userName"></div>
              <div className="row" id="userID"></div>
            </div>
          </div>
        </div>
        <br />


        <div className="container">
          <div className="row" id="dashboard">
          </div>

          <hr />
          <div className="row ml-3 mt-3" >
            <div className="col">
              <div className="row justify-content-center">
                <span className="dot" style={{ backgroundColor: "#3b8bf3" }}></span>
              </div>
              <div className="row justify-content-center">
                <span className="mt-1">Left</span>
              </div>
            </div>
            <div className="col">
              <div className="row justify-content-center">
                <span className="dot" style={{ backgroundColor: "#48bb78" }}></span>
              </div>
              <div className="row justify-content-center">
                <span className="mt-1">Approved</span>
              </div>
            </div>
            <div className="col">
              <div className="row justify-content-center">
                <span className="dot" style={{ backgroundColor: "#ecc94b" }}></span>
              </div>
              <div className="row justify-content-center">
                <span className="mt-1">Taken</span>
              </div>
            </div>
            <div className="col">
              <div className="row justify-content-center">
                <span className="dot" style={{ backgroundColor: "#ed8936" }}></span>
              </div>
              <div className="row justify-content-center">
                <span className="mt-1">Requested</span>
              </div>
            </div>
            <div className="col">
              <div className="row justify-content-center">
                <span className="dot" style={{ backgroundColor: "#e95a5a" }}></span>
              </div>
              <div className="row justify-content-center">
                <span className="mt-1">Rejected</span>
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="container">
          <div id="calendar">
            <CalendarControls
              year={year}
              onPrevYear={() => this.onPrevYear()}
              onNextYear={() => this.onNextYear()}
            />
            <Calendar
              year={year}
              selectedDay={selectedDay}
              showDaysOfWeek={showDaysOfWeek}
              forceFullWeeks={forceFullWeeks}
              showWeekSeparators={showWeekSeparators}
              firstDayOfWeek={firstDayOfWeek}
              selectRange={selectRange}
              selectedRange={selectedRange}
              onPickDate={date => this.datePicked(date)}
              onPickRange={(start, end) => this.rangePicked(start, end)}
              customClasses={customCSSclasses}
            />
          </div>
        </div>
      </Card>
    );
  }
}