// About.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const About = () => (
  <>
  <Container>
      <Row>
        <Col>       
    <h2>About</h2>
    <p>This app connects to the PIM test box and initializes a data stream.</p>
    <p>Disconnect will terminate the data stream. </p>
    <p>The download button will create a csv of the totalized data set from connection. </p>

        </Col>
      </Row>
    </Container>      
  </>
  
  
);

export default About;
