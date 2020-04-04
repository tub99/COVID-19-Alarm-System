import React from 'react';

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
            this.initMap(nextProps.timeSeriesData);
        }
    }

    initMap(data) {
        if(!data) return;
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 80, bottom: 30, left: 50 },
            width = document.getElementById('bar').clientWidth - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%d-%B-%Y");

        // set the ranges
        var x = d3.scaleBand().domain(data.map(d=>d.date)).range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        var valueline = d3.line()
            .x(function (d) { 
                return x(d.date); })
            .y(function (d) { 
                return y(d.dailyconfirmed); });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.dailydeceased); });

        var valueline3 = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.dailyrecovered); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#bar").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach(function (d) {
            // d.date = parseTime((d.date + new Date().getFullYear()).split(' ').join('-'));
            d.dailyconfirmed = +d.dailyconfirmed;
            d.dailydeceased = +d.dailydeceased;
            d.dailyrecovered = +d.dailyrecovered;
        });
        const confirmedList = data.map(d => {
            return d.dailyconfirmed;
        });

        // Scale the range of the data
        // x.domain(data.map((d)=>d.date));

        y.domain([
            // [Math.min.apply(this, confirmedList) || 0, Math.max.apply(this, confirmedList)
            d3.min(data, function (d) {
                return Math.min(d.dailyconfirmed, d.dailydeceased, d.dailyrecovered);
            }), d3.max(data, function (d) {
                return Math.max(d.dailyconfirmed, d.dailydeceased, d.dailyrecovered);
            })
        ]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#cae075")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "red")
            .attr("d", valueline2);

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "green")
            .attr("d", valueline3);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

    }

    render() {
        return (
            <div id="bar" style={{ backgroundColor: 'black', color: 'wheat', marginLeft: '2%' }} className="fadeInUp"></div>
        );
    }

}

export default ComparisonChart;