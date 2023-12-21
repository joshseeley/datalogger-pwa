// src/ChartComponent.js
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ChartComponent = ({ sharedVariable, sharedLabel, dataArray, sharedTime, sharedTemp }) => {
  const [data, setData] = useState({
    labels: [sharedTime],
    datasets: [
      {
        label: "Temperature (C)",
        data: [sharedTemp],
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
      },
    ],
  });

  // data.datasets.forEach((dataset) => {
  //   dataset.data.push(dataArray[dataArray.length - 1].temp);
  // });

  // data.labels.push(dataArray[dataArray.length - 1].time);

  let test = JSON.stringify(sharedTemp);
  let test2 = JSON.stringify(sharedTime);
  
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // function addData(chart, label, data) {
  //   chart.data.labels.push(label);
  //   chart.data.datasets.forEach((dataset) => {
  //     dataset.data.push(data);
  //   });
  //   chart.update();
  // }

  return (
    <>
    <Container>
      <Row>
        <Col><Line data={data} options={options} /></Col>
      </Row>
    </Container>   
    <p>{test}</p> 
    <p>{test2}</p>
    </>
    
  );
};

export default ChartComponent;
