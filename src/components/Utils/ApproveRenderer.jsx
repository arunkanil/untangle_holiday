import React, { Component } from "react";
import edit from "../../images/approval.svg";

export class ApproveRenderer extends Component {
  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit = () => {
    this.props.context.componentParent.handleEdit(this.props.node.data);
  };

  onRowClicked(event) {
    console.log("Row selected methord.....!!", event);
    console.log("Row selected methord (Obj).....!!", event.data);
    // this.props.history.push({ pathname: this.props.onRowClickPath, state:{id :event.data.id} })
  }
  render() {
    return (
      <>
        <a
          data-toggle="modal"
          data-target="#editModal"
          onClick={this.onEdit}
        >
          <img
            src={edit}
            style={{ width: "20px", cursor: "pointer" }}
            alt="delete"
          />
        </a>
      </>
    );
  }
}
