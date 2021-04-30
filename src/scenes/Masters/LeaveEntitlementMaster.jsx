import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ActionRenderer } from '../../components/Utils/StatusRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';

import AgGrid from '../../components/AGGrid/AgGridWrapper';
import { LeaveEntitlementMasterColumnDefs } from '../../constants/columnMetadata';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { DELETE_LEAVENTITLEMENT, GET_COUNTRY, GET_LEAVENTITLEMENT, GET_LEAVETYPE, POST_LEAVENTITLEMENT } from '../../constants/urls';
import { Card, message, Spin } from 'antd';

const frameworkComponents = {
  statusRenderer: ActionRenderer,
};

export default class LeaveEntitlementMaster extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showDeleteModal: false,
      showEditModal: false,
      loading: true,
      rowData: [],
      countryList: [],
      leaveTypeList: [],
      leaveCount: '',
      leaveTypeId: '',
      contryId: '',
      canCarryForward: false,
      edited_leaveCount: '',
      edited_leaveTypeId: '',
      edited_contryId: '',
      edited_canCarryForward: '',
      context: { componentParent: this },
      deleteID: '',
      objEditable: {},
    };
    this.formChange = this.formChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
    this.onEditConfirm = this.onEditConfirm.bind(this);
  }
  async componentDidMount() {
    this.getLeaveEntitlement();
    this.getCountry();
  }
  async getLeaveEntitlement() {
    let result = await GetAPICall(GET_LEAVENTITLEMENT);
    console.log(result, 'getLeaveEntitlement');
    this.setState({ rowData: result.result.items, loading: false });
  }
  async getCountry() {
    let result = await GetAPICall(GET_COUNTRY);
    let leavetypelist = await GetAPICall(GET_LEAVETYPE);
    console.log(result, 'country', leavetypelist);
    this.setState({
      countryList: result.result.items,
      leaveTypeList: leavetypelist.result.items,
    });
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  }
  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let formdata = {
      contryId: this.state.contryId,
      leaveTypeId: this.state.leaveTypeId,
      leaveCount: this.state.leaveCount,
      canCarryForward: this.state.canCarryForward
    };
    let result = await PostAPICall(POST_LEAVENTITLEMENT, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Leave entitlement created successfully');
      this.setState({ showModal: false });
      this.getLeaveEntitlement();
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
    this.setState({ loading: true });
    let result = await DeleteAPICall(DELETE_LEAVENTITLEMENT, this.state.deleteID);
    console.log(result);
    if (result) {
      if (result.success === true) {
        message.success('Deleted Successfully');
      } else {
        message.error('Something went wrong');
        this.setState({ loading: false });
      }
    }
    this.setState({ showDeleteModal: false });
    this.getLeaveEntitlement();
  }
  handleEdit(value) {
    this.setState({
      objEditable: value,
      showEditModal: true,
      edited_leaveCount: value.leaveCount,
      edited_leaveTypeId: value.leaveTypeId,
      edited_contryId: value.contryId,
      edited_canCarryForward: value.canCarryForward
    });
  }
  async onEditConfirm(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    let payload = {
      leaveCount: this.state.edited_leaveCount,
      leaveTypeId: this.state.edited_leaveTypeId,
      contryId: this.state.edited_contryId,
      canCarryForward: this.state.edited_canCarryForward,
      id: this.state.objEditable.id,
    };
    let result = await PostAPICall(POST_LEAVENTITLEMENT, payload);
    console.log(result);
    if (result.success === true) {
      message.success('Edited Successfully');
      this.setState({ showEditModal: false });
      this.getLeaveEntitlement();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="Please wait...">
        <Card>
          <div className="page-heading">
            <h3>Leave Entitlement Master</h3>
            <button type="button" className="btn btn-outline-primary" onClick={() => this.setState({ showModal: true })}>
              New
            </button>
          </div>
          <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false })} ModalTitle="Add New Leave Entitlement">
            <Spin spinning={this.state.loading} tip="Please wait...">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>
                    Country <span className="required">*</span>
                  </Form.Label>
                  <Form.Control as="select" required name="contryId" onChange={this.formChange}>
                    <option value="" disabled selected hidden>
                      Choose...
                    </option>
                    {this.state.countryList.map((item) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>
                    Leave Type <span className="required">*</span>
                  </Form.Label>
                  <Form.Control as="select" required name="leaveTypeId" onChange={this.formChange}>
                    <option value="" disabled selected hidden>
                      Choose...
                    </option>
                    {this.state.leaveTypeList.map((item) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formDepartmentName">
                  <Form.Label>
                    Leave Count <span className="required">*</span>
                  </Form.Label>
                  <Form.Control onChange={this.formChange} type="text" required name="leaveCount" placeholder="Enter no. of leaves" />
                </Form.Group>
                <Form.Group controlId="formRadio">
                  <Form.Label>
                    Should Unused Leaves be carried forward to next year? <span className="required">*</span>
                  </Form.Label>
                  <br />
                  <Form.Check
                    inline
                    type="radio"
                    name="carryCheck"
                    onChange={(e) => {
                      this.setState({
                        canCarryForward: true,
                      });
                    }}
                    label="Yes"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="carryCheck"
                    onChange={(e) => {
                      this.setState({
                        canCarryForward: false,
                      });
                    }}
                    label="No"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Spin>
          </ModalWrapper>
          <ModalWrapper
            show={this.state.showDeleteModal}
            onHide={() => this.setState({ showDeleteModal: false })}
            ModalTitle="Delete item?"
            size="sm"
          >
            <div className="justify-content-between">
              <Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>
                No
              </Button>
              <Button variant="primary" className="float-right" onClick={this.onDeleteConfirm}>
                Yes
              </Button>
            </div>
          </ModalWrapper>
          <ModalWrapper show={this.state.showEditModal} onHide={() => this.setState({ showEditModal: false })} ModalTitle="Edit Leave Entitlement">
            <Form onSubmit={this.onEditConfirm}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>
                  Country <span className="required">*</span>
                </Form.Label>
                <Form.Control as="select" required name="edited_contryId" defaultValue={this.state.objEditable.contryId} onChange={this.formChange}>
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  {this.state.countryList.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>
                  Leave Type <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="edited_leaveTypeId"
                  defaultValue={this.state.objEditable.leaveTypeId}
                  onChange={this.formChange}
                >
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  {this.state.leaveTypeList.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDepartmentName">
                <Form.Label>
                  Leave Count <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  defaultValue={this.state.objEditable.leaveCount}
                  type="text"
                  required
                  name="edited_leaveCount"
                />
              </Form.Group>
              <Form.Group controlId="formEditRadio">
                  <Form.Label>
                    Should Unused Leaves be carried forward to next year? <span className="required">*</span>
                  </Form.Label>
                  <br />
                  <Form.Check
                    inline
                    type="radio"
                    name="carryCheck"
                    defaultChecked={this.state.objEditable.canCarryForward? true : false}
                    onChange={(e) => {
                      this.setState({
                        edited_canCarryForward: true,
                      });
                    }}
                    label="Yes"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="carryCheck"
                    defaultChecked={this.state.objEditable.canCarryForward? false : true}
                    onChange={(e) => {
                      this.setState({
                        edited_canCarryForward: false,
                      });
                    }}
                    label="No"
                  />
                </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </ModalWrapper>
          <hr></hr>
          <AgGrid
            pagination={true}
            context={this.state.context}
            columnDefs={LeaveEntitlementMasterColumnDefs}
            rowData={this.state.rowData}
            suppressCellSelection={true}
            onGridReady={this.onGridReady}
            frameworkComponents={frameworkComponents}
          ></AgGrid>
        </Card>
      </Spin>
    );
  }
}
