import React, { useState, useEffect } from 'react';
import Tab from "react-bootstrap/Tab";
import Tabs from 'react-bootstrap/Tabs'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CovidTable from "./CovidTable";
import axios from "axios";

const TabularInfo = props => {
    const {covidData} = props;
    const [tabularData,setTabularData] = useState([]);
    console.log(covidData, tabularData);
    useEffect(()=>{
        setTabularData(covidData);
    },[covidData]);

  const loadData = eventKey => {
    // console.log(eventKey);
    if(eventKey === '1'){
        setTabularData(covidData);
    }else if(eventKey === '2'){
        axios.get("http://localhost:3000/covid-data/today").then(resp => {
            let covidData = resp.data;
            setTabularData(covidData);
          });
    }
  };

  return (
    <Container className="covid-stats-table-container" fluid>
      <Row>
        <Col>
          <Tabs id="uncontrolled-tab-example" onSelect={loadData}>
            <Tab eventKey="1" title="Total Cases">
            </Tab>
            <Tab eventKey="2" title="Today's Cases">
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row>
        <Col>
          {tabularData.length>0 && <CovidTable covidData={tabularData}></CovidTable>}
        </Col>
      </Row>
    </Container>
  );
};

export default TabularInfo;
