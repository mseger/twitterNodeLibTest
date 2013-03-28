
var width = 960,
    height = 500;

magic_nums = []
for (i=0; i<77; i++){
  magic_nums[i] = Math.random()*15
}
console.log(magic_nums);

var color = d3.scale.category10();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#circles").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/miserables.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });
  
  names = [];
  for(var i=0; i<graph.nodes.length; i++){
    names[i]=graph.nodes[i].name;
  }
  console.log(names);



  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("r", function(d) { return d.num*0.2+5; })
      .style("fill", function(d) { return d3.rgb(d.num*2+30, d.num*5, 100)})//color(d.num); })
      .attr("class", "node")
      .call(force.drag);
  
  // node.append("circle")
      

  node.append("text")
      // .attr("dx", function(d){return -20})
      .attr("class", "labels")
      .text(function(d) { return "hi" });



  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});