import React, { useState } from 'react';
import { Button, Col, Tab, Tabs } from 'react-bootstrap';
import { Card, Icon, Spin } from 'antd';
import Cookies from 'js-cookie';
import { GetAPICall } from '../../services/dataservice';
import { GET_FILEDOWNLOAD, GET_LEAVEHISTORY } from '../../constants/urls';
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
  // {
  //   name: 'Employee ID',
  //   property: 'employeeId',
  // },
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

export default class LeaveLog extends React.Component {
  constructor() {
    super();
    this.state = {
      details: {},
      loading: true,
      rowData: [],
    };
    this.fileView = this.fileView.bind(this);
    this.printDate = printDate.bind(this);
  }
  async componentDidMount() {
    console.log(this.props.location.state.data);
    let result = await GetAPICall(
      `${GET_LEAVEHISTORY}LeaveRequestId=${this.props.location.state.data.id}&Sorting=CreationTime asc&MaxResultCount=1000`
    );
    let rowdata = result.result.items;
    rowdata = rowdata.sort(function (a, b) {
      return new Date(a.creationTime) - new Date(b.creationTime);
    });
    console.log(result, 'getLeavelogs', rowdata);

    this.setState({ loading: false, rowData: rowdata, details: this.props.location.state.data });
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

  fileView() {
    let response = GetAPICall(`${GET_FILEDOWNLOAD}?guid=${this.state.details.binaryObjectId}`);
  }
  render() {
    return (
      <Card>
        <div>
          <h3 style={{ textAlign: 'left' }}>
            <Icon
              type="arrow-left"
              style={{ marginRight: '20px', verticalAlign: 'middle' }}
              onClick={() => {
                window.history.go(-2);
                return false;
              }}
            />
            Leave Log
          </h3>
        </div>
        <hr />
        <div className="row">
          <div className="col">
            <Spin spinning={this.state.loading} tip="Please wait...">
              <Tabs defaultActiveKey={0} id="noanim-tab-example">
                {this.state.rowData.map((item, index) => (
                  <Tab eventKey={index} title={index === 0 ? 'original' : `update-${index}`}>
                    <table className="table table-striped">
                      <tbody>
                        {mapper.map((innerItem) => (
                          <tr>
                            <td>{innerItem.name}</td>
                            <td>
                              {['creationTime', 'fromDate', 'toDate', 'actionDate'].includes(innerItem.property)
                                ? this.dateRenderer(item[innerItem.property], innerItem.property)
                                : innerItem.property === 'isHalfDay'
                                ? this.dayRenderer(item)
                                : item[innerItem.property]
                                ? item[innerItem.property]
                                : 'no data'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {item.binaryObjectId ? (
                        <tr>
                          <td className="labels">Attached Files:</td>
                          <td>
                            <a
                              href={`${baseURL}${GET_FILEDOWNLOAD}?guid=${item.binaryObjectId}&enc_auth_token=${Cookies.get('enc_auth_token')}`}
                              target="_blank"
                            >
                              view files
                            </a>
                          </td>
                        </tr>
                      ) : null}
                    </table>
                  </Tab>
                ))}
              </Tabs>
            </Spin>
          </div>
        </div>
      </Card>
    );
  }
}
