// src/ChartComponent.js
import React from "react";
import { Line } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ChartPower = ({  
  sharedTime,
  sharedThrust,
  sharedVolts,
  sharedAmps,
}) => {
  const data = {
    labels: sharedTime,
    datasets: [
      {
        label: "Thrust (lbs)",
        data: sharedThrust,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        pointRadius: 0, // Set point radius to 0 to hide data points
        pointHoverRadius: 0, // Set hover radius to 0 to hide data points on hover
      },
      {
        label: "Amps",
        data: sharedAmps,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        pointRadius: 0, // Set point radius to 0 to hide data points
        pointHoverRadius: 0, // Set hover radius to 0 to hide data points on hover
      },
      {
        label: "Volts",
        data: sharedVolts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        pointRadius: 0, // Set point radius to 0 to hide data points
        pointHoverRadius: 0, // Set hover radius to 0 to hide data points on hover
      },
    ],
    
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: true
  };

  return (
    <>
      <Container
      style={{
        height: "80vh", // Set a fixed or percentage height
        width: "80vw",  // Set a fixed or percentage width
      }}
      >
        <Row>
          <Col>
            <Line data={data} options={options} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChartPower;
