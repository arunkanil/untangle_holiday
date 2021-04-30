import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Card, message, Select, Spin } from 'antd';
import { DateRenderer } from '../../components/Utils/DateRenderer';
import { ActionRenderer } from '../../components/Utils/StatusRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import AgGrid from '../../components/AGGrid/AgGridWrapper';
import { PublicHolidaysMasterColumnDefs } from '../../constants/columnMetadata';
import { PostAPICall, DeleteAPICall, GetAPICall } from '../../services/dataservice';
import { DELETE_PUBLICHOLIDAY, GET_COUNTRY, GET_PUBLICHOLIDAY, POST_PUBLICHOLIDAY } from '../../constants/urls';

const { Option } = Select;
const frameworkComponents = {
  statusRenderer: ActionRenderer,
  dateRenderer: DateRenderer,
};

export default class PublicHolidayMaster extends React.Component {
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
      fromDate: '',
      toDate: '',
      isRecurring: false,
      country: [],
      countryList: [],
      edited_name: '',
      edited_description: '',
      edited_date: '',
      edited_country: '',
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
    this.getPublicHolidays();
    this.getCountry();
  }
  async getPublicHolidays(value) {
    this.setState({ loading: true, loading1: false });
    let result = await GetAPICall(`${GET_PUBLICHOLIDAY}${value ? value : new Date().getFullYear()}&Sorting=date asc`);
    console.log(result, 'getPublicHolidays');
    this.setState({ rowData: result.result.items, loading: false });
  }
  async getCountry() {
    let result = await GetAPICall(GET_COUNTRY);
    console.log(result, 'country');
    this.setState({ countryList: result.result.items });
  }
  formChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  }
  async handleSubmit(e) {
    if (this.state.toDate >= this.state.fromDate) {
      this.setState({ loading: true });
      e.preventDefault();
      let formdata = {
        name: this.state.name,
        description: this.state.description,
        contryIds: this.state.country,
        isRecurring: this.state.isRecurring,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      };
      let result = await PostAPICall(POST_PUBLICHOLIDAY, formdata);
      console.log(result);
      if (result.success === true) {
        message.success('Holiday added successfully');
        this.setState({ showModal: false, loading: false });
        this.getPublicHolidays();
      } else {
        this.setState({ loading: false });
        message.error('Something went wrong');
      }
    } else {
      this.setState({ loading: false });
      message.error('From date must be lower than To date.');
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
    let result = await DeleteAPICall(DELETE_PUBLICHOLIDAY, this.state.deleteID);
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
    this.getPublicHolidays();
  }

  handleEdit(value) {
    this.setState({
      objEditable: value,
      showEditModal: true,
      edited_name: value.name,
      edited_description: value.description,
      edited_date: value.date,
      edited_country: value.contryId,
    });
  }
  async onEditConfirm(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    let payload = {
      name: this.state.edited_name,
      description: this.state.edited_description,
      contryId: this.state.edited_country,
      fromDate: this.state.edited_date,
      id: this.state.objEditable.id,
    };
    let result = await PostAPICall(POST_PUBLICHOLIDAY, payload);
    console.log(result);
    if (result.success === true) {
      message.success('Edited Successfully');
      this.setState({ showEditModal: false });
      this.getPublicHolidays();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  }
  yearRenderer() {
    let years = [];
    for (let i = 0; i < 100; i++) {
      years.push(<option value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</option>);
    }
    return years;
  }
  render() {
    return (
      <Spin spinning={this.state.loading} tip="Please wait...">
        <Card>
          <div className="page-heading">
            <h3>Public Holidays Per Country Master</h3>
            <button type="button" className="btn btn-outline-primary" onClick={() => this.setState({ showModal: true, loading: false })}>
              New
            </button>
          </div>
          <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false, loading: false })} ModalTitle="Add New Holiday">
            <Spin spinning={this.state.loading} tip="Please wait...">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>
                    Country <span className="required">*</span>
                  </Form.Label>
                  <Select
                    as="select"
                    name="country"
                    required
                    placeholder="Choose..."
                    mode="multiple"
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      // let value = Array.from(e.target.selectedOptions, (option) => option.value);
                      this.setState({ country: value });
                      console.log(value);
                    }}
                  >
                    {this.state.countryList.map((item) => (
                      <Option value={item.id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>
                    Date <span className="required">*</span>
                  </Form.Label>
                  <div className="row mx-0">
                    <input className="form-control col" type="date" placeholder="yyyy-mm-dd" required name="fromDate" onChange={this.formChange} />
                    <span className="mt-2 mx-2"> to </span>
                    <input
                      className="form-control col"
                      type="date"
                      placeholder="yyyy-mm-dd"
                      min={this.state.fromDate}
                      required
                      name="toDate"
                      onChange={this.formChange}
                    />
                  </div>
                </Form.Group>
                <Form.Group id="formGridCheckbox">
                  <Form.Check
                    type="checkbox"
                    name="isRecurring"
                    onChange={(e) => {
                      this.setState({ isRecurring: e.target.checked });
                    }}
                    label="Recurring holiday"
                  />
                </Form.Group>
                <Form.Group controlId="formDepartmentName">
                  <Form.Label>
                    Holiday Name <span className="required">*</span>
                  </Form.Label>
                  <Form.Control onChange={this.formChange} type="text" name="name" required placeholder="Enter name" />
                </Form.Group>
                <Form.Group controlId="formUniqueID">
                  <Form.Label>Description</Form.Label>
                  <Form.Control onChange={this.formChange} as="textarea" rows="2" name="description" placeholder="Enter description" />
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
          <ModalWrapper show={this.state.showEditModal} onHide={() => this.setState({ showEditModal: false })} ModalTitle="Edit Holiday">
            <Form onSubmit={this.onEditConfirm}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>
                  Country <span className="required">*</span>
                </Form.Label>
                <Form.Control as="select" name="edited_country" required defaultValue={this.state.objEditable.contryId} onChange={this.formChange}>
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
                  Date <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="yyyy-mm-dd"
                  required
                  name="edited_date"
                  defaultValue={this.state.objEditable.date?.slice(0, 10)}
                  onChange={this.formChange}
                />
              </Form.Group>
              <Form.Group controlId="formDepartmentName">
                <Form.Label>
                  Holiday Name <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  defaultValue={this.state.objEditable.name}
                  type="text"
                  required
                  name="edited_name"
                  placeholder="Enter name"
                />
              </Form.Group>
              <Form.Group controlId="formUniqueID">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={this.formChange}
                  defaultValue={this.state.objEditable.description}
                  as="textarea"
                  rows="2"
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
          <Form className="mb-2" inline onSubmit={this.handleSubmit}>
            <Form.Label className="my-1 mr-2" htmlFor="filter">
              Filter by year :
            </Form.Label>
            <Form.Control as="select" id="filter" class="form-control" onChange={(e) => this.getPublicHolidays(e.target.value)}>
              {this.yearRenderer()}
            </Form.Control>
          </Form>
          <AgGrid
            pagination={true}
            context={this.state.context}
            columnDefs={PublicHolidaysMasterColumnDefs}
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
