import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import LoginComponent from "../components/login";
import "../assets/login.css"
const Login = () => (
  <Container fluid className="main-content-container px-4 col-md-6">
    {/* Default Light Table */}
    <Row className="vertical-center">
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0 text-center">Iniciar sesión</h6>
          </CardHeader>
          <CardBody className="p-4">
            <LoginComponent/>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Login;
