import React from 'react';
import * as topojson from "topojson-client";
import data from './../assets/ne_10m_admin_1_India_Official.json';
var d3 = Object.assign({}, require("d3"), require("d3-geo"), require("d3-queue"));


class MapVisualiser extends React.Component {



    componentDidMount() {

        let topoMap = data;
        let states = topojson.feature(topoMap, topoMap.objects.ne_10m_admin_1_India_Official);

        // Map render
        let map = this.stateMap(states.features).width(800).height(700).scale(1200);
        d3.select("#map").call(map);

    }


    stateMap(states) {

        var width = 800, height = 700, scale = 160;
        var colors = ["#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3"]

        function render(selection) {
            selection.each(function () {

                var color = d3.scaleLinear()
                    .domain([100000, 90000000])
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
                var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
                selectState.append("path")
                    .style("fill", function (d) {
                        return color(d.properties.population)
                    })
                    .attr("d", path)
                    .attr("id", (data) => { return data.id })
                    .on("mouseover", (d) => {
                        d3.select('#' + d.id).style('stroke', 'red').style('stroke-width', '4');
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(d.properties.name + "<br/>" + d.properties.population)
                            .style("left", (window.event.pageX) + "px")
                            .style("top", (window.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        d3.select('#' + d.id).style('stroke', 'initial').style('stroke-width', '0');
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
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

    render() {
        return (
            <div id="map"></div>
        );
    }

}

export default MapVisualiser;