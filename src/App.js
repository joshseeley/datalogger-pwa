import React, { useState, useEffect } from "react";

import "./App.css";
import MyModule from "./components/MyModule";
import About from "./components/About";
import Connect from "./components/Connect";

import { Route, Routes } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Image from "./images/icons8.png";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import ChartComponent from "./components/ChartComponent";
import ChartPower from "./components/ChartPower";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

import "bootstrap/dist/css/bootstrap.min.css";

Chart.register(CategoryScale);

function App() {
  const [sharedVariable, setSharedVariable] = useState(0);
  const [sharedVariableVolts, setSharedVariableVolts] = useState(0);
  const [sharedVariableAmps, setSharedVariableAmps] = useState(0);
  const [sharedVariableThrust, setSharedVariableThrust] = useState(0);
  const [sharedTemp, setSharedTemp] = useState([]);
  const [sharedTime, setSharedTime] = useState([]);
  const [sharedThrust, setSharedThrust] = useState([]);
  const [sharedAmps, setSharedAmps] = useState([]);
  const [sharedVolts, setSharedVolts] = useState([]);

  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const [isContainerVisible, setIsContainerVisible] = useState(true);



  const updateSharedVariable = (newValue, newVolts, newAmps, newThrust) => {
    setSharedVariable(newValue);
    setSharedVariableVolts(newVolts);
    setSharedVariableAmps(newAmps);
    setSharedVariableThrust(newThrust);
  };

  const [thrustState, setThrustState] = useState(0);
  const [currentState, setCurrentState] = useState(0);
  const [voltageState, setVoltageState] = useState(0);
  const [tempState, setTempState] = useState(0);
  const [status, setStatus] = useState(["initial"]);
  const [dataArray, setDataArray] = useState([
    {
      time: "Time",
      thrust: "Thrust",
      amps: "Amps",
      volts: "Volts",
      temp: "Temp",
    },
  ]);
  const [deviceCache, setDeviceCache] = useState(null);

  console.log("dataArray:");
  console.log(dataArray);

  //Timer functionality
  useEffect(() => {
    return () => {
      // Cleanup function to clear the interval when the component is unmounted
      clearInterval(intervalId);
    };
  }, [intervalId]);

  function handleStartClick() {
    if (!intervalId) {
      const id = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setIntervalId(id);
    }
  }

  function handleStopClick() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setSeconds(0);
    }
  }

  // Launch Bluetooth device chooser and connect to the selected
  function connect() {
    return (
      deviceCache ? Promise.resolve(deviceCache) : requestBluetoothDevice()
    )
      .then((device) => connectDeviceAndCacheCharacteristic(device))
      .then((characteristic) => startNotifications(characteristic))
      .catch((error) => console.log(error));
  }

  function requestBluetoothDevice() {
    console.log("Requesting bluetooth device...");
    setStatus("Requesting bluetooth device...");

    return navigator.bluetooth
      .requestDevice({
        filters: [{ services: [0xffe0] }],
      })
      .then((device) => {
        console.log('"' + device.name + '" bluetooth device selected');
        setStatus('"' + device.name + '" bluetooth device selected');
        // deviceCache = device;
        setDeviceCache(device);
        console.log(deviceCache);
        console.log(device);

        // Added line
        device.addEventListener("gattserverdisconnected", handleDisconnection);

        return device;
      });
  }

  function handleDisconnection(event) {
    let device = event.target;

    console.log(
      '"' +
        device.name +
        '" bluetooth device disconnected, trying to reconnect...'
    );
    setStatus(
      '"' +
        device.name +
        '" bluetooth device disconnected, trying to reconnect...'
    );

    connectDeviceAndCacheCharacteristic(device)
      .then((characteristic) => startNotifications(characteristic))
      .catch((error) => console.log(error));
  }

  // Characteristic object cache
  let characteristicCache = null;

  // Connect to the device specified, get service and characteristic
  function connectDeviceAndCacheCharacteristic(device) {
    if (device.gatt.connected && characteristicCache) {
      return Promise.resolve(characteristicCache);
    }

    console.log("Connecting to GATT server...");
    setStatus("Connecting to GATT server...");

    return device.gatt
      .connect()
      .then((server) => {
        console.log("GATT server connected, getting service...");
        setStatus("GATT server connected, getting service...");

        return server.getPrimaryService(0xffe0);
      })
      .then((service) => {
        console.log("Service found, getting characteristic...");
        setStatus("Service found, getting characteristic...");

        return service.getCharacteristic(0xffe1);
      })
      .then((characteristic) => {
        console.log("Characteristic found");
        setStatus("Characteristic found");

        characteristicCache = characteristic;

        return characteristicCache;
      });
  }

  // Enable the characteristic changes notification
  function startNotifications(characteristic) {
    console.log("Starting notifications...");
    handleStartClick();
    setStatus("Starting notifications...");

    return characteristic.startNotifications().then(() => {
      console.log("Notifications started");
      setStatus("Notifications started");

      // Added line
      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );
    });
  }

  function disconnect() {
    handleStopClick();

    console.log(deviceCache);

    if (deviceCache) {
      console.log(
        'Disconnecting from "' + deviceCache.name + '" bluetooth device...'
      );
      setStatus(
        'Disconnecting from "' + deviceCache.name + '" bluetooth device...'
      );

      deviceCache.removeEventListener(
        "gattserverdisconnected",
        handleDisconnection
      );

      if (deviceCache.gatt.connected) {
        deviceCache.gatt.disconnect();
        console.log('"' + deviceCache.name + '" bluetooth device disconnected');
        setStatus('"' + deviceCache.name + '" bluetooth device disconnected');
      } else {
        console.log(
          '"' + deviceCache.name + '" bluetooth device is already disconnected'
        );
        setStatus(
          '"' + deviceCache.name + '" bluetooth device is already disconnected'
        );
      }
    }

    // Added condition
    if (characteristicCache) {
      characteristicCache.removeEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );
      characteristicCache = null;
    }

    // deviceCache = null;
    setDeviceCache(null);
  }

  // Data receiving
  function handleCharacteristicValueChanged(event) {
    let value = new TextDecoder().decode(event.target.value); //value is a string

    const splitArray = value.split(" ");

    const thrustValue = splitArray[0];
    const ampsValue = splitArray[1];
    const voltsValue = splitArray[2];
    const tempValue = splitArray[3];

    const thrustFinal = removeNullBytes(thrustValue); //*2.2046;
    const ampsFinal = removeNullBytes(ampsValue);
    const voltsFinal = removeNullBytes(voltsValue);
    const tempFinal = removeNullBytes(tempValue);

    const timeStamp = new Date().toLocaleTimeString();

    const newData = {
      time: timeStamp,
      thrust: thrustFinal,
      amps: ampsFinal,
      volts: voltsFinal,
      temp: tempFinal,
    };

    let tempData = dataArray;
    tempData.push(newData);

    setDataArray(tempData);

    //get time array
    let timeArray = getTimeArray(dataArray);
    console.log(JSON.stringify(timeArray));
    setSharedTime(timeArray);

    //get temp array
    let temperatureArray = getTemperatureArray(dataArray);
    setSharedTemp(temperatureArray);

    //get thrust array
    let thrustArray = getThrustArray(dataArray);
    setSharedThrust(thrustArray);

    //get amps array
    let ampsArray = getAmpsArray(dataArray);
    setSharedAmps(ampsArray);

    //get volts array
    let voltsArray = getVoltsArray(dataArray);
    setSharedVolts(voltsArray);

    function getTimeArray(data) {
      // Initialize an empty array to store the extracted time values
      const timeValues = [];

      // Loop through the array and extract "time" values
      data.forEach((item) => {
        // Access the "time" property of each object
        const time = item.time;

        // Check if the value is not the header ("Time") before adding it to the result array
        if (time !== "Time") {
          // Push the time value into the result array
          timeValues.push(time);
        }
      });

      return timeValues;
    }

    function getTemperatureArray(data) {
      // Initialize an empty array to store the extracted time values
      const tempValues = [];

      // Loop through the array and extract "time" values
      data.forEach((item) => {
        // Access the "time" property of each object
        const temp = item.temp;

        // Check if the value is not the header ("Time") before adding it to the result array
        if (temp !== "Temp") {
          // Push the time value into the result array
          tempValues.push(Number(temp));
        }
      });

      return tempValues;
    }

    function getThrustArray(data) {
      // Initialize an empty array to store the extracted time values
      const thrustValues = [];

      // Loop through the array and extract "time" values
      data.forEach((item) => {
        // Access the "time" property of each object
        const thrust = item.thrust;

        // Check if the value is not the header ("Time") before adding it to the result array
        if (thrust !== "Thrust") {
          // Push the time value into the result array
          thrustValues.push(Number(thrust));
        }
      });

      return thrustValues;
    }

    function getAmpsArray(data) {
      // Initialize an empty array to store the extracted time values
      const ampsValues = [];

      // Loop through the array and extract "time" values
      data.forEach((item) => {
        // Access the "time" property of each object
        const amps = item.amps;

        // Check if the value is not the header ("Time") before adding it to the result array
        if (amps !== "Amps") {
          // Push the time value into the result array
          ampsValues.push(Number(amps));
        }
      });

      return ampsValues;
    }

    function getVoltsArray(data) {
      // Initialize an empty array to store the extracted time values
      const voltsValues = [];

      // Loop through the array and extract "time" values
      data.forEach((item) => {
        // Access the "time" property of each object
        const volts = item.volts;

        // Check if the value is not the header ("Time") before adding it to the result array
        if (volts !== "Volts") {
          // Push the time value into the result array
          voltsValues.push(Number(volts));
        }
      });

      return voltsValues;
    }

    updateSharedVariable(
      dataArray[dataArray.length - 1].temp,
      dataArray[dataArray.length - 1].volts,
      dataArray[dataArray.length - 1].amps,
      dataArray[dataArray.length - 1].thrust,
      dataArray[dataArray.length - 1].time
    );

    function removeNullBytes(str) {
      return str
        .split("")
        .filter((char) => char.codePointAt(0))
        .join("");
    }

    setThrustState(thrustFinal);
    setCurrentState(ampsFinal);
    setVoltageState(voltsFinal);
    setTempState(tempFinal);
  }

  function downloadCSV() {
    const csv = convertToCSV(dataArray);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function convertToCSV(data) {
    const rows = [];
    for (const obj of data) {
      const values = [];
      for (const key in obj) {
        values.push(obj[key]);
      }
      rows.push(values.join(","));
    }
    return rows.join("\n");
  }

  const handleNavClickShow = () => {
    setIsContainerVisible(true);
  };

  const handleNavClickHide = () => {
    setIsContainerVisible(false);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
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
          <LinkContainer to="/connect">
              <Nav.Link onClick={handleNavClickShow}>Connect</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/graph2">
              <Nav.Link onClick={handleNavClickHide}>Thrust</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/graph">
              <Nav.Link onClick={handleNavClickHide}>Temp</Nav.Link>
            </LinkContainer>            
            <LinkContainer to="/data">
              <Nav.Link onClick={handleNavClickHide}>AllData</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link onClick={handleNavClickHide}>About</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container>
      {isContainerVisible && (
        <Card>
          <Card.Body>
            <Card.Title>Bluetooth BLE Connections</Card.Title>
            <p>Connection time: {seconds} seconds</p>
            <Button variant="primary" onClick={connect}>
              Connect
            </Button>{" "}
            <Button variant="primary" onClick={disconnect}>
              disconnect
            </Button>{" "}
            <Button variant="primary" onClick={downloadCSV}>
              download
            </Button>{" "}
            <Card.Text>Connection status: {status}</Card.Text>
          </Card.Body>
        </Card>
        )}
      </Container>

      <Routes>
      <Route
          path="/connect"
          element={<Connect/>}
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
              dataArray={dataArray}
              sharedTemp={sharedTemp}
              sharedTime={sharedTime}
            />
          }
        />
        <Route
          path="/graph2"
          element={
            <ChartPower
              sharedVariable={sharedVariable}
              dataArray={dataArray}
              sharedThrust={sharedThrust}
              sharedVolts={sharedVolts}
              sharedAmps={sharedAmps}
              sharedTime={sharedTime}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
