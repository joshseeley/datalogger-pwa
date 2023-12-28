// src/MyModule/MyModule.js
import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MyModule = ({
  sharedVariable,
  sharedVariableAmps,
  sharedVariableVolts,
  sharedVariableThrust,  
}) => {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <table className="table" responsive>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thrust (kg):</td>
                  <td id="thrust">{sharedVariableThrust}</td>
                </tr>
                <tr>
                  <td>Current (A)</td>
                  <td id="amps">{sharedVariableAmps}</td>
                </tr>
                <tr>
                  <td>Voltage (V)</td>
                  <td id="volts">{sharedVariableVolts}</td>
                </tr>
                <tr>
                  <td>Temperature (C)</td>
                  <td id="temp">{sharedVariable}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>

    </>
  );
};

export default MyModule;
