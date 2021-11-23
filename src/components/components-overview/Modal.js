import React from "react";
import { Button, Modal, ModalBody, ModalHeader, FormInput, Row, Col} from "shards-react";

export default class BasicModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: false,
      sowing: ""
    };
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }
  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { open, sowing } = this.state;
    const {save} = this.props;
    return (
      <div>
        <Button className="mt-3 mb-3" onClick={this.toggle}>Agregar siembra</Button>
        <Modal open={open} toggle={this.toggle}>
          <ModalHeader>Ingresa Nombre / Identificador de siembra </ModalHeader>
          <ModalBody className="text-center"> 
            <Row>
              <Col xs={12} md={9}>
                <FormInput onChange={this.handleChange} value={sowing} name="sowing"/> 
              </Col>
              <Col xs={12} md={2}>
                <Button theme="success" onClick={()=>{save(sowing); this.toggle()}}>Guardar</Button> 
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
