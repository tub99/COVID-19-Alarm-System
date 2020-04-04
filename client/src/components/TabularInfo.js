import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CovidTable from "./CovidTable";
import axios from "axios";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
const TabularInfo = props => {
  const { covidData, todayData } = props;
  const [tabularData, setTabularData] = useState([]);
  useEffect(() => {
    setTabularData(covidData);
  }, [covidData]);

  const loadData = eventKey => {
    // console.log(eventKey);
    if (eventKey === "1") {
      setTabularData(covidData);
    } else if (eventKey === "2") {
      setTabularData(todayData);
    }
  };

  return (
    <Container className="covid-stats-table-container" fluid>
      <Row>
        <Col>
          <Tabs id="uncontrolled-tab-example" onSelect={loadData}>
            <Tab
              eventKey="1"
              className="covid-table-tabs"
              title="Total Cases"
            ></Tab>
             
            <Tab eventKey="2" className="covid-table-tabs" title="Today's Cases">
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row>
        <Col>
          {tabularData.length > 0 && (
            <CovidTable covidData={tabularData}></CovidTable>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TabularInfo;
