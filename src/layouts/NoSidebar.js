import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

const DefaultLayout = ({ children }) => (
  <Container fluid>
    <Row>
      <Col
        className="main-content p-0 mt-4"
        lg={{ size: 6, offset: 3}}
        md={{ size: 6, offset: 3}}
        sm="12"
        tag="main"
      >
        {children}
      </Col>
    </Row>
  </Container>
);

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default DefaultLayout;
