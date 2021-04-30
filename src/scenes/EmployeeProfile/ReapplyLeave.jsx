import React, { useState } from 'react';
import { Card, DatePicker, Icon, message } from 'antd';
import { Button, Form, Col, Spinner } from 'react-bootstrap';

import { PostAPICall, DeleteAPICall, GetAPICall, PutAPICall } from '../../services/dataservice';
import { GET_LEAVECONFLICTS, GET_LEAVETYPE, UPDATE_LEAVE, POST_FILEUPLOAD } from '../../constants/urls';

const DATE_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export default class ReApplyLeave extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      prevRequestId: 0,
      leaveTypeList: [],
      leaveTypeId: null,
      details: '',
      fromDate: '',
      toDate: '',
      selectedFile: null,
      file: {},
      totalWorkingDays: '0',
      totalPublicHoliDays: '0',
      conflicts: [],
    };
    this.formChange = this.formChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    // console.log('passedData:', this.props.location.state.data);
    await this.getLists();
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value }, function () {
      if (this.state.fromDate && this.state.toDate) {
        this.getConflicts();
      }
    });
    console.log(this.state);
  }
  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  onFileUpload = async () => {
    const formData = new FormData();
    formData.append('myFile', this.state.selectedFile, this.state.selectedFile.name);
    console.log(this.state.selectedFile);
    let result = await PostAPICall(POST_FILEUPLOAD, formData);
    console.log(result, 'file upload');
    this.setState({ file: result.result });
  };
  async getLists() {
    let leavetypelist = await GetAPICall(GET_LEAVETYPE);
    console.log(leavetypelist);
    this.setState({
      leaveTypeList: leavetypelist.result.items,
      leaveTypeId: this.props.location.state.data.leaveTypeId,
      details: this.props.location.state.data.details,
      fromDate: this.props.location.state.data.fromDate,
      toDate: this.props.location.state.data.toDate,
      prevRequestId: this.props.location.state.data.leaveRequestId,
    });
  }
  getConflicts = async () => {
    let leaveConflicts = await GetAPICall(`${GET_LEAVECONFLICTS}FromDate=${this.state.fromDate}&ToDate=${this.state.toDate}`);
    console.log(leaveConflicts, 'leaveConflicts');
    this.setState({
      conflicts: leaveConflicts.result.conflicts,
      totalPublicHoliDays: leaveConflicts.result.totalPublicHoliDays,
      totalWorkingDays: leaveConflicts.result.totalWorkingDays,
    });
  };
  async handleSubmit(e) {
    e.preventDefault();
    let formdata = {};
    this.setState({ loading: true });
    if (this.state.leaveTypeId !== '2') {
      formdata = {
        id: this.state.prevRequestId,
        leaveTypeId: this.state.leaveTypeId,
        details: this.state.details,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      };
    } else {
      formdata = {
        id: this.state.prevRequestId,
        leaveTypeId: this.state.leaveTypeId,
        details: this.state.details,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        file: {
          fileName: this.state.file.fileName,
          fileType: this.state.file.fileType,
          fileToken: this.state.file.fileToken,
        },
      };
    }
    let result = await PutAPICall(UPDATE_LEAVE, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Leave Re-applied successfully');
      this.setState({ loading: false });
      this.props.history.push('/my_profile');
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }
  render() {
    return (
      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Icon
            type="arrow-left"
            style={{ marginRight: '20px', fontSize: 'x-large' }}
            onClick={() => {
              window.history.go(-2);
              return false;
            }}
          />
          <span style={{ textAlign: 'left', fontSize: 'x-large', verticalAlign: 'middle' }}>Amend & Re-Apply Leave</span>
          {/* <h3>Amend & Re-Apply Leave</h3> */}
        </div>
        <hr />
        <div className="row">
          <div className="col">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>
                  Leave Type <span className="required">*</span>
                </Form.Label>
                <Form.Control as="select" required name="leaveTypeId" onChange={this.formChange}>
                  {this.state.leaveTypeList.map((item) => (
                    <option value={item.id} selected={item.id == this.state.leaveTypeId ? true : false}>
                      {item.name}
                    </option>
                  ))}
                </Form.Control>
                <small className="form-text text-muted">Documents supporting cause must be attached in case of sick leave</small>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlSelect3">
                <Form.Label>
                  Date <span className="required">*</span>
                </Form.Label>
                <Form.Row>
                  <Col>
                    {' '}
                    <Form.Control
                      type="date"
                      placeholder="yyyy-mm-dd"
                      required
                      name="fromDate"
                      onChange={this.formChange}
                      defaultValue={this.state.fromDate}
                    />
                  </Col>
                  <Col>
                    {' '}
                    <Form.Control
                      type="date"
                      placeholder="yyyy-mm-dd"
                      required
                      name="toDate"
                      onChange={this.formChange}
                      defaultValue={this.state.toDate}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group controlId="formUniqueID">
                <Form.Label>
                  Leave Details <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  as="textarea"
                  rows="3"
                  required
                  name="details"
                  defaultValue={this.state.details}
                  placeholder="Please provide a valid reason here."
                />
              </Form.Group>
              {this.state.leaveTypeId == '2' ? (
                <Form.Group>
                  <Form.Label>
                    Attach Document
                  </Form.Label>
                  <Form.Row>
                    <Col>
                      <Form.File
                        className="position-relative"
                        name="file"
                        // label="File"
                        onChange={this.onFileChange}
                        //   isInvalid={!!errors.file}
                        //   feedback={errors.file}
                        id="validationFormik107"
                        feedbackTooltip
                      />
                    </Col>
                    <Col>
                      <Button variant="outline-primary" size="sm" onClick={this.onFileUpload}>
                        Upload
                      </Button>
                    </Col>
                  </Form.Row>
                  <small className="form-text text-muted">Click on "Upload" to upload the document before you submit the request.</small>
                </Form.Group>
              ) : null}
              {this.state.loading ? (
                <Button disabled={this.state.loading} variant="primary" type="submit">
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  Please wait
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Amend & Reapply
                </Button>
              )}
            </Form>
          </div>
          <div className="col">
            <div className="row">
              <div className="leavebox">
                <div className="row">
                  <div className="col display-4">{this.state.totalWorkingDays}</div>
                  <div className="col align-self-center">
                    WORKING <br />
                    days
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <table className="table table-striped">
                <tbody>
                  {this.state.conflicts.map((item) => (
                    <tr>
                      <td className={item.isWeekend ? 'text-danger' : ''}>
                        <b>{new Date(item.date).toLocaleDateString('en-US', DATE_OPTIONS)}</b>
                      </td>
                      <td>{item.hasConflicts ? 'Your Teammate is on leave this day' : 'No Conflicts'}</td>
                      <td>{item.isPublicHoliday ? 'Public holiday' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
