import { format as d3_format } from "d3-format";
import { select } from "d3-selection";
import * as d3 from "d3";
import { drag } from "d3-drag";
import { colorLinks, colorNodes } from "./utils/color";

import { rgb } from "d3-color";
import "./styles.css";
import sankey from "./sankey.js";
import { dataforSankey } from "./utils/filterFunctions";
import data from "./data.json";

const units = "Gg CO2-eq";

const graph = dataforSankey(data, 2017, "EqGWP");

// Dimensiones y margen
const margin = { top: 10, right: 100, bottom: 10, left: 100 },
  width = 1400,
  height = width * 0.6,
  nodeWidth = 80,
  nodePadding = 10,
  separation = 4,
  layout = 22;

const innerWidth = width - margin.left - margin.right,
  innerHeight = height - margin.top - margin.bottom;

// Formateo de números
const formatNumber = d3_format(".0f"), // zero decimal places
  format = function (d) {
    return formatNumber(d) + " " + units;
  };

// append elemento SVG al body
const svg = select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Setear propiedades del Sankey
const sank = sankey()
  .nodeWidth(nodeWidth)
  .nodePadding(nodePadding)
  .size([innerWidth, innerHeight])
  .separation(separation);

const path = sank.link();

// Cargar los datos

sank.nodes(graph.nodes).links(graph.links).layout(layout);

// add in the links
var link = svg
  .append("g")
  .selectAll(".link")
  .data(graph.links)
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", path)
  .style("stroke-width", function (d) {
    return Math.max(1, d.dy);
  })
  .style("stroke", (d) => colorLinks(d))
  .style("stroke-Opacity", "0.3")
  .sort(function (a, b) {
    return b.dy - a.dy;
  });

// Agregar etiquetas de texto --- REVISAR -- Poner nombres de fuentes
link.append("title").text(function (d) {
  return d.source.name + " → " + d.target.name + "\n" + format(d.value);
});

// Append los nodos
var node = svg
  .append("g")
  .selectAll(".node")
  .data(graph.nodes)
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
  })
  .call(
    drag()
      .subject(function (d) {
        return d;
      })
      .on("start", function () {
        this.parentNode.appendChild(this);
      })
      .on("drag", dragmove)
  );

// add the rectangles for the nodes
node
  .append("rect")
  .attr("height", function (d) {
    return d.dy;
  })
  .attr("width", sank.nodeWidth())
  .style("fill", (d) => colorNodes(d.name))
  //.style("stroke", function (d) {
  //   return rgb(colorNodes(d.name)).darker(1);
  // })
  .append("title")
  .text(function (d) {
    return d.name + "\n" + format(d.value);
  });

// add in the title for the nodes
node
  .append("text")
  .attr("x", function (d) {
    if (d.x < innerWidth / 3) {
      return -60;
    } else if (d.x < (innerWidth * 2) / 3) {
      return 6;
    } else {
      return 6 + sank.nodeWidth();
    }
  })
  .attr("y", function (d) {
    return d.dy / 2;
  })
  .attr("dy", ".35em")
  .attr("text-anchor", "end")
  .attr("transform", null)
  .text(function (d) {
    return d.name;
  })
  .attr("text-anchor", "start");

// the function for moving the nodes
function dragmove(d) {
  select(this).attr(
    "transform",
    "translate(" +
      (d.x = Math.max(0, Math.min(innerWidth - d.dx, d3.event.x))) +
      "," +
      (d.y = Math.max(0, Math.min(innerHeight - d.dy, d3.event.y))) +
      ")"
  );
  sank.relayout();
  link.attr("d", path);
}
