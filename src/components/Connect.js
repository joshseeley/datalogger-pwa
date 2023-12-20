// src/MyModule/MyModule.js
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Connect = ({ sharedVariable, updateSharedVariable }) => {
  const [thrustState, setThrustState] = useState(0);
  const [currentState, setCurrentState] = useState(0);
  const [voltageState, setVoltageState] = useState(0);
  const [tempState, setTempState] = useState(0);
  const [status, setStatus] = useState(['initial']);
  const [dataArray, setDataArray] = useState([
    {
      time: "Time",
      thust: "Thrust",
      amps: "Amps",
      volts: "Volts",
      temp: "Temp",
    },
  ]);
  const [deviceCache, setDeviceCache] = useState(null);

  console.log(dataArray);

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
        '" bluetooth device disconnected, trying to reconnect...');


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
    // let valueString = value.toString();
    // console.log(value, 'in');

    console.log("value is: ");
    console.log(value);

    const splitArray = value.split(" ");

    const thrustValue = splitArray[0];
    const ampsValue = splitArray[1];
    const voltsValue = splitArray[2];
    const tempValue = splitArray[3];

    const thustFinal = removeNullBytes(thrustValue); //*2.2046;
    const ampsFinal = removeNullBytes(ampsValue);
    const voltsFinal = removeNullBytes(voltsValue);
    const tempFinal = removeNullBytes(tempValue);

    const timeStamp = new Date().toLocaleTimeString();

    const newData = {
      time: timeStamp,
      thust: thustFinal,
      amps: ampsFinal,
      volts: voltsFinal,
      temp: tempFinal,
    };

    let tempData = dataArray;
    tempData.push(newData);

    setDataArray(tempData);
    let keysArray = Object.keys(newData);

    updateSharedVariable(
      dataArray[dataArray.length - 1].temp,
      dataArray[dataArray.length - 1].volts,
      dataArray[dataArray.length - 1].amps,
      dataArray[dataArray.length - 1].thust,
      dataArray[dataArray.length - 1].time
    );

    console.log("temporary data type:");
    console.log(typeof tempData);
    console.log("temporary data is:");
    console.log(tempData);
    console.log("The data array is ");
    console.log(dataArray);
    console.log(`timestamp: ${timeStamp}`);
    console.log(`thrust: ${thustFinal}`);
    console.log(`amps: ${ampsFinal}`);
    console.log(`volts: ${voltsFinal}`);
    console.log(`temp: ${tempFinal}`);

    function removeNullBytes(str) {
      return str
        .split("")
        .filter((char) => char.codePointAt(0))
        .join("");
    }

    setThrustState(thustFinal);
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

  
  
  
  

  return (
    <>
      <Card>
         <Card.Body>
          <Card.Title>Bluetooth BLE Connections</Card.Title>
          <Button variant="primary" onClick={connect}>
              Connect
            </Button>{" "}
            <Button variant="primary" onClick={disconnect}>
              disconnect
            </Button>{" "}
            <Button variant="primary" onClick={downloadCSV}>
              download
            </Button>{" "}
            
            <Card.Text>
            Connection status: {status}
          </Card.Text>
          
        </Card.Body>
      </Card>

      {/* <Container>
        <Row>
          <Col>
            <Button variant="primary" onClick={connect}>
              Connect
            </Button>{" "}
            <Button variant="primary" onClick={disconnect}>
              disconnect
            </Button>{" "}
            <Button variant="primary" onClick={downloadCSV}>
              download
            </Button>{" "}
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default Connect;
