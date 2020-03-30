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
import Navbar from 'react-bootstrap/Navbar';
import {notifyCovidUpdates} from '../utils/Notifier';
class MapVisualiserContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      mapData: {},
      covidData: [],
      delta: []
    };
  }

  componentDidMount() {
    const getCOVIDData = (isDelta = false, delta = null) => {
      axios.get("http://localhost:3000/covid-data").then(resp => {
        let covidData = resp.data;
        this.setState({
          covidData,
          mapData: { ...parseMapData(mapData, covidData) }
        });
        if (isDelta) {
          this.setState({ delta });
          notifyCovidUpdates(delta);
        }
      });
    };
    const getCOVIDDelta = () => {
      axios.get("http://localhost:3000/covid-data/delta").then(resp => {
        let delta = resp.data;

        delta = [
          {
            "state": "Total",
            "isDead": 0,
            "isRecovered": 44,
            "isConfirmed": 0
          },
          {
            "state": "Maharashtra",
            "isDead": 70,
            "isRecovered": 0,
            "isConfirmed": 0
          },
          {
            "state": "Uttar Pradesh",
            "isDead": 0,
            "isRecovered": 0,
            "isConfirmed": 700
          }
        ];

        if (delta.length > 0) {
          getCOVIDData(true, delta)
        }
      });
    }
    getCOVIDData();
    setTimeout(() => {
      getCOVIDDelta();
    }, 2000);
    setInterval(() => {
      // getCOVIDDelta();
    }, 1800000);
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
        <h6>
          <strong>{tooltipData.state}</strong>
        </h6>
        <p>confirmed: {tooltipData.confirmed}</p>
        <p>deaths: {tooltipData.deaths}</p>
        <p>recovered: {tooltipData.recovered}</p>
      </>
    );
  }

  render() {
    const { mapData, tooltipData, delta } = this.state;
    return (
      <>

        <Container fluid>
          <Navbar bg="light" variant="light" >COVID-19 Alarm System</Navbar>
          <Row>
            <Col>
              <MapVisualiser delta={delta} setTooltip={this.setTooltip} mapData={mapData} />
              {tooltipData && (
                <Tooltip style={tooltipData.style}>
                  {this.prepareTooltipBody(tooltipData)}
                </Tooltip>
              )}
            </Col>
            <Col>
              <TabularInfo covidData={this.state.covidData} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MapVisualiserContainer;
