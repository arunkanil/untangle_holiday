import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
// import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { withRouter } from 'react-router';

// /**
//  * Grid View Layout
//  * @param {AgGridReact} : Ag-grid view component
//  * @param {columnDefs} : To display all columns title
//  * @param {animateRows} : Row animations
//  * @param {rowData} : Row data content
//  * @param {pagination} : If pagination need to be applied or not
//  * @param {paginationPageSize} : Size of each page
//  * @param {suppressRowClickSelection} : Click anywhere on row to select
//  * @param {onGridReady} : Event fires on grid ready
//  * @param {rowSelection} : Event fires on row selection
//  * @param {onSelectionChanged} : Event fires on row selection changed
//  * @param {onRowClickPath} : Event fires on row selection changed
//  * @param {suppressCellSelection} : If true, cells won't be selectable.
//  */

let AgGridViewConfig = {
  height: '500px',
  width: '100%',
  paginationPageSize: 10,
};
class AgGrid extends Component {
  static get propTypes() {
    return {
      columnDefs: PropTypes.any,
      context: PropTypes.any,
      animateRows: PropTypes.bool,
      rowData: PropTypes.any,
      pagination: PropTypes.bool,
      suppressRowClickSelection: PropTypes.bool,
      onGridReady: PropTypes.func,
      rowSelection: PropTypes.any,
      onSelectionChanged: PropTypes.func,
      suppressCellSelection: PropTypes.bool,
      onRowClickPath: PropTypes.string,
    };
  }

  //Sets grid API's when grid is ready
  //!used to resize the columns after the grid has been rendered
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  onPaginationChanged = () => {
    console.log('inner click');
    this.props.onPaginationChanged(this.gridApi,AgGridViewConfig);
  };
  render() {
    return (
      <div
        className="table-responsive table-bordered table table-hover table-bordered results ag-theme-alpine gridViewDisplay"
        style={{
          height: AgGridViewConfig.height,
          width: AgGridViewConfig.width,
        }}
      >
        <AgGridReact
          columnDefs={this.props.columnDefs}
          animateRows={true}
          rowData={this.props.rowData}
          pagination={this.props.pagination}
          // onPaginationChanged={this.onPaginationChanged}
          paginationPageSize={AgGridViewConfig.paginationPageSize}
          suppressCellSelection={this.props.suppressCellSelection}
          onGridReady={this.onGridReady}
          frameworkComponents={this.props.frameworkComponents}
          onRowClicked={this.props.onRowClicked}
          context={this.props.context}
          onSelectionChanged={this.props.onSelectionChanged}
        ></AgGridReact>
      </div>
    );
  }
}

export default withRouter(AgGrid);
