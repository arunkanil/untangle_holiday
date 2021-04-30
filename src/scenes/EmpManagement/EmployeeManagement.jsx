import React, { useState } from 'react';
import { Button, Col, Form, Spinner } from 'react-bootstrap';
import { Card, message, Spin } from 'antd';
import { ActionRenderer } from '../../components/Utils/StatusRenderer';
import { IdRenderer } from '../../components/Utils/IdRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import AgGrid from '../../components/AGGrid/AgGridWrapper';
import template from '../../images/empdata.xlsx';
import { EmployeeManagementColumnDefs } from '../../constants/columnMetadata';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import {
  DELETE_EMPLOYEEPROFILE,
  GET_DESIGNATION,
  GET_DEPARTMENT,
  GET_EMPLOYEEPROFILE,
  POST_EMPLOYEEPROFILE_FROMAD,
  POST_EMPLOYEEPROFILE,
  GET_USERS,
  GET_COUNTRY,
  POST_FILEUPLOAD,
  POST_EMPLOYEEIMPORT,
} from '../../constants/urls';
import { downloadTempFile } from '../../constants/constants';
import * as Msal from 'msal';

const loginRequest = {
  scopes: ['User.Read', 'User.ReadBasic.All', 'User.Read.All'],
};
const msalConfig = {
  auth: {
    authority: 'https://login.microsoftonline.com/common',
    // clientId: '8c0864b0-e5d7-4092-b3dc-6bbb2e0f06e5',
    clientId: 'e87a5d38-08cd-452f-a485-6ebc1f48af39', //AM Azure client id
    postLogoutRedirectUri: window.location.origin,
    redirectUri: window.location.origin,
    validateAuthority: true,
    // After being redirected to the "redirectUri" page, should user
    // be redirected back to the Url where their login originated from?
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};
const myMSALObj = new Msal.UserAgentApplication(msalConfig);

const frameworkComponents = {
  statusRenderer: ActionRenderer,
  idRenderer: IdRenderer,
};
let formselect = [
  {
    name: 'Function',
    id: 'designationId',
    editedid: 'edited_designationId',
    data: 'designationList',
    required: true,
  },
  {
    name: 'Department',
    id: 'departmentId',
    editedid: 'edited_departmentId',
    data: 'departmentlist',
    required: true,
  },
  {
    name: 'Country',
    id: 'countryId',
    editedid: 'edited_countryId',
    data: 'countryList',
    required: true,
  },
  {
    name: 'Approver',
    id: 'reportsTo',
    editedid: 'edited_reportsTo',
    data: 'userList',
    required: true,
  },
  {
    name: 'Secondary Approver',
    id: 'secondaryApprover',
    editedid: 'edited_secondaryApprover',
    data: 'userList',
    required: false,
  },
];
export default class EmployeeManagement extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showImportModal: false,
      showDeleteModal: false,
      showEditModal: false,
      loading: true,
      loading1: false,
      fetchLoading: false,
      rowData: [],

      empprofileAD: {},
      firstName: '',
      lastName: '',
      gender: '',
      emailAddress: '',
      userName: '',
      employeeId: '',
      countryId: '',
      officeLocation: '',
      reportsTo: '',
      secondaryApprover: '',
      designationId: '',
      departmentId: '',

      edited_firstName: '',
      edited_lastName: '',
      edited_gender: '',
      edited_emailAddress: '',
      edited_userName: '',
      edited_employeeId: '',
      edited_officeLocation: '',
      edited_reportsTo: '',
      edited_countryId: '',
      edited_secondaryApprover: '',
      edited_designationId: '',
      edited_departmentId: '',

      designationList: [],
      departmentlist: [],
      userList: [],
      countryList: [],
      selectedFile: null,
      file: {},
      context: { componentParent: this },
      deleteID: '',
      objEditable: {},
    };
    this.formChange = this.formChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
    this.onEditConfirm = this.onEditConfirm.bind(this);
    this.downloadTempFile = downloadTempFile.bind(this);
    this.getEmployeeFromAD = this.getEmployeeFromAD.bind(this);
  }
  async componentDidMount() {
    this.getEmployees();
    this.getDataLists();
  }
  async getEmployees() {
    let result = await GetAPICall(GET_EMPLOYEEPROFILE);
    console.log(result, 'getEmployees');
    this.setState({ loading: false, rowData: result.result.items });
  }
  async getEmployeeFromAD() {
    this.setState({ fetchLoading: true });
    let refreshtoken = await myMSALObj.acquireTokenSilent(loginRequest).catch((error) => {
      // handle error
      console.log(error);
      alert("AD session expired.Please log out and try again!");
      this.setState({ fetchLoading: false });
    });
    console.log(refreshtoken);
    let payload = {
      token: refreshtoken.accessToken,
      email: this.state.userName,
    };
    let result = await PostAPICall(POST_EMPLOYEEPROFILE_FROMAD, payload);
    console.log(result, 'getEmployeeFromAD');
    if (result.success == true) {
      if (result.result.refreshDepartment || result.result.refreshDesignation) {
        await this.getDataLists();
      }
      let officeLocation = this.state.countryList.filter((item) => item.name?.toLowerCase() == result.result.country?.toLowerCase());
      let jobTitle = this.state.designationList.filter((item) => item.name?.toLowerCase() == result.result.jobTitle?.toLowerCase());
      let department = this.state.departmentlist.filter((item) => item.name?.toLowerCase() == result.result.department?.toLowerCase());
      console.log(officeLocation, jobTitle, department);
      this.setState({
        fetchLoading: false,
        firstName: result.result.givenName,
        lastName: result.result.surname,
        userName: result.result.userPrincipalName,
        emailAddress: result.result.mail,
        employeeId: result.result.employeeId,
        designationId: jobTitle[0]?.id,
        countryId: officeLocation[0]?.id,
        departmentId: department[0]?.id,
      });
    } else {
      message.error(result.result.error);
      this.setState({ fetchLoading: false });
    }
  }
  async getDataLists() {
    const promise1 = GetAPICall(GET_DESIGNATION);
    const promise2 = GetAPICall(GET_USERS);
    const promise3 = GetAPICall(GET_DEPARTMENT);
    const promise4 = GetAPICall(GET_COUNTRY);
    Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
      console.log(values);
      this.setState({
        designationList: values[0].result.items,
        userList: values[1].result.items,
        departmentlist: values[2].result.items,
        countryList: values[3].result.items,
      });
    });
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
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
      message.success('File uploaded succesfully');
      this.setState({ file: result.result, loading: false });
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  };
  bulkImport = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, loading1: true, showImportModal: false });
    await this.onFileUpload();
    let formdata = {
      fileName: this.state.file.fileName,
      fileType: this.state.file.fileType,
      fileToken: this.state.file.fileToken,
    };
    let result = await PostAPICall(POST_EMPLOYEEIMPORT, formdata);
    console.log(result);
    if ((result.success = true)) {
      message.info(`Import completed. ${result.result.succcessCount} employees added ${result.result.errorCount} records failed.`);
      this.setState({ loading1: false });
      if (result.result.invalidRecords.fileToken) {
        this.downloadTempFile(result.result.invalidRecords);
      }
      this.getEmployees();
      this.getDataLists();
    }
  };
  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true, showModal: false });
    console.log(e);
    let formdata = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      gender: this.state.gender,
      emailAddress: this.state.emailAddress,
      employeeId: this.state.employeeId,
      userName: this.state.userName,
      officeLocation: this.state.officeLocation,
      reportsTo: this.state.reportsTo,
      secondaryApprover: this.state.secondaryApprover,
      designationId: this.state.designationId,
      departmentId: this.state.departmentId,
      countryId: this.state.countryId,
    };
    let result = await PostAPICall(POST_EMPLOYEEPROFILE, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Employee added successfully');
      this.setState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        employeeId: '',
        userName: '',
        officeLocation: '',
        reportsTo: '',
        secondaryApprover: '',
        designationId: '',
        departmentId: '',
        countryId: '',
      });
      this.getEmployees();
      this.getDataLists();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }
  handleDelete(value) {
    this.setState({
      showDeleteModal: true,
      deleteID: value.id,
    });
  }
  async onDeleteConfirm() {
    console.log(this.state.deleteID);
    this.setState({ loading: true, showDeleteModal: false });
    let result = await DeleteAPICall(DELETE_EMPLOYEEPROFILE, this.state.deleteID);
    console.log(result);
    if (result.success === true) {
      message.success('Deleted Successfully');
      this.getEmployees();
      this.getDataLists();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }
  handleEdit(value) {
    this.setState({
      objEditable: value,
      showEditModal: true,
      edited_firstName: value.firstName,
      edited_lastName: value.lastName,
      edited_gender: value.gender,
      edited_userName: value.userName,
      edited_emailAddress: value.emailAddress,
      edited_employeeId: value.employeeId,
      edited_officeLocation: value.officeLocation,
      edited_reportsTo: value.reportsTo,
      edited_secondaryApprover: value.secondaryApprover,
      edited_designationId: value.designationId,
      edited_departmentId: value.departmentId,
      edited_countryId: value.countryId,
    });
    console.log(this.state, 'handleedit');
  }
  async onEditConfirm(e) {
    e.preventDefault();
    this.setState({ loading: true, showEditModal: false });
    console.log(this.state, 'onEditConfirm');
    let payload = {
      firstName: this.state.edited_firstName,
      lastName: this.state.edited_lastName,
      gender: this.state.edited_gender,
      emailAddress: this.state.edited_emailAddress,
      userName: this.state.objEditable.userName,
      employeeId: this.state.edited_employeeId,
      officeLocation: this.state.edited_officeLocation,
      reportsTo: this.state.edited_reportsTo,
      secondaryApprover: this.state.edited_secondaryApprover,
      designationId: this.state.edited_designationId,
      departmentId: this.state.edited_departmentId,
      countryId: this.state.edited_countryId,
      id: this.state.objEditable.id,
    };
    let result = await PostAPICall(POST_EMPLOYEEPROFILE, payload);
    console.log(result);
    if (result.success === true) {
      message.success('Edited Successfully');
      this.getEmployees();
      this.getDataLists();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }
  onRowClicked = (event) => {
    console.log('Row selected methord (Obj).....!!', event);
    this.props.history.push({
      pathname: '/employee_details',
      state: { data: event },
    });
  };
  render() {
    return (
      <Card>
        <div className="page-heading">
          <h3>Employee Management</h3>
          <div>
            <button type="button" className="btn btn-outline-primary" onClick={() => this.setState({ showModal: true })}>
              New Employee
            </button>
            <button
              type="button"
              disabled={this.state.loading1}
              className="btn btn-outline-primary ml-2"
              onClick={() => this.setState({ showImportModal: true })}
            >
              {this.state.loading1 ? <div class="spinner-border mx-1 spinner-border-sm text-primary" role="status"></div> : null}Bulk Import
            </button>
          </div>
        </div>
        <ModalWrapper show={this.state.showImportModal} onHide={() => this.setState({ showImportModal: false })} ModalTitle="Employee Bulk Import">
          <Form onSubmit={this.bulkImport}>
            <Form.Group>
              <Form.Label>
                Attach Document <span className="required">*</span>
              </Form.Label>
              <Form.Row>
                <Col>
                  <Form.File
                    className="position-relative"
                    required
                    name="file"
                    // label="File"
                    onChange={this.onFileChange}
                    multiple="true"
                    //   isInvalid={!!errors.file}
                    //   feedback={errors.file}
                    id="validationFormik107"
                    feedbackTooltip
                  />
                </Col>
              </Form.Row>
              <small class="form-text text-muted">Only .xls and .xlsx files supported.</small>
              <small class="form-text text-muted">
                <a href={template} download>
                  Click here
                </a>{' '}
                to download excel template.
              </small>
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
        </ModalWrapper>
        <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false })} ModalTitle="Add New Employee">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>
                Name <span className="required">*</span>
              </Form.Label>
              <Form.Row>
                <Col>
                  <Form.Control
                    size="sm"
                    required
                    onChange={this.formChange}
                    name="firstName"
                    defaultValue={this.state.firstName}
                    placeholder="First name"
                  />
                </Col>
                <Col>
                  <Form.Control
                    size="sm"
                    required
                    onChange={this.formChange}
                    name="lastName"
                    defaultValue={this.state.lastName}
                    placeholder="Last name"
                  />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Check
                inline
                type="radio"
                name="gender"
                onChange={(e) => {
                  this.setState({
                    gender: 1,
                  });
                }}
                label="Male"
              />
              <Form.Check
                inline
                type="radio"
                name="gender"
                onChange={(e) => {
                  this.setState({
                    gender: 2,
                  });
                }}
                label="Female"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Login ID <span className="required">*</span>
              </Form.Label>
              <Form.Row>
                <Col xs={14} md={10}>
                  <Form.Control
                    size="sm"
                    onChange={this.formChange}
                    required
                    name="userName"
                    defaultValue={this.state.userName}
                    placeholder="Enter username"
                  />
                </Col>
                <Col xs={4} md={2} className="text-right">
                  {this.state.fetchLoading ? (
                    <Button disabled={this.state.fetchLoading} variant="primary" size="sm">
                      <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                      wait
                    </Button>
                  ) : (
                    <Button disabled={this.state.userName != '' ? false : true} variant="primary" onClick={this.getEmployeeFromAD} size="sm">
                      Fetch
                    </Button>
                  )}
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                E-mail <span className="required">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                onChange={this.formChange}
                type="email"
                required
                name="emailAddress"
                defaultValue={this.state.emailAddress}
                placeholder="Enter e-mail"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Employee ID <span className="required">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                required
                onChange={this.formChange}
                defaultValue={this.state.employeeId}
                name="employeeId"
                placeholder="Enter employee id"
              />
            </Form.Group>
            {formselect.map((item) => (
              <Form.Group>
                <Form.Label>
                  {item.name} {item.required === true ? <span className="required">*</span> : null}
                </Form.Label>
                <Form.Control size="sm" as="select" required={item.required} value={this.state[item.id]} name={item.id} onChange={this.formChange}>
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  {this.state[item.data].map((innerItem) => (
                    <option value={innerItem.id}>
                      {item.id === 'reportsTo' || item.id === 'secondaryApprover' ? innerItem.fullName : innerItem.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            ))}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ModalWrapper>
        <ModalWrapper show={this.state.showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })} ModalTitle="Delete item?" size="sm">
          <div className="justify-content-between">
            <Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>
              No
            </Button>
            <Button variant="primary" className="float-right" onClick={this.onDeleteConfirm}>
              Yes
            </Button>
          </div>
        </ModalWrapper>
        <ModalWrapper show={this.state.showEditModal} onHide={() => this.setState({ showEditModal: false })} ModalTitle="Edit Employee">
          <Form onSubmit={this.onEditConfirm}>
            <Form.Group>
              <Form.Label>
                Name <span className="required">*</span>
              </Form.Label>
              <Form.Row>
                <Col>
                  <Form.Control
                    size="sm"
                    required
                    onChange={this.formChange}
                    name="edited_firstName"
                    defaultValue={this.state.objEditable.firstName}
                  />
                </Col>
                <Col>
                  <Form.Control size="sm" required onChange={this.formChange} name="edited_lastName" defaultValue={this.state.objEditable.lastName} />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Check
                inline
                type="radio"
                name="gender"
                defaultChecked={this.state.objEditable.gender == 1 ? true : false}
                onChange={(e) => {
                  this.setState({
                    edited_gender: 1,
                  });
                }}
                label="Male"
              />
              <Form.Check
                inline
                type="radio"
                name="gender"
                defaultChecked={this.state.objEditable.gender == 2 ? true : false}
                onChange={(e) => {
                  this.setState({
                    edited_gender: 2,
                  });
                }}
                label="Female"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Login ID <span className="required">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                disabled={true}
                onChange={this.formChange}
                type="email"
                required
                name="edited_userName"
                defaultValue={this.state.objEditable.userName}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                E-mail <span className="required">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                onChange={this.formChange}
                type="email"
                required
                name="edited_emailAddress"
                defaultValue={this.state.objEditable.emailAddress}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Employee ID <span className="required">*</span>
              </Form.Label>
              <Form.Control size="sm" required onChange={this.formChange} name="edited_employeeId" defaultValue={this.state.objEditable.employeeId} />
            </Form.Group>
            {formselect.map((item) => (
              <Form.Group>
                <Form.Label>
                  {item.name} {item.required === true ? <span className="required">*</span> : null}
                </Form.Label>
                <Form.Control
                  size="sm"
                  as="select"
                  required={item.required}
                  name={item.editedid}
                  defaultValue={this.state.objEditable[item.id]}
                  onChange={this.formChange}
                >
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  {this.state[item.data].map((innerItem) => (
                    <option value={innerItem.id}>
                      {item.id === 'reportsTo' || item.id === 'secondaryApprover' ? innerItem.fullName : innerItem.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            ))}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ModalWrapper>
        <hr></hr>
        <Spin spinning={this.state.loading} tip="Please wait...">
          <AgGrid
            pagination={true}
            context={this.state.context}
            columnDefs={EmployeeManagementColumnDefs}
            rowData={this.state.rowData}
            suppressCellSelection={true}
            onGridReady={this.onGridReady}
            // onRowClicked={this.onRowClicked}
            frameworkComponents={frameworkComponents}
          ></AgGrid>
        </Spin>
      </Card>
    );
  }
}
