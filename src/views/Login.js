import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import LoginComponent from "../components/login";
const Login = () => (
  <Container fluid className="main-content-container px-4">
    {/* Default Light Table */}
    <Row>
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Iniciar sesión</h6>
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
