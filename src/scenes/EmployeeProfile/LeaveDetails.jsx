import React, { useState } from 'react';
import { DatePicker, Icon, Spin } from 'antd';
import { Button, Form, Col } from 'react-bootstrap';
import { Card, message } from 'antd';
import Cookies from 'js-cookie';

import { GetAPICall, PostAPICall } from '../../services/dataservice';
import { GET_LEAVEDETAILS, GET_FILEDOWNLOAD, POST_CANCEL_LEAVE } from '../../constants/urls';
import {} from './EmployeeProfile.css';
import AppConsts from '../../lib/appconst';
import ModalWrapper from '../../components/Modal/ModalWrapper';
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
export default class LeaveDetails extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      loading: true,
      leaveDetails: {},
      leavePeriod: {
        fromDate: '',
        toDate: '',
      },

      showCancelModal: false,
      canceldetails: '',
    };
    this.printDate = printDate.bind(this);
  }
  async componentDidMount() {
    console.log(this.props.location);
    this.getdateInfo();
  }

  async getdateInfo() {
    let my_leavedetails = await GetAPICall(`${GET_LEAVEDETAILS}?Date=${this.props.location.state.date}`);
    console.log('GET_LEAVEDETAILS', my_leavedetails.result);
    let fromDate = my_leavedetails.result.leaveRequest.fromDate.slice(0, 10);
    let toDate = my_leavedetails.result.leaveRequest.toDate.slice(0, 10);
    this.setState({
      leaveDetails: my_leavedetails.result.leaveRequest,
      leavePeriod: {
        fromDate: fromDate,
        toDate: toDate,
      },
      loading: false,
    });
    
  }
  
  visitLog = () => {
    console.log('Row selected methord (Obj).....!!', this.state.leaveDetails);
    this.props.history.push({
      pathname: '/leave_log',
      state: { data: this.state.leaveDetails },
    });
  };
  amendRedirect = async () => {
    console.log(this.state.leaveDetails);
    let amendData = {
      leaveRequestId: this.state.leaveDetails.id,
      employeeName: this.state.leaveDetails.employeeName,
      leaveTypeId: this.state.leaveDetails.leaveTypeId,
      fromDate: this.state.leavePeriod.fromDate,
      toDate: this.state.leavePeriod.toDate,
      details: this.state.leaveDetails.details,
      statusID: this.state.leaveDetails.status,
      actionRemarks: this.state.leaveDetails.actionRemarks,
    };
    this.props.history.push({ pathname: '/amend_and_reapply', state: { data: amendData } });
  };

  fileView = async () => {
    await GetAPICall(`${GET_FILEDOWNLOAD}?guid=${this.state.leaveDetails.binaryObjectId}`);
    // console.log('fileView', response);
  };

  async CancelLeave() {
    this.setState({ loading: true });
    let cancelData = {
      id: this.state.leaveDetails.id,
      details: this.state.canceldetails,
    };
    let result = await PostAPICall(POST_CANCEL_LEAVE, cancelData);
    if (result.success == true) {
      console.log(result, 'Request Cancelled');
      this.setState({ loading: false });
      message.success('Request Cancelled Successfully');
      this.props.history.push('/my_profile');
    }
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="Please wait...">
        <ModalWrapper
          show={this.state.showCancelModal}
          onHide={() => this.setState({ showCancelModal: false })}
          ModalTitle="Cancel Request?"
          size="sm"
        >
          <label>Reason for Cancellation</label>
          <input
            type="email"
            className="form-control"
            id="details"
            aria-describedby="emailHelp"
            onChange={(e) => this.setState({ canceldetails: e.target.value })}
          />
          <div className="justify-content-between mt-3">
            <Button variant="secondary" onClick={() => this.setState({ showCancelModal: false })}>
              No
            </Button>
            <Button variant="primary" className="float-right" onClick={() => this.CancelLeave()}>
              Yes
            </Button>
          </div>
        </ModalWrapper>
        <Card>
          <div></div>

          <div className="row">
            <div className="col-6">
              <Icon
                type="arrow-left"
                style={{ marginRight: '20px', fontSize: 'x-large' }}
                onClick={() => {
                  window.history.go(-1);
                  return false;
                }}
              />
              <span style={{ textAlign: 'left', fontSize: 'x-large', verticalAlign: 'middle' }}>Leave Details</span>
            </div>
            <div className="col" style={{ textAlign: 'right' }}>
              {this.state.leaveDetails.status == 1 || this.state.leaveDetails.status == 2 ? (
                <>
                  <button type="button" className="btn btn-link" onClick={() => this.setState({ showCancelModal: true })}>
                    Cancel Request
                  </button>
                  <button className="btn btn-link" onClick={this.visitLog}>
                    View logs
                  </button>
                </>
              ) : (
                <button className="btn btn-link" onClick={this.visitLog}>
                  View logs
                </button>
              )}
            </div>
          </div>
          <hr />
          <div className="row">
            <table className="table table-striped">
              <tbody>
                <tr>
                  <td className="labels">Employee Name:</td>
                  <td>{this.state.leaveDetails.employeeName}</td>
                </tr>
                <tr>
                  <td className="labels">Requested on:</td>
                  <td>{this.printDate(this.state.leaveDetails.creationTime).toLocaleDateString('en-US', DATE_OPTIONS)}</td>
                </tr>
                <tr>
                  <td className="labels">Leave Type:</td>
                  <td>{this.state.leaveDetails.leaveType}</td>
                </tr>
                <tr>
                  <td className="labels">Leave Period:</td>
                  <td>
                    {new Date(this.state.leavePeriod.fromDate).toLocaleDateString('en-US', DATE_OPTIONS_1)} to{' '}
                    {new Date(this.state.leavePeriod.toDate).toLocaleDateString('en-US', DATE_OPTIONS_1)}
                  </td>
                </tr>
                <tr>
                  <td className="labels">Half or Full day:</td>
                  <td>
                    {this.state.leaveDetails.isHalfDay
                      ? `Half day - ${this.state.leaveDetails.halfDayTime == 1 ? 'First Half' : 'Second Half'}`
                      : 'Full day'}
                  </td>
                </tr>
                <tr>
                  <td className="labels">Leave Details:</td>
                  <td>{this.state.leaveDetails.details}</td>
                </tr>
                <tr>
                  <td className="labels">Status:</td>
                  <td>{this.state.leaveDetails.statusText}</td>
                </tr>
                {this.state.leaveDetails.binaryObjectId ? (
                  <tr>
                    <td className="labels">Attached Files:</td>
                    <td>
                      {/* <button type="button" className="btn btn-link" onClick={() => this.fileView()}>
                        View Files
                      </button> */}
                      <a
                        href={`${baseURL}${GET_FILEDOWNLOAD}?guid=${this.state.leaveDetails.binaryObjectId}&enc_auth_token=${Cookies.get(
                          'enc_auth_token'
                        )}`}
                        target="_blank"
                      >
                        view files
                      </a>
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td className="labels">Action date:</td>
                  <td>
                    {this.state.leaveDetails.actionDate
                      ? this.printDate(this.state.leaveDetails.actionDate).toLocaleDateString('en-US', DATE_OPTIONS)
                      : 'no data'}
                  </td>
                </tr>
                <tr>
                  <td className="labels">Last Actioned by:</td>
                  <td>{this.state.leaveDetails.actionedByUser ? this.state.leaveDetails.actionedByUser : 'no data'}</td>
                </tr>
                <tr>
                  <td className="labels">Remark:</td>
                  <td>{this.state.leaveDetails.actionRemarks ? this.state.leaveDetails.actionRemarks : 'no data'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {this.state.leaveDetails.status === 3 ? (
            <div className="row mt-3">
              <div className="col" style={{ textAlign: 'left' }}>
                <button type="button" className=" btn btn-primary" onClick={this.amendRedirect}>
                  Amend & Reapply
                </button>
              </div>
            </div>
          ) : null}
        </Card>
      </Spin>
    );
  }
}
