// Set up chart
var svgWidth = 1060;
var svgHeight = 700;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  
var chart = svg.append('g')
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips
var div = d3.select("body")
.append("div")
.attr("class", "d3-tip")
.style("opacity", 0);

// Retrieve data from csv
d3.csv("data.csv", function(err, healthData) {
    if(err) throw err;

    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        data.state = data.state;
    });
    
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(healthData, function(data) {
        return data.poverty - 0.5;
    });

    xMax = d3.max(healthData, function(data) {
        return data.poverty + 2;
    });

    yMin = d3.min(healthData, function(data) {
        return data.healthcare - 1;
    });

    yMax = d3.max(healthData, function(data) {
        return data.healthcare + 2;
    });
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);


    // Create circles and append data to it
    var circlesGroup = chart.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))     
        .attr("r", "18")
        .attr("fill", "lightblue")

    // Initialize tooltip
        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([30, -60])
        .html(function(data) {
          return (`${data.state} <br>In Poverty (%):${data.poverty}<br>Lacks healthcare (%): ${data.healthcare}`);
        });
    
    // Create tooltip
      chart.call(toolTip);
        
        
        // display tooltip on click
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
          // div.html(data.poverty);
        })
        // hide tooltip on mouseout
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
        })
    ;
    
    // Appending a label to each data point
    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - 0.2);
            })
            .text(function(data) {
                return data.abbr
            });
    
    // Append an SVG group for the xaxis, then display x-axis 
    chart
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chart.append("g")
    .call(leftAxis);

    // Append y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axisText")
        .text("Lacks healthcare (%)")

    // Append x-axis labels
    chart
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    });


