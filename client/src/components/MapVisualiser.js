import React from 'react';
import * as topojson from "topojson-client";
// import data from './../assets/ne_10m_admin_1_India_Official.json';
import data from './../assets/india.json';
var d3 = Object.assign({}, require("d3"), require("d3-geo"), require("d3-queue"));


class MapVisualiser extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            mapData: {},
            delta: []
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
        if (this.state.delta !== nextProps.delta) {
            this.setState({ delta: nextProps.delta });
            requestAnimationFrame(() => this.highlightChangedStates(nextProps.delta));
        }
    }


    highlightChangedStates(delta) {
        let data = [...delta];
        data.shift();
        const animate = (state,color, dur=1500000) =>{
            const id = `#st_${state.state.split(" ").join("_")}`;
            const filledColor =  d3.select(id).style('fill');
            d3.select(`#st_${state.state.split(" ").join("_")}`)
            .style('fill', color)
            .style('opacity', 0.7)
            .style('stroke-width', '2')
            .transition()
            .duration(dur)
            .style('fill', filledColor)
            .style('opacity', 1)
            .style('stroke-width', '1');
        }
        data.forEach((state) => {

            if (state.isDead > 0) {
                animate(state,'#d62525' );

            } else if (state.isConfirmed > 0) {
                    animate(state,'#ffc107');

            } else if (state.isRecovered > 0) {
                    animate(state,'#20c997')
            }
        })
    }

    initMap(data) {
        if (!Object.keys(data).length) return;
        let topoMap = data;
        // let states = topojson.feature(topoMap, topoMap.objects.ne_10m_admin_1_India_Official);
        let states = topojson.feature(topoMap, topoMap.objects.india);

        // Map render
        let mapContainerWidth = document.getElementById('map').clientWidth - 20,
            scaleValue = document.body.clientWidth < 500 ? 600 : 800;
        let map = this.stateMap(states.features).width(mapContainerWidth).height(500).scale(scaleValue);
        d3.select("#map").call(map);
    }

    stateMap(states) {
        const confirmedList = states.map(state => {
            return state.properties.confirmed;
        });
        const max= Math.max.apply(this, confirmedList) || 0;
        const min  = Math.min.apply(this, confirmedList) || 0;
        console.log(max,min);
        var width = 800, height = 700, scale = 160;
        //var colors = ["#ffffff", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3"];
        var colors = ["#fff",  "#9CA17D", '#7F9751', '#4D5F2B'];
        let that = this;
        function render(selection) {
            selection.each(function () {
                var color = d3.scaleLinear()
                   // .domain([d3.min(states, function (d) {return d.properties.confirmed; }), d3.max(states, function (d) { return d.properties.confirmed; })])
                  .domain([min,max]) 
                  .range(colors);
                d3.select(this).select("svg").remove();
                var svg = d3.select(this).append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var projection = d3.geoMercator()
                    .center([82, 23])
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
                        d3.select('#' + d.properties.id).style('stroke', '#5C603E').style('stroke-width', '2');
                        that.setTooltip({
                            ...d.properties,
                            style: { left: window.event.pageX, top: window.event.pageY - 60, opacity: 1 }
                        });
                    })
                    .on("mouseout", function (d) {
                        d3.select('#' + d.properties.id).style('stroke', '#000').style('stroke-width', '1');
                        that.setTooltip({
                            ...d.properties,
                            style: { left: window.event.pageX, top: window.event.pageY - 28, opacity: 0 }
                        });
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
     
            <div id="map" className="fadeInUp"></div>
      
        );
    }

}

export default MapVisualiser;