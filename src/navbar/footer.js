import React from "react";
import { Col, Row } from "react-bootstrap";

const Footer = () => (
  <Row
    style={{
      bottom: "0",
      margin: 0,  
      padding: "20px",
      backgroundColor: "#111827",
      width: '100%'
    }}
  >
    
    

    <Col xs="12" md="12" lg="6" className="text-center">
      <div style={{ color: "#fff" }}>
        © 2022 Copyright:{" "}
        <a
          href="https://swaroopmaddu.github.io/"
          target={'_blank'}
          style={{ color: "#fff" }} rel="noreferrer"
        >
          Katashi
        </a>
      </div>
    </Col>
  </Row>
);

export default Footer;
