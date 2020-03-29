import React from 'react';
import * as topojson from "topojson-client";
// import data from './../assets/ne_10m_admin_1_India_Official.json';
import data from './../assets/india.json';
var d3 = Object.assign({}, require("d3"), require("d3-geo"), require("d3-queue"));


class MapVisualiser extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            mapData: {}
        }
    }
    componentDidMount() {
        const { mapData } = this.props;
        this.initMap(mapData);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.mapData !== nextProps.mapData) {
            this.setState({ mapData: nextProps.mapData })
            this.initMap(nextProps.mapData);
        }
    }

    // static getDerivedStateFromProps(nextProps, prevState) {

    //     if (prevState.mapData !== nextProps.mapData) {
    //         return { mapData: nextProps.mapData }
    //     }
    //     return null;
    // }

    initMap(data) {
        if (!Object.keys(data).length) return;
        let topoMap = data;
        // let states = topojson.feature(topoMap, topoMap.objects.ne_10m_admin_1_India_Official);
        let states = topojson.feature(topoMap, topoMap.objects.india);

        // Map render
        let map = this.stateMap(states.features).width(800).height(700).scale(1200);
        d3.select("#map").call(map);
    }

    stateMap(states) {

        var width = 800, height = 700, scale = 160;
        var colors = ["#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3"];
        let that = this;
        function render(selection) {
            selection.each(function () {

                var color = d3.scaleLinear()
                    .domain([d3.min(states, function(d) { return d.properties.confirmed; }), d3.max(states, function(d) { return d.properties.confirmed; })])
                    .range(colors);
                d3.select(this).select("svg").remove();
                var svg = d3.select(this).append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var projection = d3.geoMercator()
                    .center([83, 23])
                    .scale(scale)
                    .translate([width / 2, height / 2]);

                var path = d3.geoPath().projection(projection);
                var selectState = svg.selectAll("g").data(states).enter().append("g").attr("class", "state");
                // var div = d3.select("body").append("div")
                //     .attr("class", "tooltip")
                //     .style("opacity", 0);


                // prepares states and it's boudaries
                selectState.append("path")
                    .style("fill", function (d) {
                        return color(d.properties.confirmed)
                    })
                    .attr("d", path)
                    .attr("id", (data) => { return data.properties.id })
                    .on("mouseover", (d) => {
                        d3.select('#' + d.properties.id).style('stroke', 'red').style('stroke-width', '4');
                        that.setTooltip({
                            ...d.properties,
                            style: { left: window.event.pageX, top: window.event.pageY, opacity: 1 }
                        });
                        // div.transition()
                        //     .duration(200)
                        //     .style("opacity", .9);
                        // div.html(d.properties.state + "<br/>" + d.properties.confirmed)
                        //     .style("left", (window.event.pageX) + "px")
                        //     .style("top", (window.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        d3.select('#' + d.properties.id).style('stroke', '#000').style('stroke-width', '1');
                        that.setTooltip({
                            ...d.properties,
                            style: { left: window.event.pageX, top: window.event.pageY - 28, opacity: 0 }
                        });
                        // div.transition()
                        //     .duration(500)
                        //     .style("opacity", 0);
                    });

                // svg.selectAll("text").data(states).enter().append("text")
                //     .attr("class", function (d) { return "label " + d.id; })
                //     .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
                //     .attr("dy", ".35em")
                //     .text(function (d) { return d.properties.name; });
            });
        } // render
        render.height = function (value) {
            if (!arguments.length) return height;
            height = value;
            return render;
        };
        render.width = function (value) {
            if (!arguments.length) return width;
            width = value;
            return render;
        };
        render.scale = function (value) {
            if (!arguments.length) return scale;
            scale = value;
            return render;
        };

        return render;
    }

    setTooltip(tooltipData) {
        this.props.setTooltip(tooltipData);
    }
    render() {
        return (
            <div id="map"></div>
        );
    }

}

export default MapVisualiser;