import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Card, message, Spin } from 'antd';
import { DateRenderer } from '../../components/Utils/DateRenderer';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import AgGrid from '../../components/AGGrid/AgGridWrapper';
import { InitiateCarryForwardColumnDefs } from '../../constants/columnMetadata';
import { PostAPICall, GetAPICall } from '../../services/dataservice';
import { GETLeaveTransferJobHistory, POSTLeaveTransferJobHistory } from '../../constants/urls';

const frameworkComponents = {
  dateRenderer: DateRenderer,
};

export default class InitiateCarryForward extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      loading: true,
      rowData: [],
      fromYear: '',
      toYear: '',
      context: { componentParent: this },
    };
  }
  async componentDidMount() {
    this.getCarryForward();
  }
  async getCarryForward() {
    let result = await GetAPICall(GETLeaveTransferJobHistory);
    console.log(result, 'getCarryForward');
    this.setState({ rowData: result.result.items, loading: false });
  }
  formChange = (event) => {
    const target = event.target;
    this.setState({ fromYear: parseInt(target.value), toYear: parseInt(target.value) + 1 });
    console.log(this.state);
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    let filter = this.state.rowData.filter((item) => item.fromYear == this.state.fromYear && item.toYear == this.state.toYear);
    console.log(filter);
    if (filter.length > 0) {
      let r = window.confirm('You already scheduled a task on this timeline. Are you sure to continue?');
      if (r == true) {
        this.createJob();
      }
    } else {
      let s = window.confirm('You are about to schedule a task. Are you sure to continue?');
      if (s == true) {
        this.createJob();
      }
    }
  };
  createJob = async (e) => {
    this.setState({ loading: true });
    let formdata = {
      fromYear: this.state.fromYear,
      toYear: this.state.toYear,
    };
    let result = await PostAPICall(POSTLeaveTransferJobHistory, formdata);
    console.log(result);
    if (result.success === true) {
      message.success('Task added successfully');
      this.setState({ showModal: false });
      this.getCarryForward();
    } else {
      message.error('Something went wrong');
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <Spin spinning={this.state.loading} tip="Please wait...">
        <Card>
          <div className="page-heading">
            <h3>Initiate Leave Carry Forward</h3>
            <button type="button" className="btn btn-outline-primary" onClick={() => this.setState({ showModal: true })}>
              New
            </button>
          </div>
          <ModalWrapper show={this.state.showModal} onHide={() => this.setState({ showModal: false })} ModalTitle="Schedule Carry Forward">
            <Spin spinning={this.state.loading} tip="Please wait...">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formLeaveType">
                  <Form.Label>
                    From year <span className="required">*</span>
                  </Form.Label>
                  <Form.Control onChange={this.formChange} as="select" required name="fromYear">
                    <option value="" disabled selected hidden>
                      Choose...
                    </option>
                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formUniqueID">
                  <Form.Label>
                    To year <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    disabled
                    onChange={this.formChange}
                    defaultValue={this.state.toYear}
                    required
                    name="toYear"
                    placeholder="Value will be added automatically"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Spin>
          </ModalWrapper>
          <hr></hr>
          <AgGrid
            pagination={true}
            context={this.state.context}
            columnDefs={InitiateCarryForwardColumnDefs}
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
