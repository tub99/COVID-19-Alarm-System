import React from "react";
import './ComparisonChart.css';
var d3 = Object.assign(
  {},
  require("d3"),
  require("d3-geo"),
  require("d3-queue")
);
const GraphType = {
  ALL: 'All',
  DECEASED: 'deceased',
  CONFIRMED: 'confirmed',
  RECOVERED: 'recovered'
}
const colorMap = {
  'confirmed': { lineColor: '#cae075', anchorColor: '#17a2b8' },
  'recovered': { lineColor: 'green', anchorColor: '#17a2b8' },
  'deceased': { lineColor: 'red', anchorColor: '#17a2b8' }
}

class ComparisonChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSeriesData: [],
      graphType: GraphType.ALL
    };
  }
  componentDidMount() {
    const { mapData } = this.props;
    this.initGraph(mapData, this.state.GraphType);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.timeSeriesData !== nextProps.timeSeriesData) {
      this.setState({ timeSeriesData: nextProps.timeSeriesData });
      this.initGraph(nextProps.timeSeriesData);
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    
    return this.state.graphType !== nextState.graphType || this.state.timeSeriesData !== nextState.timeSeriesData;
  }
  componentDidUpdate() {
    
    const {timeSeriesData,graphType}= this.state;
    this.initGraph(timeSeriesData,graphType);
  }
  initGraph(data, type) {
    var that = this, lineData = [];
    if (!data) return;
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 10, bottom: 30, left: 30 },
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

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    d3.select("#graph svg").remove(); //clear DOM before re-init 
    var svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", width + 10 + margin.left + margin.right)
      .attr("height", height + 15 + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
      // d.date = parseTime((d.date + new Date().getFullYear()).split(' ').join('-'));
      d.dailyconfirmed = +d.dailyconfirmed;
      d.dailydeceased = +d.dailydeceased;
      d.dailyrecovered = +d.dailyrecovered;
    });

    //generate graph lines according to graph type
    switch (type) {

      case GraphType.CONFIRMED:
        lineData = data.map((d) => {
          return { date: d.date, value: d.dailyconfirmed, text: GraphType.CONFIRMED }
        });
        y.domain([
          0,
          d3.max(data, function (d) {
            return Math.max(d.dailyconfirmed);
          }),
        ]);
        this.generateLine(svg, [...lineData], x, y, colorMap[type].lineColor, colorMap[type].anchorColor)
        break;

      case GraphType.DECEASED:
        lineData = data.map((d) => {
          return { date: d.date, value: d.dailydeceased, text: GraphType.DECEASED }
        });
        y.domain([
          0,
          d3.max(data, function (d) {
            return Math.max(d.dailydeceased);
          }),
        ]);
        this.generateLine(svg, [...lineData], x, y, colorMap[type].lineColor, colorMap[type].anchorColor)
        break;

      case GraphType.RECOVERED:
        lineData = data.map((d) => {
          return { date: d.date, value: d.dailyrecovered, text: GraphType.RECOVERED }
        });
        y.domain([
          0,
          d3.max(data, function (d) {
            return Math.max(d.dailyrecovered);
          }),
        ]);
        this.generateLine(svg, [...lineData], x, y, colorMap[type].lineColor, colorMap[type].anchorColor)
        break;
      case GraphType.ALL:
      default:
        for (let i in GraphType) {
          if (GraphType[i] == 'All') continue;

          lineData = data.map((d) => {
            return { date: d.date, value: d['daily' + GraphType[i]], text: GraphType[i] }
          });
          y.domain([
            0,
            d3.max(data, function (d) {
              return Math.max(d.dailyconfirmed, d.dailydeceased, d.dailyrecovered);
            }),
          ]);
          this.generateLine(svg, [...lineData], x, y, colorMap[GraphType[i]].lineColor, colorMap[GraphType[i]].anchorColor)
        }

    }

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

  generateLine(svg, data, x, y, lineColor, anchorColor) {
    var that = this,
      valueline = d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        });

    var gLine = svg.append("g");
    gLine
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", lineColor)
      .attr("d", valueline);
    gLine
      .selectAll("line-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-circle")
      .attr("r", 4)
      .style("fill", anchorColor)
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.value);
      })
      .on("mouseout", function (d) {
        that.setTooltip({
          date: d.date,
          value: d.value,
          style: {
            left: window.event.pageX,
            top: window.event.pageY - 128,
            opacity: 0,
          },
          type: "multiline-chart",
        });
      })
      .on("mouseenter", function (d) {
        that.setTooltip({
          name: d.text,
          date: d.date,
          value: d.value,
          style: {
            left: window.event.pageX - 50,
            top: window.event.pageY - 60,
            opacity: 1,
          },
          type: "multiline-chart",
        });
      })
      

  }

  setTooltip(tooltipData) {
    this.props.setTooltip(tooltipData);
  }

  setGraphType = (type) => {
    this.setState({ graphType: type })
  }
  render() {
    return (
      <>
        <div className="comparison-container">
          <div className="comparison-label">
            <span>Last 7 days Comparison</span>
          </div>

        </div>
        <div
          id="graph"
          style={{
            backgroundColor: "#454d55",
            color: "wheat",
            height: "430px",
            marginBottom: "5%",
          }}
          className="fadeInUp"
        ></div>
        <div className="comparison-legend">
          <button title='click to see all data' className="all-label" onClick={() => this.setGraphType(GraphType.ALL)}>All </button>
          <button title='click to see only deceased cases' className="death-label" onClick={() => this.setGraphType(GraphType.DECEASED)}>Death: Red </button>
          <button title='click to see only confirmed data' className="confirmed-label" onClick={() => this.setGraphType(GraphType.CONFIRMED)}>Confirmed: Yellow </button>
          <button title='click to see only recovery data' className="rec-label" onClick={() => this.setGraphType(GraphType.RECOVERED)}>Rec: Green </button>
        </div>
      </>
    );
  }
}

export default ComparisonChart;
