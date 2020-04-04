import React from "react";
import MapVisualiser from "./MapVisualiser";
import Tooltip from "./Tooltip";
import axios from "axios";
import mapData from "./../assets/india.json";
import { parseMapData } from "../utils/Dataparser";
import {getDelta, storeDelta} from "../utils/Delta";
import TabularInfo from "./TabularInfo";
import InfoUpdate from "./InfoUpdate";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import { notifyCovidUpdates } from "../utils/Notifier";
class MapVisualiserContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      mapData: {},
      covidData: [],
      delta: [],
      todayData:[]
    };
  }

  componentDidMount() {
    const BASE_URL = "http://localhost:3030";
    const getCOVIDData = () => {
      axios.get(BASE_URL+"/covid-data").then(resp => {
        debugger;
        let covidData = resp.data.totalCases;
         const {today} = resp.data;
        if(!localStorage.getItem("delta")){
          storeDelta(covidData);
          this.setState({
            covidData,
            mapData: { ...parseMapData(mapData, covidData) },
            todayData:today
          });
        } else {
          const delta = getDelta(covidData);
          if (delta.deltaList && delta.deltaList.length>0) {
            this.setState({
              covidData,
              delta : delta.deltaList,
              mapData: { ...parseMapData(mapData, covidData) },
              todayData:today
            });
            notifyCovidUpdates(delta.deltaList);
          } else{
            this.setState({
              covidData,
              mapData: { ...parseMapData(mapData, covidData) },
              todayData:today
            });
          }
        }
        
        
     
      });
    };
    getCOVIDData();
    //polling on updates
    const deltaPollDuration = 1800000;
    setInterval(() => {
      //getCOVIDDelta();
      getCOVIDData();
    }, deltaPollDuration);
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
          <Navbar bg="light" variant="light">
            <h5 className="header-info" style={{ fontFamily: "fantasy" }}>COVID-19 Alarm System</h5>
          </Navbar>
         
          <Row>
          <Col  md="5">
            <Row>
              <Col md="auto">
              <span className=".user-help-info">Tap on the States to view State-Wise Cases!</span>
              </Col>
            </Row>
            <Row><Col md="12">
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
              </Col></Row>
             
            </Col>
          <Col  md="6">
              <TabularInfo covidData={this.state.covidData} todayData={this.state.todayData} />
            </Col>
            
          
          </Row>
          <Row>
            <Col md="auto">
              <InfoUpdate info={this.state.delta}></InfoUpdate>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MapVisualiserContainer;
