import React, { useState } from 'react';
import { Button, Col, Tabs, Tab, Form } from 'react-bootstrap';
import { Card, Icon, message } from 'antd';
import { GET_EMPLOYEE_LEAVEENTITLEMENT, POST_EMPLOYEE_LEAVEENTITLEMENT } from '../../constants/urls';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import { GetAPICall, PostAPICall } from '../../services/dataservice';
import edit from '../../images/edit.svg';

let mapper = [
  {
    name: 'Employee ID',
    property: 'employeeId',
  },
  {
    name: 'E-mail',
    property: 'emailAddress',
  },
  {
    name: 'Function',
    property: 'designation',
  },
  {
    name: 'Department',
    property: 'department',
  },
  // {
  //   name: 'Office Location',
  //   property: 'officeLocation',
  // },
  {
    name: 'Country',
    property: 'country',
  },
  {
    name: 'Reports to',
    property: 'reportsToName',
  },
  { name: 'Secondary Approver', property: 'secondaryApproverName' },
];
export default class EmployeeDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      details: {},
      showModal: false,
      balanceLeaveCount: '',
      selected: [],
      rowData: [],
    };
  }
  componentDidMount() {
    console.log(this.props.location.state);
    this.setState({ details: this.props.location.state.data });
    this.getEmployeeLeaves();
  }
  formChange = (event) => {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  };
  getEmployeeLeaves = async () => {
    let result = await GetAPICall(
      `${GET_EMPLOYEE_LEAVEENTITLEMENT}?UserId=${this.props.location.state.data.userId}&CountryId=${this.props.location.state.data.countryId}`
    );
    console.log(result, 'getEmployeeLeaves');
    this.setState({ rowData: result.result });
  };
  onEdit = (id) => {
    this.setState({ selected: id, showModal: true });
    console.log(id);
  };
  onSubmit = async (e) => {
    e.preventDefault();
    let formdata = {
      leaveTypeId: this.state.selected.leaveTypeId,
      totalLeaveCount: this.state.balanceLeaveCount,
      userId: this.state.selected.userId,
    };
    let result = await PostAPICall(POST_EMPLOYEE_LEAVEENTITLEMENT, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Leave detail edited successfully');
      this.getEmployeeLeaves();
      this.setState({ showModal: false, balanceLeaveCount: null });
    }
  };
  render() {
    return (
      <Card>
        <div>
          <h3 style={{ textAlign: 'left' }}>
            <Icon
              type="arrow-left"
              style={{ marginRight: '20px' }}
              onClick={() => {
                window.history.go(-1);
                return false;
              }}
            />
            <span>Employee Details</span>
          </h3>
        </div>
        <hr />
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="profile" title="Employee details">
            <div className="row">
              <table class="table table-striped">
                <tr>
                  <td>Name</td>
                  <td>
                    {this.state.details.firstName} {this.state.details.lastName}
                  </td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>{this.state.details.gender == 1 ? 'Male' : 'Female'}</td>
                </tr>
                {mapper.map((item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{this.state.details[item.property]}</td>
                  </tr>
                ))}
              </table>
            </div>
          </Tab>
          <Tab eventKey="home" title="Leave details">
            <div className="row">
              <small>
                This table can be used to edit individual leave counts of employees. Please know this can be done only until the employee makes their
                first leave request.
              </small>
            </div>
            <div className="row">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Leave type</th>
                    <th>Total Entitlement</th>
                    <th>Adjusted Leave count</th>
                    <th>Present balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rowData.map((item) => (
                    <tr>
                      <td>{item.leaveTypeName}</td>
                      <td>{item.countryDefaultLeaveCount}</td>
                      <td>{item.employeeTotalLeaveCount}</td>
                      <td>{item.employeeBalanceLeaveCount? item.employeeBalanceLeaveCount : item.countryBalanceLeaveCount}</td>
                      <td>
                        <a
                          onClick={(e) => {
                            this.onEdit(item);
                          }}
                        >
                          <img src={edit} style={{ width: '20px', cursor: 'pointer' }} alt="delete" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab>
        </Tabs>
        <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false })} ModalTitle="Edit Employee Leaves">
          <Form onSubmit={this.onSubmit}>
            <Form.Group>
              <Form.Label>Leave type</Form.Label>
              <Form.Control
                size="sm"
                required
                disabled
                onChange={this.formChange}
                defaultValue={this.state.selected.leaveTypeName}
                name="employeeId"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Leaves allocated to country</Form.Label>
              <Form.Control
                size="sm"
                required
                disabled
                onChange={this.formChange}
                defaultValue={this.state.selected.countryDefaultLeaveCount}
                name="employeeId"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Employee balance<span className="required">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="float"
                min="0"
                pattern="^\d+(?:[,.][05])?$"
                max="365"
                required
                onChange={this.formChange}
                defaultValue={this.state.selected.employeeBalanceLeaveCount}
                name="balanceLeaveCount"
              />
              <small className="form-text text-muted">Range 0 to 365. Value in multiples of 0.5.</small>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </ModalWrapper>
      </Card>
    );
  }
}
