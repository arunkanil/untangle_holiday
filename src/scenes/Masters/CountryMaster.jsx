import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ActionRenderer } from '../../components/Utils/StatusRenderer';
import { WeekendRenderer } from '../../components/Utils/WeekendRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { DELETE_COUNTRY, GET_COUNTRY, POST_COUNTRY } from '../../constants/urls';
import { CountryMasterColumnDefs } from '../../constants/columnMetadata';
import AgGridWrapper from '../../components/AGGrid/AgGridWrapper';
import { Card, message, Spin } from 'antd';
import { Days } from '../../constants/constants';
const frameworkComponents = {
  statusRenderer: ActionRenderer,
  weekendRenderer: WeekendRenderer,
};

export default class CountryMaster extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showDeleteModal: false,
      showEditModal: false,
      loading: true,
      rowData: [],
      name: '',
      code: '',
      weekend1: '',
      weekend2: '',
      edited_name: '',
      edited_code: '',
      edited_weekend1: '',
      edited_weekend2: '',
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
    this.getCountry();
  }
  async getCountry() {
    let result = await GetAPICall(GET_COUNTRY);
    console.log(result, 'country master');
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
      code: this.state.code,
      weekend1: this.state.weekend1,
      weekend2: this.state.weekend2,
    };
    let result = await PostAPICall(POST_COUNTRY, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Country added successfully');
      this.setState({ showModal: false });
      this.getCountry();
    } else {
      this.setState({ loading: false });
      message.error('Something went wrong');
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
    let result = await DeleteAPICall(DELETE_COUNTRY, this.state.deleteID);
    console.log(result);
    if (result) {
      if (result.success === true) {
        message.success('Deleted Successfully');
      } else {
        // message.error('Something went wrong');
        this.setState({ loading: false });
      }
    }
    this.setState({ showDeleteModal: false });
    this.getCountry();
  }
  handleEdit(value) {
    this.setState({
      objEditable: value,
      showEditModal: true,
      edited_name: value.name,
      edited_code: value.code,
      edited_weekend1: value.weekend1,
      edited_weekend2: value.weekend2,
    });
  }
  async onEditConfirm(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    let payload = {
      name: this.state.edited_name,
      code: this.state.edited_code,
      id: this.state.objEditable.id,
      weekend1: this.state.edited_weekend1,
      weekend2: this.state.edited_weekend2,
    };
    let result = await PostAPICall(POST_COUNTRY, payload);
    console.log(result);
    if (result.success === true) {
      message.success('Edited Successfully');
      this.setState({ showEditModal: false });
      this.getCountry();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Card>
        <Spin spinning={this.state.loading} tip="Please wait...">
          <div className="page-heading">
            <h3>Country Master</h3>
            <button type="button" className="btn btn-outline-primary" onClick={() => this.setState({ showModal: true })}>
              New
            </button>
          </div>
          <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false })} ModalTitle="Add New Country">
            <Spin spinning={this.state.loading} tip="Please wait...">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formCountryName">
                  <Form.Label>
                    Country Name <span className="required">*</span>
                  </Form.Label>
                  <Form.Control type="text" required onChange={this.formChange} name="name" placeholder="Enter name" />
                </Form.Group>
                <Form.Group controlId="formUniqueID">
                  <Form.Label>
                    Unique Code <span className="required">*</span>
                  </Form.Label>
                  <Form.Control type="text" required onChange={this.formChange} name="code" placeholder="Enter code" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    Weekend 1 <span className="required">*</span>
                  </Form.Label>
                  <Form.Control as="select" required name="weekend1" onChange={this.formChange}>
                    <option value="" disabled selected hidden>
                      Choose...
                    </option>
                    {Days.map((item) => (
                      <option value={item.value}>{item.day}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    Weekend 2 <span className="required">*</span>
                  </Form.Label>
                  <Form.Control as="select" required name="weekend2" onChange={this.formChange}>
                    <option value="" disabled selected hidden>
                      Choose...
                    </option>
                    {Days.map((item) => (
                      <option value={item.value}>{item.day}</option>
                    ))}
                  </Form.Control>
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
          <ModalWrapper show={this.state.showEditModal} onHide={() => this.setState({ showEditModal: false })} ModalTitle="Edit Country">
            <Form onSubmit={this.onEditConfirm}>
              <Form.Group controlId="formDepartmentName">
                <Form.Label>
                  Country Name <span className="required">*</span>
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
                <Form.Label>
                  Unique Code <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  defaultValue={this.state.objEditable.code}
                  name="edited_code"
                  required
                  placeholder="Enter code"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Weekend 1 <span className="required">*</span>
                </Form.Label>
                <Form.Control as="select" required name="edited_weekend1" defaultValue={this.state.objEditable.weekend1} onChange={this.formChange}>
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  {Days.map((item) => (
                    <option value={item.value}>{item.day}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Weekend 2 <span className="required">*</span>
                </Form.Label>
                <Form.Control as="select" required name="edited_weekend2" defaultValue={this.state.objEditable.weekend2} onChange={this.formChange}>
                  <option value="" disabled selected hidden>
                    Choose...
                  </option>
                  {Days.map((item) => (
                    <option value={item.value}>{item.day}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </ModalWrapper>
          <hr></hr>
          <AgGridWrapper
            pagination={true}
            context={this.state.context}
            columnDefs={CountryMasterColumnDefs}
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
