import React, { useState } from 'react';
import { Card, DatePicker, Icon, message } from 'antd';
import { Button, Form, Col, Spinner } from 'react-bootstrap';

import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { GET_LEAVECONFLICTS, GET_LEAVETYPEBYCOUNTRY, POST_LEAVEREQUEST, POST_FILEUPLOAD } from '../../constants/urls';

const DATE_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export default class RequestLeave extends React.Component {
  constructor() {
    super();
    this.state = {
      leaveTypeList: [],
      leaveTypeId: '',
      details: '',

      isHalfDay: false,
      isSingleDay: false,
      isMultiDay: true,
      halfDayTime: 1,

      fromDate: '',
      toDate: '',
      selectedFile: null,
      file: {},
      totalWorkingDays: '0',
      weekends: [],
      holidays: [],
      conflicts: [],
      conflictArray: [],

      loading: false,
      loading1: false,
      dropdownloading: false,
    };
    this.formChange = this.formChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    this.getLists();
  }

  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value }, function () {
      if (target.name == 'fromDate' && (this.state.isHalfDay || this.state.isSingleDay)) {
        //If SingleHalf days selected, toDate mimics fromDate
        this.setState({ toDate: target.value });
      }
      this.getConflits();
    });
  }

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  onFileUpload = async () => {
    const formData = new FormData();
    this.setState({ loading: true });
    formData.append('myFile', this.state.selectedFile, this.state.selectedFile.name);
    console.log(this.state.selectedFile);
    let result = await PostAPICall(POST_FILEUPLOAD, formData);
    if (result.success == true) {
      console.log(result, 'file upload');
      // message.success('File uploaded succesfully');
      this.setState({ file: result.result, loading: false });
    }
  };
  async getLists() {
    this.setState({ dropdownloading: true });
    let leavetypelist = await GetAPICall(GET_LEAVETYPEBYCOUNTRY);
    console.log(leavetypelist);
    this.setState({
      leaveTypeList: leavetypelist.result,
      dropdownloading: false,
    });
  }
  getConflits = async () => {
    if (this.state.isMultiDay) {
      if (this.state.fromDate && this.state.toDate) {
        let leaveConflicts = await GetAPICall(`${GET_LEAVECONFLICTS}FromDate=${this.state.fromDate}&ToDate=${this.state.toDate}`);
        this.setState({
          conflicts: leaveConflicts.result.conflicts,
        });
        let fromDate = new Date(this.state.fromDate),
          toDate = new Date(this.state.toDate),
          arrTime = [];
        for (let q = fromDate; q <= toDate; q.setDate(q.getDate() + 1)) {
          arrTime.push({
            date: q.toISOString(),
            isWeekend: leaveConflicts.result.weekends.includes(q.toISOString().slice(0, 19)),
            isholiday: leaveConflicts.result.holidays.filter((day) => day.date == q.toISOString().slice(0, 19)),
            conflicts: leaveConflicts.result.conflicts.filter((day) => day.date == q.toISOString().slice(0, 19)),
          });
        }
        this.setState({ conflictArray: arrTime, totalWorkingDays: leaveConflicts.result.totalWorkingDays });
      }
    } else {
      if (this.state.fromDate) {
        let leaveConflicts = await GetAPICall(`${GET_LEAVECONFLICTS}FromDate=${this.state.fromDate}&ToDate=${this.state.fromDate}`);
        this.setState({
          conflicts: leaveConflicts.result.conflicts,
        });
        let fromDate = new Date(this.state.fromDate),
          toDate = new Date(this.state.fromDate),
          arrTime = [];
        for (let q = fromDate; q <= toDate; q.setDate(q.getDate() + 1)) {
          arrTime.push({
            date: q.toISOString(),
            isWeekend: leaveConflicts.result.weekends.includes(q.toISOString().slice(0, 19)),
            isholiday: leaveConflicts.result.holidays.filter((day) => day.date == q.toISOString().slice(0, 19)),
            conflicts: leaveConflicts.result.conflicts.filter((day) => day.date == q.toISOString().slice(0, 19)),
          });
        }
        this.setState({ conflictArray: arrTime, totalWorkingDays: this.state.isHalfDay ? 0.5 : leaveConflicts.result.totalWorkingDays });
      }
    }
  };
  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.toDate >= this.state.fromDate) {
      if (this.state.leaveTypeId == '2' || this.state.leaveTypeId == '7') {
        if (this.state.selectedFile) {
          await this.onFileUpload();
        }
      }
      this.setState({ loading1: true });
      let formdata = {};
      if (this.state.selectedFile) {
        if (this.state.leaveTypeId == '2' || this.state.leaveTypeId == '7') {
          formdata = {
            leaveTypeId: this.state.leaveTypeId,
            details: this.state.details,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            halfDayTime: this.state.halfDayTime,
            isHalfDay: this.state.isHalfDay,
            file: {
              fileName: this.state.file.fileName,
              fileType: this.state.file.fileType,
              fileToken: this.state.file.fileToken,
            },
          };
        }
      } else {
        formdata = {
          leaveTypeId: this.state.leaveTypeId,
          details: this.state.details,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
          halfDayTime: this.state.halfDayTime,
          isHalfDay: this.state.isHalfDay,
        };
      }
      console.log(formdata, 'test');

      let result = await PostAPICall(POST_LEAVEREQUEST, formdata);
      console.log(result);
      if (result.success === true) {
        message.success('Leave request submitted successfully');
        this.setState({ loading1: false });
        this.props.history.push('/my_profile');
      } else {
        // message.error('Something went wrong');
        this.setState({ loading1: false });
      }
    } else {
      message.error('From date must be lower than To date.');
    }
  }
  render() {
    return (
      <Card>
        <div className="page-heading">
          <h3>Request Leave</h3>
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
                  {this.state.dropdownloading ? (
                    <option value="" disabled selected hidden>
                      Loading data. Please Wait...
                    </option>
                  ) : (
                    <option value="" disabled selected hidden>
                      Choose...
                    </option>
                  )}
                  {this.state.leaveTypeList.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </Form.Control>

                <small className="form-text text-muted">Documents supporting cause must be attached in case of sick leave</small>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  inline
                  type="radio"
                  name="dayCheck"
                  defaultChecked={this.state.isMultiDay}
                  onChange={(e) => {
                    this.setState({
                      isMultiDay: true,
                      isSingleDay: false,
                      isHalfDay: false,
                    });
                  }}
                  label="Multiple days"
                />
                <Form.Check
                  inline
                  type="radio"
                  name="dayCheck"
                  onChange={(e) => {
                    this.setState({
                      isMultiDay: false,
                      isSingleDay: true,
                      isHalfDay: false,
                      toDate: this.state.fromDate,
                    });
                  }}
                  label="Single Day"
                />
                <Form.Check
                  inline
                  type="radio"
                  name="dayCheck"
                  onChange={(e) => {
                    this.setState({
                      isMultiDay: false,
                      isSingleDay: false,
                      isHalfDay: true,
                      toDate: this.state.fromDate,
                    });
                  }}
                  label="Half Day"
                />
              </Form.Group>
              {this.state.isHalfDay ? (
                <Form.Group>
                  <Form.Check
                    inline
                    type="radio"
                    defaultChecked={true}
                    name="halfDayTime"
                    onChange={(e) => {
                      this.setState({
                        halfDayTime: 1,
                      });
                    }}
                    label="First Half"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="halfDayTime"
                    onChange={(e) => {
                      this.setState({
                        halfDayTime: 2,
                      });
                    }}
                    label="Second Half"
                  />
                </Form.Group>
              ) : null}
              <Form.Group controlId="exampleForm.ControlSelect3">
                <Form.Label>
                  Date <span className="required">*</span>
                </Form.Label>
                <Form.Row>
                  <Col>
                    {' '}
                    <input className="form-control" type="date" placeholder="yyyy-mm-dd" required name="fromDate" onChange={this.formChange} />
                  </Col>
                  {this.state.isMultiDay ? <span className="mt-2"> to </span> : <span></span>}

                  <Col>
                    {this.state.isMultiDay ? (
                      <input
                        className="form-control"
                        type="date"
                        placeholder="yyyy-mm-dd"
                        required
                        name="toDate"
                        min={this.state.fromDate}
                        onChange={this.formChange}
                      />
                    ) : (
                      <span></span>
                    )}
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
                  placeholder="please provide a valid reason here"
                />
              </Form.Group>
              {this.state.leaveTypeId == '2' || this.state.leaveTypeId == '7' ? (
                <Form.Group>
                  <Form.Label>Attach Document</Form.Label>
                  <Form.Row>
                    <Col>
                      <Form.File
                        className="position-relative"
                        // required
                        name="file"
                        // label="File"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg"
                        onChange={this.onFileChange}
                        multiple="true"
                        //   isInvalid={!!errors.file}
                        //   feedback={errors.file}
                        id="validationFormik107"
                        feedbackTooltip
                      />
                    </Col>
                    <Col>
                      {this.state.loading ? (
                        <Button variant="outline-primary" disabled={this.state.loading} size="sm" onClick={this.onFileUpload}>
                          <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                          Uploading{' '}
                        </Button>
                      ) : null}
                    </Col>
                  </Form.Row>
                  <small class="form-text text-muted">Only .docx, .doc, .pdf, .jpg, .jpeg filetypes allowed.</small>
                </Form.Group>
              ) : null}
              {this.state.loading1 ? (
                <Button disabled={this.state.loading1} variant="primary" type="submit">
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  Please wait
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Request
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
                    NUMBER <br />
                    of days
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <table className="table table-striped">
                <tbody>
                  {this.state.conflictArray.map((item) => (
                    <tr>
                      {item.isWeekend || item.isholiday.length > 0 ? (
                        <td className="text-danger">
                          <b>{new Date(item.date).toLocaleDateString('en-US', DATE_OPTIONS)}</b>
                        </td>
                      ) : (
                        <td className={item.conflicts.length > 0 ? 'text-warning' : 'text-success'}>
                          <b>{new Date(item.date).toLocaleDateString('en-US', DATE_OPTIONS)}</b>
                        </td>
                      )}
                      {item.conflicts.length > 0 ? (
                        <td className="text-warning">
                          <Icon className="mr-1" type={'warning'} />
                          Your Teammate is on leave this day
                        </td>
                      ) : (
                        <td className="text-success">
                          <Icon className="mr-1" type={'safety'} />
                          No Conflicts
                        </td>
                      )}
                      {item.isholiday.length > 0 ? <td className="text-danger">{item.isholiday[0]?.holiday}</td> : <td></td>}
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
