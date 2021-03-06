import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  FormInput,
  FormSelect,
} from "shards-react";
import AddSowingModal from '../components/components-overview/Modal';
import PageTitle from "../components/common/PageTitle";
import moment from 'moment'
import api from '../utils/api'
import '../assets/feedingOverview.css'
class FeedingOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bitacore: [],
      date: moment(),
      typesOfMedicines: [],
      typesOfAliments: [],
      user: this.props.user,
      watchingEmployee: this.props.user,
      canViewOthers: false,
      employees: [],
      sowings: [],
      sowing: null,
      cells: [
        "3x3x2",
        "4x4x2.5",
        "Redonda 10 diametro",
      ],
      providers:[
        "Fredy",
        "El Samoral",
        "Tlalixcoyan",
      ],
      cell: null,
      provider: null
    };
    this.mapColumns = this.mapColumns.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.loadDays = this.loadDays.bind(this);
    this.fetchLogbook = this.fetchLogbook.bind(this);
    this.save = this.save.bind(this);
    this.updateRowTotals = this.updateRowTotals.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onChangeProvider = this.onChangeProvider.bind(this);
    this.onChangeCell = this.onChangeCell.bind(this);
    this.onChangeSowing = this.onChangeSowing.bind(this);
    this.addSowing = this.addSowing.bind(this)
  }
  addSowing(sowingName){
    this.setState({sowing:sowingName},()=>this.fetchLogbook(true));
  }
  loadDays() {
    const { date } = this.state;
    const nrOfDays = date.daysInMonth()
    let initial = []
    for (let i = 0; i < nrOfDays; i++) {
      initial.push({
        dia: i + 1,
        "07:00": 0,
        "07:30": 0,
        "09:30": 0,
        "11:00": 0,
        "12:00": 0,
        "13:00": 0,
        "15:00": 0,
        "16:30": 0,
        cellNumbers: 0,
        totalPerDay: 0,
        numberOfAliment: "",
        medication: "",
        mortality: 0,
        observations: "",
      })
    }
    this.setState({ bitacore: initial })
  }
  async fetchLogbook(manualSowing=false) {
    const { date, watchingEmployee, sowing, provider, cell } = this.state;
    let month = date.format("M")
    let year = date.format("Y")
    const { data } = await api.getLogbook({
      month,
      year,
      employee: watchingEmployee.email,
      sowing: sowing === "" ? null : sowing,
      provider: provider === "" ? null : provider,
      cell: cell === "" ? null : cell
    })
    console.log({
      fetchedBy:{
        month,
        year,
        employee: watchingEmployee.email,
        sowing: sowing === "" ? null : sowing,
        provider: provider === "" ? null : provider,
        cell: cell === "" ? null : cell
      }
    })
    let { data: sowings } = await api.getLogbookSowings({
      month,
      year,
      employee: watchingEmployee.email,
      provider: provider === "" ? null : provider,
      cell: cell === "" ? null : cell
    })
    if(manualSowing){
      sowings.push({sowing:sowing});
    }
    this.setState({ sowings, sowing })
    if (!data) {
      console.log("loaded manually")
      this.loadDays();
    } else {
      console.log("loaded from db")
      this.loadFromLogbook(data.logbooks);
    }
  }
  async componentDidMount() {
    const { user } = this.state;
    const { data: admins } = await api.getUsersByRole({ role: 'Administrator' });
    const { data: warehouseSupervisors } = await api.getUsersByRole({ role: 'Warehouse' });
    const { data: typesOfAlimentsRaw } = await api.getProductsByCategory('alimento');
    const { data: typesOfMedicinesRaw } = await api.getProductsByCategory('medicina');
    const { values: typesOfAliments } = typesOfAlimentsRaw
    const { values: typesOfMedicines } = typesOfMedicinesRaw
    const isAdmin = admins.filter(admin => admin.email === user.email);
    const isSupervisor = warehouseSupervisors.filter(supervisor => supervisor.email === user.email);
    if (isAdmin.length > 0 || isSupervisor.length > 0) {
      const { data: employeesUnfiltered } = await api.getUsersByRole();
      // remove myself from employees
      const employees = employeesUnfiltered.filter(employee => employee.email !== user.email);
      this.setState({
        canViewOthers: true,
        employees,
        typesOfAliments,
        typesOfMedicines
      });
    } else{
      this.setState({
        typesOfAliments,
        typesOfMedicines
      });

    }
    await this.fetchLogbook();
  }

  async save() {
    const { date, bitacore, watchingEmployee, sowing, provider, cell } = this.state;
    let month = date.format("M")
    let year = date.format("Y")
    await api.saveLogbook({
      date: `${year}-${month}-01`,
      employee: watchingEmployee.email,
      logbooks: JSON.stringify(bitacore),
      sowing: sowing === "" ? null : sowing,
      provider: provider === "" ? null : provider,
      cell: cell === "" ? null : cell
    });
    alert("Guardado correctamente");
  }
  loadFromLogbook(logbooks) {
    let newLogbook = JSON.parse(logbooks);
    this.setState({ bitacore: newLogbook });
  }
  onChangeInput(e, row, column) {
    const { bitacore } = this.state;
    bitacore[row][column] = e.target.value;
    this.setState({ bitacore }, this.updateRowTotals(row))
  }
  async onChangeUser(e) {
    console.log(e.target.value);
    await this.setState({ watchingEmployee: JSON.parse(e.target.value) });
    await this.fetchLogbook()
  }
  async onChangeProvider(e) {
    await this.setState({ provider: e.target.value });
    await this.fetchLogbook()
  }
  async onChangeCell(e) {
    console.log(e.target.value);
    await this.setState({ cell: e.target.value });
    await this.fetchLogbook()
  }
  updateRowTotals(row) {
    let total = 0;
    const { bitacore } = this.state;
    const sumColumns = ["07:00", "07:30", "09:30", "11:00", "12:00", "13:00", "15:00", "16:30"];
    sumColumns.forEach(column => {
      total += Number(bitacore[row][column]);
    });
    bitacore[row].totalPerDay = Number(total * Number(bitacore[row].cellNumbers)).toFixed(2);
    this.setState({ bitacore });
  }
  previousMonth() {
    const { date } = this.state;
    date.subtract(1, 'month');
    this.setState({ date, sowing: null, provider:null, cell:null }, this.fetchLogbook)
  }
  nextMonth() {
    const { date } = this.state;
    date.add(1, 'month');
    this.setState({ date, sowing: null, provider:null, cell:null }, this.fetchLogbook)
  }
  mapColumns() {
    const { bitacore, typesOfAliments = [], typesOfMedicines = [] } = this.state;
    return (
      bitacore.map((bitacoreRow, index) => (
        <tr key={bitacoreRow.dia}>
          <td>{`${bitacoreRow.dia}`}</td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "07:00")} value={`${bitacoreRow["07:00"] !== 0 ? bitacoreRow["07:00"] : ''}`} placeholder={`${bitacoreRow["07:00"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "07:30")} value={`${bitacoreRow["07:30"] !== 0 ? bitacoreRow["07:30"] : ''}`} placeholder={`${bitacoreRow["07:30"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "09:30")} value={`${bitacoreRow["09:30"] !== 0 ? bitacoreRow["09:30"] : ''}`} placeholder={`${bitacoreRow["09:30"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "11:00")} value={`${bitacoreRow["11:00"] !== 0 ? bitacoreRow["11:00"] : ''}`} placeholder={`${bitacoreRow["11:00"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "12:00")} value={`${bitacoreRow["12:00"] !== 0 ? bitacoreRow["12:00"] : ''}`} placeholder={`${bitacoreRow["12:00"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "13:00")} value={`${bitacoreRow["13:00"] !== 0 ? bitacoreRow["13:00"] : ''}`} placeholder={`${bitacoreRow["13:00"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "15:00")} value={`${bitacoreRow["15:00"] !== 0 ? bitacoreRow["15:00"] : ''}`} placeholder={`${bitacoreRow["15:00"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "16:30")} value={`${bitacoreRow["16:30"] !== 0 ? bitacoreRow["16:30"] : ''}`} placeholder={`${bitacoreRow["16:30"]} kg`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} type="number" min="0" onChange={e => this.onChangeInput(e, index, "cellNumbers")} value={`${bitacoreRow.cellNumbers}`} /></td>
          <td><FormInput style={{ minWidth: "4em" }} onChange={e => this.onChangeInput(e, index, "totalPerDay")} value={`${bitacoreRow.totalPerDay}`} disabled /></td>
          <td>
            <FormSelect
              style={{ minWidth: "100px" }}
              value={`${bitacoreRow.numberOfAliment}`}
              onChange={e => this.onChangeInput(e, index, "numberOfAliment")}
            >
              <option></option>
              {typesOfAliments.map(alimentType => <option key={alimentType.id} value={alimentType.id}>{alimentType.nombre}</option>)}
            </FormSelect>
          </td>
          <td>
            <FormSelect
              style={{ minWidth: "100px" }}
              value={`${bitacoreRow.medication}`}
              onChange={e => this.onChangeInput(e, index, "medication")}
            >
              <option></option>
              {typesOfMedicines.map(medicine => <option key={medicine.id} value={medicine.id}>{medicine.nombre}</option>)}
            </FormSelect>
          </td>
          <td><FormInput type="number" onChange={e => this.onChangeInput(e, index, "mortality")} value={`${bitacoreRow.mortality}`} /></td>
          <td><FormInput onChange={e => this.onChangeInput(e, index, "observations")} value={`${bitacoreRow.observations}`} /></td>
        </tr>
      ))
    )
  }
  onChangeSowing(e) {
    console.log(e.target.value);
    this.setState({ sowing: e.target.value }, this.fetchLogbook);
  }
  render() {
    const { date, user, canViewOthers, employees, sowing, sowings, providers, cells, provider,cell } = this.state;
    return (
      <div>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle
              sm="4"
              title="Alimentaci??n"
              subtitle="Agenda de"
              className="text-sm-left"
            />
          </Row>

          <Row>

            <div className="col-md-12 col-centered" style={{ display: 'flex', justifyContent: 'center', flexWrap: "wrap", }}>
              <div className="col-centered" style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-primary mr-4 mb-2" onClick={this.previousMonth}>Anterior</button>
                {' '}
                <span className="pt-1" style={{ whiteSpace: 'nowrap', }} >{date.format('MMM-Y')}</span>
                {' '}
                <button className="btn btn-primary ml-4 mb-2" onClick={this.nextMonth}>Siguiente</button>
              </div>
              <div className="col-centered" style={{ display: 'flex', justifyContent: 'center', }}></div>
              <button className="btn btn-success ml-4 mr-4 mb-2" onClick={this.save}>Guardar</button>
            </div>
            <div className="col-md-12 ml-3 mr-3 mb-2 col-centered user-selector">
              <div style={{ display: 'inline-flex', justifyContent: 'space-evenly', }}>
                {canViewOthers ? (
                  <FormSelect
                    className="mr-4"
                    onChange={this.onChangeUser}
                  >
                    <option value={JSON.stringify(user)}>{user.name}</option>
                    {employees.map(employee => <option key={employee.email} value={JSON.stringify(employee)}>{employee.name}</option>)}
                  </FormSelect>
                ) : null}
                
               
                
              </div>
            </div>
            <div className="col-md-12 ml-3 mr-3 mb-2 col-centered user-selector">

              <div style={{ display: 'inline-flex', justifyContent: 'space-evenly', }}>
                <div className="ml-2 mr-2">
                  <label>Proveedor</label>
                  <FormSelect
                    onChange={this.onChangeProvider}
                    >
                    <option value=" " selected={provider===null}></option>

                    {providers.map(Provider => <option key={Provider} value={Provider}>{Provider ? Provider: ''}</option>)}
                  </FormSelect>
                  <label>Identificador de jaula</label>
                  <FormSelect
                    onChange={this.onChangeCell}
                    >
                    <option value="" selected={cell===null}></option>

                    {cells.map(cell => <option key={cell} value={cell}>{cell ? cell: 'Por defecto'}</option>)}
                  </FormSelect>
                  <label>Identificador de siembra</label>
                  <FormSelect
                    value={sowing ? (sowing.sowing ? sowing.sowing : sowing): 'Por defecto'}
                    onChange={this.onChangeSowing}
                  >
                    <option value=""></option>
                    {sowings.map(sowingU => <option key={sowingU.sowing} value={sowingU.sowing}>{sowingU.sowing ? sowingU.sowing: 'Por defecto'}</option>)}
                  </FormSelect>
                  <AddSowingModal save={this.addSowing}/>
              </div>
                </div>
                
            </div>
            <Col className="mb-4">
              <Card small style={{ overflowX: "scroll" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">dia</th>
                      <th scope="col">07:00</th>
                      <th scope="col">07:30</th>
                      <th scope="col">09:30</th>
                      <th scope="col">11:00</th>
                      <th scope="col">12:00</th>
                      <th scope="col">13:00</th>
                      <th scope="col">15:00</th>
                      <th scope="col">16:30</th>
                      <th scope="col"># de jaulas</th>
                      <th scope="col">Total por d??a (kg)</th>
                      <th scope="col"># de alimento</th>
                      <th scope="col">medicamento</th>
                      <th scope="col">mortalidad</th>
                      <th scope="col">observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.mapColumns()}
                  </tbody>
                </table>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default FeedingOverview;
