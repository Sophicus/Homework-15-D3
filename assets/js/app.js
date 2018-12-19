var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(uscbData) {
  console.log(uscbData)

  // Parse Data
  uscbData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
  });

  // Scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(uscbData, d => d.poverty)])
    .range([0, width-margin.left]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(uscbData, d => d.smokes)])
    .range([height, 0]);

  // Axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(uscbData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("r", "15")
  .attr("class", "stateCircle");

  // Circle text
  circlesGroup.append("text")
  .text(d => d.abbr)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("font-size", "15")
  .attr("class", "stateText");

  // Initialize tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>% Poverty ${d.poverty}<br>% Smokes ${d.smokes}`);
    });

  chartGroup.call(toolTip);

  // Event listeners
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  // Axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% Smokes");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("% Poverty");

});


