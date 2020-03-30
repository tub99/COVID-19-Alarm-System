import React from "react";
import MapVisualiser from "./MapVisualiser";
import Tooltip from "./Tooltip";
import axios from "axios";
import mapData from "./../assets/india.json";
import { parseMapData } from "../utils/Dataparser";

import TabularInfo from './TabularInfo';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar'
class MapVisualiserContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      mapData: {},
      delta: []
    };
  }

  componentDidMount() {
    const getCOVIDData = () => {
      axios.get("http://localhost:3000/covid-data").then(resp => {
        let covidData = resp.data;
        this.setState({ delta: covidData })
        this.setState({
          totalData: covidData.shift(),
          mapData: { ...parseMapData(mapData, covidData) }
        });
      });
    };
    const getCOVIDDelta = () => {
      axios.get("http://localhost:3000/covid-data/delta").then(resp => {
        let delta = resp.data;
        this.setState({ delta });
      });
    }
    getCOVIDData();
    setInterval(() => {
      // getCOVIDDelta();
    }, 5000000);
  }

  prepareTooltipBody(tooltipData) {
    const { state, confirmed, deaths, recovered } = tooltipData;
    return (
      <>
        <span><strong>{tooltipData.state}</strong></span>
        <p>active: {confirmed - deaths - recovered}</p>
        {/* <p>deaths: {deaths}</p>
                <p>recovered: {recovered}</p> */}
      </>
    );
  }
  setTooltip = tooltipData => {
    this.setState({ tooltipData });
  };

  prepareTooltipBody(tooltipData) {
    return (
      <>
        <span>
          <strong>{tooltipData.state}</strong>
        </span>
        <p>confirmed: {tooltipData.confirmed}</p>
        <p>deaths: {tooltipData.deaths}</p>
        <p>recovered: {tooltipData.recovered}</p>
      </>
    );
  }

  render() {
    const { mapData, tooltipData } = this.state;
    return (
      <>

        <Container fluid>
          <Navbar bg="light" variant="light" >COVID-19 Alarm System</Navbar>
          <Row>
            <Col>
              <MapVisualiser setTooltip={this.setTooltip} mapData={mapData} />
              {tooltipData && (
                <Tooltip style={tooltipData.style}>
                  {this.prepareTooltipBody(tooltipData)}
                </Tooltip>
              )}
            </Col>
            <Col>
              <TabularInfo delta={this.state.delta} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MapVisualiserContainer;
