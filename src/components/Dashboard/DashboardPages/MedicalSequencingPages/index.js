import * as d3 from "d3";
import { colorNodes, colorLinks } from "./utils/color";
import { dataToSankey } from "./utils/filterFunctions";
import { sankey, sankeyLinkHorizontal, sankeyCenter } from "d3-sankey";

import "./styles.css";
//import data from "./data1.json";
import data from "./dataT.json";

export const initializeSankey = (rerenderHandler)=>{
  
  const units = "Gg CO2-eq";
  
  //const data = dataToSankey(datos, 2017, "EqGWP");
  
  const margin = { top: 10, right: 100, bottom: 10, left: 100 },
    width = 1200,
    height = width * 0.6,
    nodeWidth = 80,
    nodePadding = 10,
    separation = 4;
  
  const innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom;
  
  const formatNumber = d3.format(".0f"), // zero decimal places
    format = function (d) {
      return formatNumber(d) + " " + units;
    };
  
  document.getElementsByClassName("sankey-area")[0].innerHTML="";

  const svg = d3
    .select(".sankey-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(rerenderHandler);
  
  const sank = sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .size([innerWidth, innerHeight])
    .nodeSort((a, b) => b.valtot - a.valtot);
  
  sank.nodeAlign(sankeyCenter);
  const graph = sank(data);
  
  const node = svg
    .append("g")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0 + separation}, ${d.y0})`);
  
  node
    .append("rect")
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0 - 2 * separation)
    .style("fill", (d) => colorNodes(d))
    //.style("fill", (d) => "red")
    .append("title")
    .text(function (d) {
      return d.name + "\n" + format(d.value);
    });
  
  node
    .append("text")
    .attr("x", function (d) {
      if (d.x0 < innerWidth / 3) {
        return -60;
      } else if (d.x0 < (innerWidth * 2) / 3) {
        return 10;
      } else {
        return 20 + sank.nodeWidth();
      }
    })
    .attr("y", (d) => (d.y1 - d.y0) / 2)
    .attr("dy", "0.25em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .attr("font-size", 9)
    //.attr("font-family", "sans-serif")
    .text((d) => d.name);
  
  node
    .attr("cursor", "move")
    .call(
      d3.drag().on("start", dragStart).on("drag", dragMove).on("end", dragEnd)
    );
  
  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.3)
    .selectAll("g")
    .data(graph.links)
    .enter()
    .append("g")
    .style("mix-blend-mode", "multiply");
  
  const path = link
    .append("path")
    .attr("class", "link")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", (d) => colorLinks(d))
    //.attr("stroke", (d) => "blue")
    .attr("stroke-width", (d) => Math.max(1, d.width));
  
  link.append("title").text(function (d) {
    return d.source.name + " → " + d.target.name + "\n" + format(d.value);
  });
  

  function dragStart(event, d) {
    // this.parentNode.appendChild(this);
    // if (this.nextSibling) this.parentNode.appendChild(this);
  
    if (!d.__x) d.__x = event.x;
    if (!d.__y) d.__y = event.y;
    if (!d.__x0) d.__x0 = d.x0;
    if (!d.__y0) d.__y0 = d.y0;
    if (!d.__x1) d.__x1 = d.x1;
    if (!d.__y1) d.__y1 = d.y1;
  }
  
  function dragMove(event, d) {
    d3.select(this).attr("transform", function (d) {
      const dx = event.x - d.__x;
      const dy = event.y - d.__y;
      d.x0 = d.__x0 + dx;
      d.x1 = d.__x1 + dx;
      d.y0 = d.__y0 + dy;
      d.y1 = d.__y1 + dy;
  
      if (d.x0 < 0) {
        d.x0 = 0;
        d.x1 = nodeWidth;
      }
      if (d.x1 > width) {
        d.x0 = width - nodeWidth;
        d.x1 = width;
      }
      if (d.y0 < 0) {
        d.y0 = 0;
        d.y1 = d.__y1 - d.__y0;
      }
      if (d.y1 > innerHeight) {
        d.y0 = innerHeight - (d.__y1 - d.__y0);
        d.y1 = innerHeight;
      }
  
      return `translate(${d.x0 + separation}, ${d.y0})`;
    });
    sank.update(graph);
    path.attr("d", sankeyLinkHorizontal());
  }
  
  function dragEnd(d) {
    delete d.__x;
    delete d.__y;
    delete d.__x0;
    delete d.__x1;
    delete d.__y0;
    delete d.__y1;
  }
}