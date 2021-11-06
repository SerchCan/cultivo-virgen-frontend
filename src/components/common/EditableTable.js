import React, { Component } from "react"
import api from '../../utils/api';
import { AiOutlineEdit, AiTwotoneSave } from 'react-icons/ai';
import { FiTrash } from 'react-icons/fi';
import { TiCancel } from 'react-icons/ti';
import { IoIosAddCircleOutline } from 'react-icons/io';

class EditableTable extends Component {
  // endpoints 
  // fetchEndpoint
  // fetchParams

  // Funciones
  // onSaveEndpoint
  // onEditEndpoint
  // onDeleteEndpoint
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      columns: [],
      totalOfRecords: 0,
      limit: 10,
      page: 1,
      editedIds: [],
      search:""
    }
    this.fetchFromApi = this.fetchFromApi.bind(this);
    this.mapColumns = this.mapColumns.bind(this);
    this.mapValues = this.mapValues.bind(this);
    this.normalRow = this.normalRow.bind(this);
    this.editedRow = this.editedRow.bind(this);
    this.addActions = this.addActions.bind(this);
    this.addToEditedIds = this.addToEditedIds.bind(this);
    this.addActionsWhenEditing = this.addActionsWhenEditing.bind(this);
    this.RemoveFromEditList = this.RemoveFromEditList.bind(this);
    this.onChangeEditingField = this.onChangeEditingField.bind(this);
    this.addRow = this.addRow.bind(this);
    this.searchEndpoint = this.searchEndpoint.bind(this);
    this.dynamicSearch = this.dynamicSearch.bind(this);
    
    
  }
  async componentDidMount() {
    // do fetch in here ....
    const { isEmptyTable } = this.props;
    if (!isEmptyTable) {
      await this.fetchFromApi()
    } else {
      const { columns } = this.props;
      this.setState({ columns: columns })
    }
  }
  async fetchFromApi() {
    const { data } = await api.getFromEndpoint(this.props.fetchEndpoint);
    this.setState(data)

  }
  mapColumns() {
    const { columns } = this.state;
    return (
      <tr>
        {
          columns.map(column => <th key={column} scope="col" className="border-0"> {column} </th>)
        }
        {/* disable if not admin */}
        <th>Actions</th>
      </tr>
    );
  }

  mapValues() {
    const { values = [], columns, editedIds } = this.state;

    return (
      values.map(value => {

        return editedIds.includes(value.id)
          ? this.editedRow(value, columns) : this.normalRow(value, columns)
      }
      ));
  }
  normalRow(value, columns) {
    return (
      <tr key={`id-${value.id}`}>
        {
          columns.map(column => <td key={column}> {value[column]} </td>)
        }
        {/* add actions disable if not admin*/}

        {this.addActions(value.id)}
      </tr>
    )
  }
  editedRow(value, columns) {
    return (
      <tr key={`id-${value.id}`}>
        {
          columns.map(column => column === 'id' ?
            <td key={column}> {value[column]}</td>
            : <td key={column}>
              <input
                value={value[column]}
                size={10}
                onChange={e => this.onChangeEditingField(e, value.id, column)}
              />
            </td>)
        }
        {/* add actions disable if not admin*/}

        {this.addActionsWhenEditing(value.id)}
      </tr>
    )
  }

  addActions(id) {
    return <td>
      <button className="btn btn-info p-1" onClick={() => this.addToEditedIds(id)}><AiOutlineEdit size={24} ></AiOutlineEdit></button>{' '}
      <button className="btn btn-danger p-1" onClick={() => this.onRemoveEndpoint(id)}><FiTrash size={24} ></FiTrash></button>
    </td>
  }
  addActionsWhenEditing(id) {
    return <td>
      <button className="btn btn-success p-1" onClick={async () => await this.onEditEndpoint(id)}><AiTwotoneSave size={24} /></button>{' '}
      <button className="btn btn-danger p-1" onClick={() => this.RemoveFromEditList(id)}><TiCancel size={24} /></button>
    </td>
  }
  async searchEndpoint(){
    const {search} = this.state;
    const {data} = await api.getFromEndpoint(`${this.props.searchEndpoint}/${search}`);
    this.setState(data);
  }
  async onRemoveEndpoint(id) {
    const valueIndex = this.state.values.findIndex((value) => value.id === id);
    await api.deleteFromEndpoint(`${this.props.onDeleteEndpoint}/${id}`, this.state.values[valueIndex])
    if (!this.props.isEmptyTable) {
      await this.fetchFromApi()
    }
  }
  async onEditEndpoint(id) {
    const valueIndex = this.state.values.findIndex((value) => value.id === id);
    await api.putFromEndpoint(`${this.props.onEditEndpoint}/${id}`, this.state.values[valueIndex])
    this.RemoveFromEditList(id);
  }
  async RemoveFromEditList(selectedId) {
    let { editedIds } = this.state;
    let filter = editedIds.filter(id => id !== selectedId);
    this.setState({ editedIds: filter })
    if (!this.props.isEmptyTable) {
      await this.fetchFromApi()
    }
  }
  addToEditedIds(id) {
    let { editedIds } = this.state;
    editedIds.push(id);
    this.setState({ editedIds });
  }
  onChangeEditingField(event, idOnEdit, column) {
    let { values } = this.state;
    let searchIndx = values.findIndex(value => value.id === idOnEdit)
    values[searchIndx][column] = event.target.value;
    this.setState({ values })
  }
  addRow() {
    const { columns } = this.state;
    let { values } = this.state;

    if (
      values.filter(value => value.id === 0).length > 0
    ) {
      return; // user is adding, do not load more fields.
    }
    let obj = {}
    columns.forEach(column => {
      obj[column] = "";
    });
    obj.id = 0; // zero will be the flag for ADD on api
    values.unshift(obj);
    this.addToEditedIds(0);
  }
  dynamicSearch(e){
    this.setState({search:e.target.value});
    if(e.target.value!==''){
      this.searchEndpoint(e.target.value);
    } else {
      this.fetchFromApi();
    }
  }
  render() {
    const {search} = this.state;
    return (
      <div className="container " style={{ overflowY: "hidden", overflowX: "scroll" }}>
        {this.props.searchEndpoint ? (
          <div className="col-xs-12">
            <input name="search" value={search} onChange={this.dynamicSearch} />

          </div>
        ) : ""
        }

        <div className="container-fluid text-right mt-3 mb-3">
          <button className="btn btn-info pl-3 pr-3 pt-1 pb-1" onClick={() => this.addRow()}><IoIosAddCircleOutline size={24} /> </button>
        </div>
        <table className="table mb-0">
          <thead className="bg-light">
            {this.mapColumns()}
          </thead>
          <tbody>
            {this.mapValues()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default EditableTable;