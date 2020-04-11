import React from "react";
import MapVisualiser from "./MapVisualiser";
import Tooltip from "./Tooltip";
import axios from "axios";
import mapData from "./../assets/india.json";
import { parseMapData } from "../utils/Dataparser";
import ComparisonChart from "./ComparisonChart";
import { getDelta, storeDelta } from "../utils/Delta";
import TabularInfo from "./TabularInfo";
import InfoUpdate from "./InfoUpdate";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import {
  notifyCovidUpdates,
  notifyAboutCovidUpdates,
  notifyDeviceRegistrations,
} from "../utils/Notifier";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

class MapVisualiserContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      mapData: {},
      covidData: [],
      delta: [],
      timeSeriesData: [],
      todayData: [],
    };
  }

  componentDidMount() {
    const BASE_URL = "http://localhost:3030";
    const getCOVIDData = () => {
      axios.get("/covid-data").then((resp) => {
        let covidData = resp.data.totalCases;
        const { today } = resp.data;
        const {delta} = resp.data;
        ////////////////////////////////
        if (delta && delta.deltaList && delta.deltaList.length > 0) {
          this.setState({
            covidData,
            delta: delta.deltaList,
            mapData: { ...parseMapData(mapData, covidData) },
            todayData: today,
            timeSeriesData: resp.data.timeAnalysis,
          });
          // notifyCovidUpdates(delta.deltaList);
          notifyAboutCovidUpdates();
        } else {
          this.setState({
            covidData,
            mapData: { ...parseMapData(mapData, covidData) },
            todayData: today,
            timeSeriesData: resp.data.timeAnalysis,
          });
        }
      });
    };
    getCOVIDData();
    //polling on updates
    const deltaPollDuration = 1800000;
    // setInterval(() => {
    //   //getCOVIDDelta();
    //   getCOVIDData();
    // }, deltaPollDuration);
  }

  prepareTooltipBody(tooltipData) {
    const { state, confirmed, deaths, recovered } = tooltipData;
    return (
      <>
        <span>
          <strong>{tooltipData.state}</strong>
        </span>
        <p>active: {confirmed - deaths - recovered}</p>
        {/* <p>deaths: {deaths}</p>
                <p>recovered: {recovered}</p> */}
      </>
    );
  }
  setTooltip = (tooltipData) => {
    this.setState({ tooltipData });
  };

  prepareTooltipBody(tooltipData) {
    if (tooltipData.type == "multiline-chart") {
      return (
        <>
          <h6>
            {tooltipData.name} : {tooltipData.value}
          </h6>
          {/* <p>{tooltipData.value}</p> */}
          {/* <p>{tooltipData.date}</p> */}
        </>
      );
    }
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
          <Navbar bg="light" variant="light">
            <h5 className="header-info" style={{ fontFamily: "fantasy" }}>
              COVID-19 Notification System
            </h5>
          </Navbar>

          <Row>
            <Col md="5">
              <Row>
                <Col md="auto">
                  <span className=".user-help-info">
                    Tap on the States to view State-Wise Cases!
                  </span>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <MapVisualiser
                    delta={delta}
                    setTooltip={this.setTooltip}
                    mapData={mapData}
                  />
                  {tooltipData && (
                    <Tooltip style={tooltipData.style}>
                      {this.prepareTooltipBody(tooltipData)}
                    </Tooltip>
                  )}
                </Col>
              </Row>
            </Col>
            <Col md="6">
              <TabularInfo
                covidData={this.state.covidData}
                todayData={this.state.todayData}
              />
            </Col>
          </Row>
          <Row>
            <Col md="5">
              <InfoUpdate info={this.state.delta}></InfoUpdate>
            </Col>
            <Col sm="12" md="6">
              <ComparisonChart
                setTooltip={this.setTooltip}
                timeSeriesData={this.state.timeSeriesData}
              ></ComparisonChart>
            </Col>
          </Row>
        </Container>
        <NotificationContainer />
      </>
    );
  }
}

export default MapVisualiserContainer;
