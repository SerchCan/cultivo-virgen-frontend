import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import EditableTable from '../components/common/EditableTable'
const Tables = () => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Inventario"  className="text-sm-left" />
    </Row>

    {/* Default Light Table */}
    <Row>
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Artículos en almacén</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <EditableTable
              searchEndpoint="product/find"
              fetchEndpoint="product/find" 
              onEditEndpoint="product/edit" 
              onDeleteEndpoint= "product/remove"
            ></EditableTable>
          </CardBody>
        </Card>
      </Col>
    </Row>

  </Container>
);

export default Tables;
