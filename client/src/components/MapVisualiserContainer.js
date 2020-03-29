import React from 'react';
import MapVisualiser from './MapVisualiser';
import Tooltip from './Tooltip'
import axios from 'axios';
import mapData from './../assets/india.json';
import { parseMapData } from '../utils/Dataparser';
class MapVisualiserContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            mapData: {}
        };
    }

    componentDidMount() {

        axios.get('http://localhost:3000/covid-data').then((resp) => {
            let covidData = resp.data;
            this.setState({
                totalData: covidData.shift(),
                mapData: { ...parseMapData(mapData, covidData) }
            });
        })
    }

    setTooltip = (tooltipData) => {
        this.setState({ tooltipData });
    }

    prepareTooltipBody(tooltipData) {
        return (
            <>
                <span><strong>{tooltipData.state}</strong></span>
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
                <MapVisualiser setTooltip={this.setTooltip} mapData={mapData} />
                {tooltipData && <Tooltip style={tooltipData.style}>{this.prepareTooltipBody(tooltipData)}</Tooltip>}
            </>
        );
    }

}

export default MapVisualiserContainer;