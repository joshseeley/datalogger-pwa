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
    <p>General info: This app connects to the PIM test box and initializes a data stream. The app contains various graphs and and a page displaying all data. </p>
    <p>Connection: Ensure bluetoth is enabled on phone or pc. After clicking connect, data will be streamind once the "Notifications started..." status is displayed. Disconnect will terminate the data stream. </p>
    <p>Download data: The download button will create a csv of the totalized data set from time of initial connection. </p>

        </Col>
      </Row>
    </Container>      
  </>
  
  
);

export default About;
