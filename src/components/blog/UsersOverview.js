import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Row, Col, Card,
  CardHeader, CardBody, Button,
  InputGroup, DatePicker, InputGroupAddon, InputGroupText,
  FormSelect,
} from "shards-react";
import moment from 'moment';
import FileDownload from 'js-file-download'
import Chart from "../../utils/chart";
import api from '../../utils/api';
import "../../assets/range-date-picker.css";
class UsersOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: undefined,
      user: this.props.user,
      watchingEmployee: this.props.user,
      employees: [],
      canViewOthers: false

    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.checkPermissions = this.checkPermissions.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.canvasRef = React.createRef();
  }

  async componentDidMount() {
    const chartOptions = {
      ...{
        responsive: true,
        legend: {
          position: "top"
        },
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3
          },
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              ticks: {
                callback(tick, index) {
                  // Jump every 7 values on the X axis labels to avoid clutter.
                  return index % 7 !== 0 ? "" : tick;
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 45,
                callback(tick) {
                  if (tick === 0) {
                    return tick;
                  }
                  // Format the amounts using Ks for thousands.
                  return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                }
              }
            }
          ]
        },
        hover: {
          mode: "nearest",
          intersect: false
        },
        tooltips: {
          custom: false,
          mode: "nearest",
          intersect: false
        }
      },
      ...this.props.chartOptions
    };

    const BlogUsersOverview = new Chart(this.canvasRef.current, {
      type: "LineWithLine",
      data: this.props.chartData,
      options: chartOptions
    });

    // They can still be triggered on hover.
    const buoMeta = BlogUsersOverview.getDatasetMeta(0);
    buoMeta.data[0]._model.radius = 0;
    buoMeta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0;
    await this.checkPermissions();
    // Render the chart.
    BlogUsersOverview.render();
  }
  async checkPermissions(){
    const { user } = this.state;
    const { data: admins } = await api.getUsersByRole({ role: 'Administrator' });
    const { data: warehouseSupervisors } = await api.getUsersByRole({ role: 'Warehouse' });
    const isAdmin = admins.filter(admin => admin.email === user.email);
    const isSupervisor = warehouseSupervisors.filter(supervisor => supervisor.email === user.email);
    if (isAdmin.length > 0 || isSupervisor.length > 0) {
      const { data: employeesUnfiltered } = await api.getUsersByRole();
      // remove myself from employees
      const employees = employeesUnfiltered.filter(employee => employee.email !== user.email);
      this.setState({ 
        canViewOthers: true, 
        employees, 
      });
    }
  }
  handleStartDateChange(value) {
    this.setState({
      ...this.state,
      ...{ startDate: moment(value).startOf('month').toDate() }
    });
  }
  async generateReport(){
    const {startDate, watchingEmployee } = this.state;
    try{
      const month = moment(startDate).format('M');
      const year = moment(startDate).format('Y');
      const {data} = await api.exportLogbook({
        month,
        year,
        employee: watchingEmployee.email
      })
      FileDownload(data, `${year}-${month}-${watchingEmployee.name}-bitacora.xlsx`);
    } catch (error){
      if(error.response){
        if(error.response.statusText === "Not Found"){
          alert("Sin registro de la bitacora de usuario en el periodo: "+moment(startDate).format('Y MMM'));
        }
      }
    }

  }
  async  onChangeUser(e){
    await this.setState({watchingEmployee: JSON.parse(e.target.value)});
  }
  render() {
    const { title, className, user} = this.props;
    const {canViewOthers, employees} = this.state;
    const classes = classNames(className, "d-flex", "my-auto", "date-range");
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Row className="border-bottom py-2 bg-light">
            <Col sm="6" className="d-flex mb-2 mb-sm-0">
              <InputGroup className={classes}>
                <DatePicker
                  size="sm"
                  selected={this.state.startDate}
                  onChange={this.handleStartDateChange}
                  placeholderText="Select month"
                  dropdownMode="select"
                  className="text-center"
                />
                <InputGroupAddon type="append">
                  <InputGroupText>
                    <i className="material-icons">&#xE916;</i>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {canViewOthers ? (
                  <FormSelect
                  onChange={this.onChangeUser}
                  >
                    <option value={JSON.stringify(user)}>{user.name}</option>
                    {employees.map(employee => <option key={employee.email} value={JSON.stringify(employee)}>{employee.name}</option>)}
                  </FormSelect>
                ) : null}
            </Col>
            <Col>
              <Button
                onClick={()=>this.generateReport()}
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                Generar reporte &rarr;
              </Button>
            </Col>
          </Row>
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
          />
        </CardBody>
      </Card>
    );
  }
}

UsersOverview.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
};

UsersOverview.defaultProps = {
  title: "Comparativa mensual de tilapias",
  chartData: {
    labels: Array.from(new Array(30), (_, i) => (i === 0 ? 1 : i)),
    datasets: [
      {
        label: "Mes actual",
        fill: "start",
        data: [
          500,
          800,
          320,
          180,
          240,
          320,
          230,
          650,
          590,
          1200,
          750,
          940,
          1420,
          1200,
          960,
          1450,
          1820,
          2800,
          2102,
          1920,
          3920,
          3202,
          3140,
          2800,
          3200,
          3200,
          3400,
          2910,
          3100,
          4250
        ],
        backgroundColor: "rgba(0,123,255,0.1)",
        borderColor: "rgba(0,123,255,1)",
        pointBackgroundColor: "#ffffff",
        pointHoverBackgroundColor: "rgb(0,123,255)",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 3
      },
      {
        label: "Mes pasado",
        fill: "start",
        data: [
          380,
          430,
          120,
          230,
          410,
          740,
          472,
          219,
          391,
          229,
          400,
          203,
          301,
          380,
          291,
          620,
          700,
          300,
          630,
          402,
          320,
          380,
          289,
          410,
          300,
          530,
          630,
          720,
          780,
          1200
        ],
        backgroundColor: "rgba(255,65,105,0.1)",
        borderColor: "rgba(255,65,105,1)",
        pointBackgroundColor: "#ffffff",
        pointHoverBackgroundColor: "rgba(255,65,105,1)",
        borderDash: [3, 3],
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 2,
        pointBorderColor: "rgba(255,65,105,1)"
      }
    ]
  }
};

export default UsersOverview;
