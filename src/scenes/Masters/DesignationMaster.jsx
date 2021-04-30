import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Card, message, Spin } from 'antd';
import { ActionRenderer } from '../../components/Utils/StatusRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { DELETE_DESIGNATION, GET_DESIGNATION, POST_DESIGNATION } from '../../constants/urls';
import AgGrid from '../../components/AGGrid/AgGridWrapper';
import { DesignationMasterColumnDefs } from '../../constants/columnMetadata';

const frameworkComponents = {
  statusRenderer: ActionRenderer,
};

export default class DepartmentMaster extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showDeleteModal: false,
      showEditModal: false,
      loading: true,
      rowData: [],
      name: '',
      description: '',
      edited_name: '',
      edited_description: '',
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
    this.getDesignation();
  }
  async getDesignation() {
    let result = await GetAPICall(GET_DESIGNATION);
    console.log(result, 'department master');
    this.setState({ rowData: result.result.items, loading: false });
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
      name: this.state.name,
      description: this.state.description,
    };
    let result = await PostAPICall(POST_DESIGNATION, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Designation added successfully');
      this.setState({ showModal: false });
      this.getDesignation();
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
    let result = await DeleteAPICall(DELETE_DESIGNATION, this.state.deleteID);
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
    this.getDesignation();
  }

  handleEdit(value) {
    this.setState({
      objEditable: value,
      showEditModal: true,
      edited_name: value.name,
      edited_description: value.description,
    });
  }
  async onEditConfirm(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    let payload = {
      name: this.state.edited_name,
      description: this.state.edited_description,
      id: this.state.objEditable.id,
    };
    let result = await PostAPICall(POST_DESIGNATION, payload);
    console.log(result);
    if (result.success === true) {
      message.success('Edited Successfully');
      this.setState({ showEditModal: false });
      this.getDesignation();
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
            <h3>Designation Master</h3>
            <button type="button" className="btn btn-outline-primary" onClick={() => this.setState({ showModal: true })}>
              New
            </button>
          </div>
          <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false })} ModalTitle="Add New Designation">
            <Spin spinning={this.state.loading} tip="Please wait...">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formDepartmentName">
                  <Form.Label>
                    Designation Name <span className="required">*</span>
                  </Form.Label>
                  <Form.Control onChange={this.formChange} type="text" required name="name" placeholder="Enter name" />
                </Form.Group>
                <Form.Group controlId="formUniqueID">
                  <Form.Label>Description</Form.Label>
                  <Form.Control onChange={this.formChange} as="textarea" rows="3" name="description" placeholder="Enter description" />
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
          <ModalWrapper show={this.state.showEditModal} onHide={() => this.setState({ showEditModal: false })} ModalTitle="Edit Designation">
            <Form onSubmit={this.onEditConfirm}>
              <Form.Group controlId="formDepartmentName">
                <Form.Label>
                  Designation Name <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  type="text"
                  required
                  defaultValue={this.state.objEditable.name}
                  name="edited_name"
                  placeholder="Enter name"
                />
              </Form.Group>
              <Form.Group controlId="formUniqueID">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  as="textarea"
                  defaultValue={this.state.objEditable.description}
                  rows="3"
                  name="edited_description"
                  placeholder="Enter description"
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
            columnDefs={DesignationMasterColumnDefs}
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
