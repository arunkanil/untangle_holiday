import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Card, Spin } from 'antd';
import { ActionRenderer } from '../../components/Utils/StatusRenderer';
import { DateRenderer } from '../../components/Utils/DateRenderer';
import { IdRenderer } from '../../components/Utils/IdRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import {
  DELETE_COUNTRY,
  GET_COUNTRY,
  POST_COUNTRY,
  GET_LEAVEREQUESTFORADMIN,
  GET_LEAVEREQUESTFORME,
  POST_EXPORTLEAVES,
  POST_FILETEMPDOWNLOAD,
} from '../../constants/urls';
import { downloadTempFile } from '../../constants/constants';
import { LeaveReportColumnDefs } from '../../constants/columnMetadata';
import AgGridWrapper from '../../components/AGGrid/AgGridWrapper';
import { isGranted } from '../../lib/abpUtility';

const frameworkComponents = {
  statusRenderer: ActionRenderer,
  dateRenderer: DateRenderer,
  idRenderer: IdRenderer,
};

export default class LeaveReport extends React.Component {
  constructor() {
    super();
    this.state = {
      status: '',
      fromDate: '',
      toDate: '',
      rowData: [],
      loading: true,
      loading1: false,
      context: { componentParent: this },
      deleteID: '',
      objEditable: {},
    };
    this.formChange = this.formChange.bind(this);
    this.downloadTempFile = downloadTempFile.bind(this);
  }
  async componentDidMount() {
    this.getLeaveRequests();
    console.log(isGranted('Pages.Employee'));
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value }, function () {
      console.log(this.state);
    });
  }
  getLeaveRequests = async () => {
    this.setState({ loading: true });
    let result;
    if (isGranted('Pages.Admin') === true) {
      result = await GetAPICall(`${GET_LEAVEREQUESTFORADMIN}MaxResultCount=20000`);
    } else {
      result = await GetAPICall(`${GET_LEAVEREQUESTFORME}?MaxResultCount=20000`);
    }
    console.log(result, 'getLeaveRequests');
    this.setState({ loading: false, rowData: result.result.items });
  };
  getExportLeaves = async () => {
    this.setState({ loading1: true });
    let formdata = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      status: this.state.status,
    };
    let result = await PostAPICall(POST_EXPORTLEAVES, formdata);
    this.downloadTempFile(result.result);
    console.log(result, 'getExportLeaves');
    this.setState({ loading1: false });
  };
  onRowClicked = (event) => {
    console.log('Row selected methord (Obj).....!!', event);
    this.props.history.push({
      pathname: '/leave_report_details',
      state: { data: event },
    });
  };
  onPaginationChanged =async (gridApi, AgGridViewConfig) => {
    let skipCount;
    if (gridApi) {
      skipCount = [gridApi.paginationGetCurrentPage() + 1] * AgGridViewConfig.paginationPageSize;
      console.log('#skipcount', skipCount);
    }
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    this.setState({ loading: true });
    if (isGranted('Pages.Admin') === true) {
      result = await GetAPICall(
        `${GET_LEAVEREQUESTFORADMIN}MaxResultCount=20000&Status=${this.state.status}&FromDate=${this.state.fromDate}&ToDate=${this.state.toDate}`
      );
    } else {
      result = await GetAPICall(
        `${GET_LEAVEREQUESTFORME}?MaxResultCount=20000&Status=${this.state.status}&FromDate=${this.state.fromDate}&ToDate=${this.state.toDate}`
      );
    }
    // let result = await GetAPICall(
    //   `${GET_LEAVEREQUESTFORADMIN}MaxResultCount=20000&Status=${this.state.status}&FromDate=${this.state.fromDate}&ToDate=${this.state.toDate}`
    // );
    console.log(result, 'getLeaveRequests');
    this.setState({ loading: false, rowData: result.result.items });
  };
  render() {
    return (
      <Card>
        <div className="page-heading">
          <h3>Leave Report</h3>
          {this.state.loading1 ? (
            <Button disabled={this.state.loading1} variant="success" type="submit">
              <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
              Please wait
            </Button>
          ) : (
            <Button variant="success" onClick={this.getExportLeaves}>
              Export to excel
            </Button>
          )}
        </div>
        <hr></hr>
        <Spin spinning={this.state.loading} tip="Please wait...">
          <div className="row">
            <div className="col">
              <Form inline onSubmit={this.handleSubmit}>
                <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                  Status
                </Form.Label>
                <Form.Control as="select" name="status" className="my-1 mr-sm-2" id="inlineFormCustomSelectPref" onChange={this.formChange}>
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  <option value="1">Requested</option>
                  <option value="2">Approved</option>
                  <option value="3">Rejected</option>
                  <option value="4">Cancelled</option>
                </Form.Control>
                <Form.Label className="my-1 mr-2" htmlFor="fromDate">
                  From date
                </Form.Label>
                <input
                  className="form-control my-1 mr-sm-2"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  id="fromDate"
                  name="fromDate"
                  onChange={this.formChange}
                />
                <Form.Label className="my-1 mr-2" htmlFor="toDate">
                  To date
                </Form.Label>
                <input
                  className="form-control my-1 mr-sm-2"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  id="toDate"
                  name="toDate"
                  onChange={this.formChange}
                />
                <Button type="submit" className="my-1">
                  Search
                </Button>
                <Button variant="secondary" className="my-1 ml-2" onClick={this.getLeaveRequests}>
                  Clear
                </Button>
              </Form>
            </div>
          </div>
          <AgGridWrapper
            pagination={true}
            context={this.state.context}
            columnDefs={LeaveReportColumnDefs}
            rowData={this.state.rowData}
            suppressCellSelection={true}
            onGridReady={this.onGridReady}
            onPaginationChanged={this.onPaginationChanged}
            frameworkComponents={frameworkComponents}
          ></AgGridWrapper>
        </Spin>
      </Card>
    );
  }
}
