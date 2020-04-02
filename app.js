var width = 1600;
var height =1000;
var padding = 20;

var svg = d3.select("body")
.append("svg")
.attr("class", "svg")
.attr("width", width)
.attr("height", height);

//==COLOUR SCALE==//

var domainLegend = ["2600", "Wii", "NES", "GB", "DS", "X360", "PS3", "PS2", "SNES", "GBA", "PS4", "3DS", "N64", "PS", "XOne"];

var scaleColour = d3.scaleOrdinal()
.domain(["2600", "Wii", "NES", "GB", "DS", "X360", "PS3", "PS2", "SNES", "GBA", "PS4", "3DS", "N64", "PS", "XOne"])
.range(['#998ec3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928', '#66c2a5','#fc8d62','#8da0cb']);

//==LEGEND SCALE==//

svg.append("g")
.attr("transform", "translate(1280, 0)")
.attr("id", "legend")
.selectAll("rect")
.data(domainLegend)
.enter()
.append("rect")
.attr("class", "legend-item")
.attr("x", 0)
.attr("y", (d,i) => i * 40)
.attr("width", 20)
.attr("height", 20)
.attr("fill", d => scaleColour(d))

svg.select("#legend")
.selectAll("text")
.data(domainLegend)
.enter()
.append("text")
.attr("x", 30)
.attr("y", (d,i) => (i * 40) + 20)
.attr("padding", 10 + "px")
.text(d => d)

//==TOOLTIP==

var tooltip = d3.select("body")
.append("div")
.attr("id", "tooltip")
.style("visibility", "hidden")


//==WORKING WITH DATA: TILES AFTER JSON PROMISE IS RESOLVED
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").then(function(data){
    var report = d3.hierarchy(data);
    report.sum(d => d.value)
    var treemapLayout = d3.treemap()
    .size([1250, 800])
    .paddingInner(1)
    .paddingOuter(2);

    report = treemapLayout(report);

    var cell = svg.selectAll("g")
    .data(report.leaves())
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("data-name", d => d.data.name)
    .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    cell
    .append("rect")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("fill", d => scaleColour(d.data.category))
    .on("mouseover", function(d) {
        tooltip.style("visibility", "visible")
        .style("left", (d3.event.pageX - 10) + "px")
    .style("top", (d3.event.pageY - 105) + "px")
        .html("Platform: " + d.data.category + "<br>Game: " + d.data.name + "<br>Value: " + d.data.value)
        .attr("data-value", d.data.value)
    })
    .on("mouseout", function(){
        tooltip.style("visibility", "hidden")
    })

});