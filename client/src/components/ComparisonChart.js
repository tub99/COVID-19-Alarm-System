import React from "react";

var d3 = Object.assign(
  {},
  require("d3"),
  require("d3-geo"),
  require("d3-queue")
);

class ComparisonChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSeriesData: {},
    };
  }
  componentDidMount() {
    const { mapData } = this.props;
    this.initMap(mapData);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.timeSeriesData !== nextProps.timeSeriesData) {
      this.setState({ timeSeriesData: nextProps.timeSeriesData });
      this.initMap(nextProps.timeSeriesData);
    }
  }

  initMap(data) {
    var that = this;
    if (!data) return;
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 30 },
      width =
        document.getElementById("graph").clientWidth -
        margin.left -
        margin.right,
      height = 400 - margin.top - margin.bottom;

    if (width < 300) {
      width = 300;
      height = 300;
    }

    // parse the date / time
    var parseTime = d3.timeParse("%d-%B-%Y");

    // set the ranges
    var x = d3
      .scalePoint()
      .rangeRound([0, width])
      .domain(data.map((d) => d.date))
      .padding(0.5);
    //d3.scaleBand().domain(data.map(d => d.date)).range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    var valueline = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.dailyconfirmed);
      });

    // define the 2nd line
    var valueline2 = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.dailydeceased);
      });

    var valueline3 = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.dailyrecovered);
      });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", width + 10+ margin.left + margin.right)
      .attr("height", height + 15 +margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
      // d.date = parseTime((d.date + new Date().getFullYear()).split(' ').join('-'));
      d.dailyconfirmed = +d.dailyconfirmed;
      d.dailydeceased = +d.dailydeceased;
      d.dailyrecovered = +d.dailyrecovered;
    });

    // Scale the range of the data
    y.domain([
      0,
      d3.max(data, function (d) {
        return Math.max(d.dailyconfirmed, d.dailydeceased, d.dailyrecovered);
      }),
    ]);

    var gline1 = svg.append("g");
    // Add the valueline path.
  
    gline1
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "#cae075")
      .attr("d", valueline);
    gline1
      .selectAll("line-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-circle")
      .attr("r", 4)
      .style("fill", "#17a2b8")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.dailyconfirmed);
      })
      .on("mouseenter", function (d) {
        that.setTooltip({
          name: "confirmed",
          date: d.date,
          value: d.dailyconfirmed,
          style: {
            left: window.event.pageX-50,
            top: window.event.pageY - 80,
            opacity: 1,
          },
          type: "multiline-chart",
        });
      })
      .on("mouseleave", function (d) {
        that.setTooltip({
          date: d.date,
          value: d.dailyconfirmed,
          style: {
            left: window.event.pageX,
            top: window.event.pageY - 128,
            opacity: 0,
          },
          type: "multiline-chart",
        });
      });

    var gLine2 = svg.append("g");
    // Add the valueline2 path.
    gLine2
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);
    gLine2
      .selectAll("line-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-circle")
      .attr("r", 4)
      .style("fill", "#17a2b8")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.dailyrecovered);
      })
      .on("mouseenter", function (d) {
        that.setTooltip({
          name: "recovered",
          date: d.date,
          value: d.dailyrecovered,
          style: {
            left: window.event.pageX,
            top: window.event.pageY - 120,
            opacity: 1,
          },
          type: "multiline-chart",
        });
      })
      .on("mouseleave", function (d) {
        that.setTooltip({
          date: d.date,
          value: d.dailyrecovered,
          style: {
            left: window.event.pageX,
            top: window.event.pageY - 128,
            opacity: 0,
          },
          type: "multiline-chart",
        });
      });
    var gLine3 = svg.append("g");
    gLine3
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "green")
      .attr("d", valueline3);
    gLine3
      .selectAll("line-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-circle")
      .attr("r", 4)
      .style("fill", "#17a2b8")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.dailydeceased);
      })
      .on("mouseenter", function (d) {
        that.setTooltip({
          name: "deaths",
          date: d.date,
          value: d.dailydeceased,
          style: {
            left: window.event.pageX,
            top: window.event.pageY - 110,
            opacity: 1,
          },
          type: "multiline-chart",
        });
      })
      .on("mouseleave", function (d) {
        that.setTooltip({
          date: d.date,
          value: d.dailydeceased,
          style: {
            left: window.event.pageX,
            top: window.event.pageY - 128,
            opacity: 0,
          },
          type: "multiline-chart",
        });
      });

    // Add the X Axis
    svg
      .append("g")
      .attr("class", "axis-x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-65)");

    // Add the Y Axis
    svg.append("g").attr("class", "axis-y").call(d3.axisLeft(y));
  }

  setTooltip(tooltipData) {
    this.props.setTooltip(tooltipData);
  }
  render() {
    return (
      <div
        id="graph"
        style={{
          backgroundColor: "#454d55",
          color: "wheat",
          marginLeft: "2%",
          height: "400px",
          marginBottom: "5%",
        }}
        className="fadeInUp"
      ></div>
    );
  }
}

export default ComparisonChart;
