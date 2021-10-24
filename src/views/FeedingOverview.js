import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import moment from 'moment'
import api from '../utils/api'
class FeedingOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bitacore: [],
      date: moment(),
    };
    this.mapColumns = this.mapColumns.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.loadDays = this.loadDays.bind(this);
    this.fetchLogbook = this.fetchLogbook.bind(this);
    this.save = this.save.bind(this);
  }
  loadDays(){
    const { date } = this.state;
    const nrOfDays = date.daysInMonth()
    let initial = []
    for (let i = 0; i < nrOfDays; i++) {
      initial.push({
        dia: i + 1,
        "07:00": "",
        "12:00": "",
        "15:00": "",
        totalPerDay: 0,
        numberOfAliment: 0,
        cellNumber: 0,
        medication: "",
        mortality: 0,
        observations: ""
      })
    }
    this.setState({ bitacore: initial })
  }
  async fetchLogbook(){
    const {date} = this.state;
    const {user} = this.props;
    let month = date.format("M") 
    let year = date.format("Y")

    const {data} = await api.getLogbook({
      month,
      year,
      employee: user.email
    })
    if(!data){
      console.log("loaded manually")
      this.loadDays();
    } else {
      console.log("loaded from db")
      this.loadFromLogbook(data.logbooks);
    }
  }
  async componentDidMount() {
   await this.fetchLogbook();
  }

  async save(){
    const {date, bitacore} = this.state;
    const {user} = this.props;
    let month = date.format("M") 
    let year = date.format("Y")
    await api.saveLogbook({
      date:`${year}-${month}-01`,
      employee: user.email,
      logbooks: JSON.stringify(bitacore)
    });
  }
  loadFromLogbook(logbooks){
    let newLogbook = JSON.parse(logbooks);
    this.setState({bitacore:newLogbook});
  }
  onChangeInput(e, row, column) {
    const { bitacore } = this.state;
    bitacore[row][column] = e.target.value;
    this.setState({ bitacore })
  }
  previousMonth(){
    const {date} = this.state;
    date.subtract(1,'month');
    this.setState({date}, this.fetchLogbook)
  }
  nextMonth(){
    const {date} = this.state;
    date.add(1,'month');
    this.setState({date}, this.fetchLogbook)
  }
  mapColumns() {
    const { bitacore } = this.state;
    return (
      bitacore.map((bitacoreRow, index) => (
        <tr key={bitacoreRow.dia}>
          <td>{`${bitacoreRow.dia}`}</td>
          <td><input onChange={e => this.onChangeInput(e, index, "07:00")} value={`${bitacoreRow["07:00"]}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "12:00")} value={`${bitacoreRow["12:00"]}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "15:00")} value={`${bitacoreRow["15:00"]}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "totalPerDay")} value={`${bitacoreRow.totalPerDay}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "numberOfAliment")} value={`${bitacoreRow.numberOfAliment}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "cellNumber")} value={`${bitacoreRow.cellNumber}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "medication")} value={`${bitacoreRow.medication}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "mortality")} value={`${bitacoreRow.mortality}`} /></td>
          <td><input onChange={e => this.onChangeInput(e, index, "observations")} value={`${bitacoreRow.observations}`} /></td>
        </tr>
      ))
    )
  }
  render() {
    const {date} = this.state;
    return (
      <div>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle
              sm="4"
              title="Alimentación"
              subtitle="Agenda de"
              className="text-sm-left"
            />
          </Row>

          <Row>

         <div class="col-md-12 col-centered " style={{display: 'flex', justifyContent: 'center'}}>
            <button class="btn btn-primary mr-4 mb-2"  onClick={this.previousMonth}>Anterior</button>
            {' '}
            <span className="pt-1">{date.format('MMM-Y')}</span>
            {' '}
            <button class="btn btn-primary ml-4 mb-2" onClick={this.nextMonth}>Siguiente</button>

            <button class="btn btn-success ml-4 mb-2"  onClick={this.save}>Guardar</button>

          </div>

            <Col className="mb-4">
              <Card small style={{ overflowX: "scroll" }}>
                <table className="table">
                  <thead>
                    <th scope="col">dia</th>
                    <th scope="col">07:00</th>
                    <th scope="col">12:00</th>
                    <th scope="col">15:00</th>
                    <th scope="col">Total por día</th>
                    <th scope="col"># de alimento</th>
                    <th scope="col"># de jaula</th>
                    <th scope="col">medicamento</th>
                    <th scope="col">mortalidad</th>
                    <th scope="col">observaciones</th>
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
