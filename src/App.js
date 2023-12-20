import React, { useState } from "react";

import "./App.css";
import Connect from "./components/Connect";
import MyModule from "./components/MyModule";
import About from "./components/About";
import { Route, Routes, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Image from "./images/icon.png";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import ChartComponent from "./components/ChartComponent";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

Chart.register(CategoryScale);

function App() {
  const [sharedVariable, setSharedVariable] = useState(5);
  const [sharedVariableVolts, setSharedVariableVolts] = useState(5);
  const [sharedVariableAmps, setSharedVariableAmps] = useState(5);
  const [sharedVariableThrust, setSharedVariableThrust] = useState(5);
  const [sharedLabel, setSharedLabel] = useState("");

  const updateSharedVariable = (
    newValue,
    newVolts,
    newAmps,
    newThrust,
    newLabel
  ) => {
    setSharedVariable(newValue);
    setSharedVariableVolts(newVolts);
    setSharedVariableAmps(newAmps);
    setSharedVariableThrust(newThrust);
    setSharedLabel(newLabel);
  };

  return (
    <>
      
        <Container fluid>
          <Navbar expand="lg" className="bg-body-tertiary">
            
              <Navbar.Brand href="#home">
                <img 
                  src={Image}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>Connect</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/data">
                  <Nav.Link>Data</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/graph">
                  <Nav.Link>Graph</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/about">
                  <Nav.Link>About</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>

        <Routes>
          <Route
            path="/"
            element={
              <Connect
                sharedVariable={sharedVariable}
                updateSharedVariable={updateSharedVariable}
              />
            }
          />
          <Route
            path="/data"
            element={
              <MyModule
                sharedVariable={sharedVariable}
                sharedVariableAmps={sharedVariableAmps}
                sharedVariableVolts={sharedVariableVolts}
                sharedVariableThrust={sharedVariableThrust}
                updateSharedVariable={updateSharedVariable}
              />
            }
          />
          <Route
            path="/graph"
            element={
              <ChartComponent
                sharedVariable={sharedVariable}
                sharedLabel={sharedLabel}
              />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      
      {/* <p>{sharedVariable}</p>
      <p>{sharedVariableThrust}</p>
      <p>{sharedVariableVolts}</p>
      <p>{sharedVariableAmps}</p> */}
    </>
  );
}

export default App;
