import React from 'react';
import { DatePicker, Calendar, Badge, Card, Spin } from 'antd';
import { Button, Form, Col } from 'react-bootstrap';
import user_logo from '../../images/user.svg';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { GET_ADMINLEAVEDASHBOARDS, GET_CURRENTUSER, GET_LEAVETYPE, GET_MYLEAVEDASHBOARDS, POST_LEAVEREQUEST } from '../../constants/urls';
import {} from './MyProfile.css';

import moment from 'moment';

export default class EmployeeProfile extends React.Component {
  _isMounted = false;
  constructor() {
    const today = moment();
    super();
    this.state = {
      leaveTypeId: '',
      leaveTypeDetails: [],
      details: '',
      fromDate: '',
      toDate: '',
      loading: true,
      customCSSclasses: {
        leaveRejected: [],
        leaveRequested: [],
        weekend: 'Sat,Sun',
        leaveApproved: [],
      },
      leaveCount: {},
      publicHolidays: [],
      filteredPublicHolidays: [],
      year: today.year(),
      month: new Date().getMonth(),
      selectedDay: today,
      selectedRange: [today, moment(today).add(15, 'day')],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: false,
      firstDayOfWeek: 0,
      currentUser: {},
    };
  }
  async componentDidMount() {
    this.getMyLeaveDashboards();
    this.GetCurrentUser();
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  }
  async GetCurrentUser() {
    let result = await GetAPICall(GET_CURRENTUSER);
    console.log(result);
    this.setState({ currentUser: result.result });
  }
  async getMyLeaveDashboards() {
    this.setState({ loading: true });
    let my_leavedashboard = await GetAPICall(GET_MYLEAVEDASHBOARDS + '?year=' + this.state.year);
    console.log('GET_MYLEAVEDASHBOARDS', my_leavedashboard.result);
    let leaveTypeDetails = my_leavedashboard.result.leaveTypeDetails;
    let publicHolidays = my_leavedashboard.result.publicHolidays?.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    let leaveRequested = [],
      leaveRejected = [],
      leaveApproved = [];

    leaveTypeDetails.forEach((leaveItems) => {
      let ltc = leaveItems.takenCount,
        lac = leaveItems.totalCount - leaveItems.approvedCount;

      leaveItems.requested.forEach((requestDate) => {
        let formatted_date = requestDate.slice(0, 10);
        leaveRequested.push(formatted_date);
      });
      leaveItems.rejected.forEach((rejectDate) => {
        let formatted_date = rejectDate.slice(0, 10);
        leaveRejected.push(formatted_date);
      });
      leaveItems.approved.forEach((approvedDate) => {
        let formatted_date = approvedDate.slice(0, 10);
        leaveApproved.push(formatted_date);
      });
    });

    this.setState(
      {
        customCSSclasses: {
          leaveRejected: leaveRejected,
          leaveRequested: leaveRequested,
          weekend: 'Sat,Sun',
          leaveApproved: leaveApproved,
        },
        publicHolidays,
        filteredPublicHolidays: publicHolidays.filter((item) => new Date(item.date).getMonth() == this.state.month),
        loading: false,
        leaveTypeDetails: leaveTypeDetails,
      },
      function () {
        console.log(this.state.filteredPublicHolidays);
      }
    );

    this.updateClasses();
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
        customClassesError: false,
      });
    } catch (e) {
      this.setState({
        customClassesError: true,
      });
      throw e;
    }
  }
  onPanelChange = (date, mode) => {
    this.setState({ year: date.year(), month: new Date(date).getMonth() }, function () {
      this.getMyLeaveDashboards();
    });
    console.log(date.year(), 'panel change', mode);
  };
  monthRenderer = () => {
    switch (this.state.month) {
      case 0:
        return 'January';
        break;
      case 1:
        return 'February';
        break;
      case 2:
        return 'March';
        break;
      case 3:
        return 'April';
        break;
      case 4:
        return 'May';
        break;
      case 5:
        return 'June';
        break;
      case 6:
        return 'July';
        break;
      case 7:
        return 'August';
        break;
      case 8:
        return 'September';
        break;
      case 9:
        return 'October';
        break;
      case 10:
        return 'November';
        break;
      case 11:
        return 'December';
        break;
    }
  };
  onFullRender = (date) => {
    let style;
    const day = date.date();
    let value = date.format().split('T')[0];
    // console.log('publicholiday', this.state.publicHolidays)
    let holidates = [];
    this.state.publicHolidays.forEach((element) => {
      let evalue = element.date.split('T')[0];
      holidates.push(evalue);
    });
    // console.log(holidates)

    if (this.state.customCSSclasses.leaveRequested.includes(value)) {
      style = { backgroundColor: '#ED8936', color: 'white', textAlign: 'center' };
    } else if (this.state.customCSSclasses.leaveApproved.includes(value)) {
      style = { backgroundColor: '#48BB78', color: 'white', textAlign: 'center' };
    } else if (this.state.customCSSclasses.leaveRejected.includes(value)) {
      style = { backgroundColor: '#808588', color: 'white', textAlign: 'center' };
    } else if (holidates.includes(value)) {
      style = { backgroundColor: '#E95A5A', color: 'white', textAlign: 'center' };
    } else {
      style = { textAlign: 'center' };
    }

    return <div style={style}>{day}</div>;
  };

  onDateSelect = (value) => {
    console.log(value.format().slice(0, 10));
    let datesArray = [];
    datesArray = datesArray.concat(
      this.state.customCSSclasses.leaveApproved,
      this.state.customCSSclasses.leaveRequested,
      this.state.customCSSclasses.leaveRejected
    );
    let formattedMoment = value.format().slice(0, 10);

    if (datesArray.includes(formattedMoment)) {
      this.props.history.push({ pathname: '/leave_details', state: { date: formattedMoment } });
    }
  };

  RequestRedirect = async () => {
    this.props.history.push('/create_leave_request');
  };

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
      customCSSclasses,
    } = this.state;
    return (
      <Card>
        <div className="row">
          <div className="col">
            <div className="page-heading">
              <h3>My Profile</h3>
            </div>
          </div>
          <div className="col" style={{ textAlign: 'right' }}>
            <button type="button" className="btn btn-primary" onClick={this.RequestRedirect}>
              Request Leave
            </button>
          </div>
        </div>
        <hr />
        <Spin spinning={this.state.loading} tip="Please wait...">
          <div className="row">
            <div className="col-sm border-right">
              <div className="row">
                <img src={user_logo} width="55px" height="55px" />
                <div className="col">
                  <div>
                    <h5 style={{ textAlign: 'left' }}>{localStorage.getItem('name')}</h5>
                  </div>
                  <div>{localStorage.getItem('userName')}</div>
                  <div>Employee ID: {this.state.currentUser?.employeeId}</div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col border-right">
                  <br />
                  <h6>Available Leave Types</h6>
                  {this.state.leaveTypeDetails.map((leaveItem, index) => (
                    <span>
                      <span>{leaveItem.leaveType}</span>
                      <div className="row">
                        <div className="col" style={{ color: '#48bb78', fontWeight: '1000' }}>
                          {leaveItem.approvedCount} taken |{' '}
                          <span style={{ color: '#565555', fontWeight: '600' }}>
                            <span style={{ fontFamily: 'system-ui' }}>{leaveItem.totalCount - leaveItem.approvedCount}</span> Remaining
                          </span>
                        </div>
                      </div>
                      <br />
                    </span>
                  ))}
                </div>
                <div className="col">
                  <br />
                  <h6 style={{ color: '#e95a5a' }}>Public Holidays - {this.monthRenderer()}</h6>
                  {this.state.filteredPublicHolidays.map((eventItem, index) => (
                    <span>
                      <br />
                      <div className="row">
                        <div className="col" style={{ fontWeight: '1000', color: '#e95a5a' }}>
                          {eventItem.holiday} :{' '}
                          <span style={{ color: '#e95a5a', fontWeight: '1000' }}>{moment(eventItem.date).format('DD-MMM-YYYY')}</span>
                        </div>
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-sm">
              <div className="row">
                <div id="calendar">
                  <Calendar
                    className="card-calendar"
                    dateFullCellRender={this.onFullRender}
                    onPanelChange={this.onPanelChange}
                    onSelect={this.onDateSelect}
                    fullscreen={false}
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="row mt-3">
                    <span className="dot" style={{ backgroundColor: '#ed8936' }}></span>
                    <span className="mt-1 pl-3">Requested</span>
                  </div>
                  <div className="row mt-3">
                    <span className="dot" style={{ backgroundColor: '#48bb78' }}></span>
                    <span className="mt-1 pl-3">Approved</span>
                  </div>
                  {/* </div>
                <div className="col"> */}
                  <div className="row mt-3">
                    <span className="dot" style={{ backgroundColor: '#808588' }}></span>
                    <span className="mt-1 pl-3">Rejected</span>
                  </div>
                  <div className="row mt-3">
                    <span className="dot" style={{ backgroundColor: '#e95a5a' }}></span>
                    <span className="mt-1 pl-3">Public Holidays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Card>
    );
  }
}
