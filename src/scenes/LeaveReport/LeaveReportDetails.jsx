import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { Card, Icon } from 'antd';
import Cookies from 'js-cookie';
import { GetAPICall } from '../../services/dataservice';
import { GET_FILEDOWNLOAD } from '../../constants/urls';
import AppConsts from '../../lib/appconst';
import { printDate } from '../../constants/constants';
const DATE_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'long',
};
const DATE_OPTIONS_1 = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
const baseURL = AppConsts.remoteServiceBaseUrl;

let mapper = [
  {
    name: 'Employee ID',
    property: 'employeeId',
  },
  {
    name: 'Employee',
    property: 'employeeName',
  },
  {
    name: 'Requested on',
    property: 'creationTime',
  },
  {
    name: 'Leave type',
    property: 'leaveType',
  },
  {
    name: 'From',
    property: 'fromDate',
  },
  {
    name: 'To',
    property: 'toDate',
  },
  {
    name: 'Half or full day',
    property: 'isHalfDay',
  },
  {
    name: 'Details',
    property: 'details',
  },
  {
    name: 'Status',
    property: 'statusText',
  },
  {
    name: 'Action date',
    property: 'actionDate',
  },
  {
    name: 'Last Actioned by',
    property: 'actionedByUser',
  },
  {
    name: 'Remarks',
    property: 'actionRemarks',
  },
];

export default class LeaveReportDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      details: {},
    };
    this.fileView = this.fileView.bind(this);
    this.printDate = printDate.bind(this);
  }
  componentDidMount() {
    console.log(this.props.location.state.data);
    this.setState({ details: this.props.location.state.data });
  }
  dayRenderer = (value) => {
    console.log('dayRenderer');
    if (value.isHalfDay === true) {
      return `Half day - ${value.halfDayTime == 1 ? 'First Half' : 'Second Half'}`;
    } else {
      return 'Full Day';
    }
  };
  dateRenderer = (value, property) => {
    console.log(value, property);
    if (value) {
      if (property == 'fromDate' || property == 'toDate') {
        return this.printDate(value).toLocaleDateString('en-US', DATE_OPTIONS_1);
      } else {
        return this.printDate(value).toLocaleDateString('en-US', DATE_OPTIONS);
      }
    } else {
      return 'no data';
    }
  };
  visitLog = () => {
    console.log('Row selected methord (Obj).....!!', this.state.details);
    this.props.history.push({
      pathname: '/leave_log',
      state: { data: this.state.details },
    });
  };
  fileView() {
    let response = GetAPICall(`${GET_FILEDOWNLOAD}?guid=${this.state.details.binaryObjectId}`);
  }
  render() {
    return (
      <Card>
        <div className="page-heading">
          <h3>
            <Icon
              type="arrow-left"
              style={{ marginRight: '20px' }}
              onClick={() => {
                window.history.go(-1);
                return false;
              }}
            />
            Leave Details
          </h3>
          <button className="btn btn-link" onClick={this.visitLog}>
            View logs
          </button>
        </div>
        <hr />
        <div className="row">
          <table className="table table-striped">
            <tbody>
              {mapper.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>
                    {['creationTime', 'fromDate', 'toDate', 'actionDate'].includes(item.property)
                      ? this.dateRenderer(this.state.details[item.property], item.property)
                      : item.property === 'isHalfDay'
                      ? this.dayRenderer(this.state.details)
                      : this.state.details[item.property]
                      ? this.state.details[item.property]
                      : 'no data'}
                  </td>
                </tr>
              ))}
            </tbody>
            {this.state.details.binaryObjectId ? (
              <tr>
                <td className="labels">Attached Files:</td>
                <td>
                  <a
                    href={`${baseURL}${GET_FILEDOWNLOAD}?guid=${this.state.details.binaryObjectId}&enc_auth_token=${Cookies.get('enc_auth_token')}`}
                    target="_blank"
                  >
                    view files
                  </a>
                </td>
              </tr>
            ) : null}
          </table>
        </div>
      </Card>
    );
  }
}
