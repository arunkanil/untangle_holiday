import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { Card, message, Spin } from 'antd';
import { ApproveRenderer } from '../../components/Utils/ApproveRenderer';
import { DateRenderer } from '../../components/Utils/DateRenderer';
import { AgeingRenderer } from '../../components/Utils/AgingCalculator';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import { PostAPICall, GetAPICall } from '../../services/dataservice';
import { GET_FILEDOWNLOAD, GET_LEAVECONFLICTSAPPROVER, GET_LEAVEREQUESTFORME, POST_APPROVEREQUEST, POST_REJECTREQUEST } from '../../constants/urls';
import { LeaveApprovalColumnDefs } from '../../constants/columnMetadata';
import AgGridWrapper from '../../components/AGGrid/AgGridWrapper';
import AppConsts from '../../lib/appconst';

const frameworkComponents = {
  statusRenderer: ApproveRenderer,
  dateRenderer: DateRenderer,
  AgeingRenderer: AgeingRenderer,
};
const baseURL = AppConsts.remoteServiceBaseUrl;

const DATE_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
export default class LeaveApproval extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loading1: false,
      showEditModal: false,
      rowData: [],
      conflicts: [],
      details: '',
      context: { componentParent: this },
      objEditable: {},
    };
    this.formChange = this.formChange.bind(this);
  }
  async componentDidMount() {
    this.getLeaveRequests();
  }
  async getLeaveRequests() {
    let result = await GetAPICall(`${GET_LEAVEREQUESTFORME}?Status=1&MaxResultCount=20000`);
    console.log(result, 'getLeaveRequests');
    this.setState({ loading: false, rowData: result.result.items });
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  }
  getConflits = async (value) => {
    this.setState({ loading1: true });
    let leaveConflicts = await GetAPICall(
      `${GET_LEAVECONFLICTSAPPROVER}FromDate=${value.fromDate}&ToDate=${value.toDate}&EmployeeUserId=${value.userId}`
    );
    this.setState({ conflicts: leaveConflicts.result.conflicts, loading1: false });
  };
  handleEdit(value) {
    this.setState({
      objEditable: value,
      showEditModal: true,
    });
    this.getConflits(value);
    console.log(value);
  }
  visitLog = () => {
    console.log('Row selected methord (Obj).....!!', this.state.leaveDetails);
    this.props.history.push({
      pathname: '/leave_log',
      state: { data: this.state.objEditable },
    });
  };
  approveRequest = async () => {
    this.setState({ loading: true, showEditModal: false });
    let formdata = {
      id: this.state.objEditable.id,
      details: this.state.details,
    };
    let result = await PostAPICall(POST_APPROVEREQUEST, formdata);
    if (result.success === true) {
      this.getLeaveRequests();
      message.success('Request approved');
    }
    console.log(result, 'approveRequest');
  };
  rejectRequest = async () => {
    this.setState({ loading: true, showEditModal: false });
    let formdata = {
      id: this.state.objEditable.id,
      details: this.state.details,
    };
    let result = await PostAPICall(POST_REJECTREQUEST, formdata);
    if (result.success === true) {
      this.getLeaveRequests();
      message.success('Request rejected');
    }
    console.log(result, 'rejectRequest');
  };
  fileView() {
    let response = GetAPICall(`${GET_FILEDOWNLOAD}?guid=${this.state.objEditable.binaryObjectId}`);
  }
  render() {
    return (
      <Card>
        <div className="page-heading">
          <h3>Leave Approval</h3>
        </div>
        <ModalWrapper show={this.state.showEditModal} onHide={() => this.setState({ showEditModal: false })} ModalTitle="Leave Details">
          <div className="row">
            <div className="col">Employee Name</div>
            <div className="col font-weight-bold">{this.state.objEditable.employeeName}</div>
          </div>
          <div className="row">
            <div className="col">Employee ID</div>
            <div className="col font-weight-bold">{this.state.objEditable.employeeId}</div>
          </div>
          <div className="row">
            <div className="col">From</div>
            <div className="col font-weight-bold">{new Date(this.state.objEditable.fromDate).toLocaleDateString('en-US', DATE_OPTIONS)}</div>
          </div>
          <div className="row">
            <div className="col">To</div>
            <div className="col font-weight-bold">{new Date(this.state.objEditable.toDate).toLocaleDateString('en-US', DATE_OPTIONS)}</div>
          </div>
          <div className="row">
            <div className="col">Full or half day leave</div>
            <div className="col font-weight-bold">
              {this.state.objEditable.isHalfDay ? `Half day - ${this.state.objEditable.halfDayTime == 1 ? 'First Half' : 'Second Half'}` : 'Full Day'}
            </div>
          </div>
          <div className="row">
            <div className="col">Leave Type</div>
            <div className="col font-weight-bold">{this.state.objEditable.leaveType}</div>
          </div>
          <div className="row">
            <div className="col">Status</div>
            <div className="col font-weight-bold">{this.state.objEditable.statusText}</div>
          </div>
          <div className="row">
            <div className="col">Requested on</div>
            <div className="col font-weight-bold">{new Date(this.state.objEditable.creationTime).toLocaleDateString('en-US', DATE_OPTIONS)}</div>
          </div>
          <div className="row">
            <div className="col">Details</div>
            <div className="col font-weight-bold">{this.state.objEditable.details}</div>
          </div>
          {this.state.objEditable.binaryObjectId ? (
            <div className="row">
              <div className="col">Attached files</div>
              <div className="col">
                <a
                  href={`${baseURL}${GET_FILEDOWNLOAD}?guid=${this.state.objEditable.binaryObjectId}&enc_auth_token=${Cookies.get('enc_auth_token')}`}
                  target="_blank"
                >
                  view files
                </a>
              </div>
            </div>
          ) : null}
          <div className="row">
            <div className="col">Conflicts</div>
            <div className="col font-weight-bold">
              {this.state.loading1 ? (
                <ProgressBar animated now={100} />
              ) : (
                this.state.conflicts.map((item) => (
                  <div className="text-danger">
                    {new Date(item.date).toLocaleDateString('en-US', DATE_OPTIONS)} with {item.employeeName}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="row mt-3 p-3">
            <textarea onChange={this.formChange} className="form-control" rows="3" name="details" placeholder="Enter comments" />
          </div>
          <div className="row justify-content-between">
            <button className="btn btn-link" onClick={this.visitLog}>
              View logs
            </button>
            <div>
              <button className="btn btn-primary" onClick={this.approveRequest}>
                Approve
              </button>
              <button className="btn btn-danger mx-3" onClick={this.rejectRequest}>
                Reject
              </button>
            </div>
          </div>
        </ModalWrapper>
        <hr></hr>
        <Spin spinning={this.state.loading} tip="Please wait...">
          <AgGridWrapper
            pagination={true}
            context={this.state.context}
            columnDefs={LeaveApprovalColumnDefs}
            rowData={this.state.rowData}
            suppressCellSelection={true}
            onGridReady={this.onGridReady}
            frameworkComponents={frameworkComponents}
          ></AgGridWrapper>
        </Spin>
      </Card>
    );
  }
}
