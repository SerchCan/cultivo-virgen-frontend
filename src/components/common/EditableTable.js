import React, { Component } from "react"


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
  }
  componentDidMount() {
    // do fetch in here ....
    const { isEmptyTable } = this.props;
    if (!isEmptyTable) {
      this.fetchFromApi()
    } else {
      const { columns } = this.props;
      this.setState({ columns: columns })
    }
  }
  fetchFromApi() {
    const dummyResponse = {
      values: [
        { id: 1, a: "Hola", b: "que", c: "onda1" },
        { id: 2, a: "Hola", b: "que", c: "onda2" },
        { id: 3, a: "Hola", b: "que", c: "onda3" },
        { id: 4, a: "Hola", b: "que", c: "onda4" },
        { id: 5, a: "Hola", b: "que", c: "onda5" },
        { id: 6, a: "Hola", b: "que", c: "onda6" },
      ],
      columns: [
        "id", "a", "b", "c"
      ],
      totalOfRecords: 100
    }
    this.setState(dummyResponse)

  }
  mapColumns() {
    const { columns } = this.state;
    return (
      <tr>
        {
          columns.map(column => <th key={column} scope="col" className="border-0"> {column} </th>)
        }
        {/* disable if not admin */}
        <td>Actions</td>
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
      <button onClick={() => this.addToEditedIds(id)}>edit</button>{' '}
      <button>remove</button>
    </td>
  }
  addActionsWhenEditing(id) {
    return <td>
      <button onClick={() => this.onEditEndpoint(id)}>Save</button>{' '}
      <button onClick={() => this.RemoveFromEditList(id)}>Cancel</button>
    </td>
  }
  RemoveFromEditList(selectedId) {
    let { editedIds } = this.state;
    let filter = editedIds.filter(id => id != selectedId);
    this.setState({ editedIds: filter })
    this.fetchFromApi();
  }
  addToEditedIds(id) {
    let { editedIds } = this.state;
    editedIds.push(id);
    this.setState({ editedIds });
  }
  onChangeEditingField(event, idOnEdit, column) {
    let { values } = this.state;
    let searchIndx = values.findIndex(value => value.id == idOnEdit)
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
  render() {

    return (
      <div>
        <button className="btn btn-info" onClick={() => this.addRow()}> Agregar </button>
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