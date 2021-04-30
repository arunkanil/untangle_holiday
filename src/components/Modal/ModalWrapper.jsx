import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Modal } from "react-bootstrap";

class ModalWrapper extends Component {
  static get propTypes() {
    return {
      ModalTitle: PropTypes.any,
      show: PropTypes.bool,
      size: PropTypes.any,
      onHide: PropTypes.func,
    };
  }

  render() {
    const { children } = this.props;
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size={this.props.size}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.ModalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    );
  }
}

export default withRouter(ModalWrapper);
