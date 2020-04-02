import React from 'react';
import * as topojson from "topojson-client";
// import data from './../assets/ne_10m_admin_1_India_Official.json';
import data from './../assets/india.json';
var d3 = Object.assign({}, require("d3"), require("d3-geo"), require("d3-queue"));


class ComparisonChart extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            timeSeriesData: {},
        }
    }
    componentDidMount() {
        const { mapData } = this.props;
        this.initMap(mapData);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.timeSeriesData !== nextProps.timeSeriesData) {
            this.setState({ timeSeriesData: nextProps.timeSeriesData })
            this.initMap(nextProps.mapData);
        }
    }



    initMap(data) {
        if (!Object.keys(data).length) return;

        //container for multigraph
        var multigraph = svg.selectAll(".bar")
            .data(combinedList)
            .enter().append("g")
            .attr("class", "bar")

        //create individual bars for 1st type
        var bar1 = multigraph.append("rect")
            .attr("class", "first")
            .attr("class","bar negative")
            .attr("height", function(d) {
                return Math.abs(yScale(d.fist) - yScale(0));
            })
            .attr("y", function(d) {
                if (d.first > 0) {
                    return yScale(d.first);
                } else {
                    return yScale(0);
                }
            })
            .attr("width", (xScale.bandwidth()))
            .attr("x", function(d, j) {
                return xScale(options.labels[j])
            })
            .on('mouseover', function(d, j){
                d3.select(this).style("opacity", 0.6);
                tip.show(d.first, j);
            })
            .on('mouseout', function(d, j){
                d3.select(this).style("opacity", 1);
                tip.hide(d.first, j);
            })
            .on("click", function(d, j) {
              zoomInD3(vm, options.labels[j]);
            });
    }

  

    render() {
        return (
            <div id="bar" className="fadeInUp"></div>
        );
    }

}

export default ComparisonChart;