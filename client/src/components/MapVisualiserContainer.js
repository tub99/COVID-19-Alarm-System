import React from "react";
import MapVisualiser from "./MapVisualiser";
import Tooltip from "./Tooltip";
import axios from "axios";
import mapData from "./../assets/india.json";
import { parseMapData } from "../utils/Dataparser";
import DeltaTable from "./DeltaTable";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
        this.setState({delta:covidData})
        this.setState({
          totalData: covidData.shift(),
          mapData: { ...parseMapData(mapData, covidData) }
        });
      });
    };
    getCOVIDData();
    setInterval(() => {
      getCOVIDData();
    }, 500000000);
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
            <DeltaTable delta= {this.state.delta}/>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MapVisualiserContainer;
