import React, { useRef, useState, useEffect, createRef } from "react";
import * as d3 from 'd3';
import { select } from 'd3';
import mapData from './usState.json';
import './GeoChart.css';
import { getStateNameFromAcronym } from "../../../../Common/CommonComponent";
import { Button, Tooltip } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
//import jsPDF from "jspdf";

class GeoChart extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            svgRef : createRef(),
            wrapperRef : createRef(),
            states: {},
            prevStateData: {},
            isPatientFinderDefApplied: false,
        }
    }
    
    compareList(arr1, arr2){
        if(arr1.length === arr2.length){
            for(let i=0;i<arr1.length;i++){
                if(!arr2.includes(arr1[i])){
                    return false
                }
            }
        }else{
            return false
        }
        return true;
    }
    
    componentDidUpdate(){
        const EPSILON=1e-6;
        function geoAlbersUsaPr() {
            var cache, cacheStream,
                lower48 = d3.geoAlbers(), lower48Point,
                alaska = d3.geoConicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint,
                hawaii = d3.geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint,
                puertoRico = d3.geoConicEqualArea().rotate([66, 0]).center([0, 18]).parallels([8, 18]), puertoRicoPoint,
                point, pointStream = { point: function (x, y) { point = [x, y]; } };
    
            function albersUsa(coordinates) {
                var x = coordinates[0], y = coordinates[1];
                return point = null, (lower48Point.point(x, y), point) || (alaskaPoint.point(x, y), point) || (hawaiiPoint.point(x, y), point) || (puertoRicoPoint.point(x, y), point);
            }
    
            albersUsa.invert = function (coordinates) {
                var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
                return (
                    y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
                    : (
                        y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
                        : (
                            y >= 0.204 && y < 0.234 && x >= 0.320 && x < 0.380 ? puertoRico
                            : lower48
                        )
                    )
                ).invert(coordinates);
            };
    
            albersUsa.stream = function (stream) {
                return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream), puertoRico.stream(stream)]);
            };
    
            albersUsa.precision = function (_) {
                if (!arguments.length) return lower48.precision();
                lower48.precision(_), alaska.precision(_), hawaii.precision(_), puertoRico.precision(_);
                return reset();
            };
    
            albersUsa.scale = function (_) {
                if (!arguments.length) return lower48.scale();
                lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_), puertoRico.scale(_);
                return albersUsa.translate(lower48.translate());
            };
    
            albersUsa.translate = function (_) {
                if (!arguments.length) return lower48.translate();
                var k = lower48.scale(), x = +_[0], y = +_[1];
    
                lower48Point = lower48
                    .translate(_)
                    .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
                    .stream(pointStream);
    
                alaskaPoint = alaska
                    .translate([x - 0.307 * k, y + 0.201 * k])
                    .clipExtent([[x - 0.425 * k + EPSILON, y + 0.120 * k + EPSILON], [x - 0.214 * k - EPSILON, y + 0.234 * k - EPSILON]])
                    .stream(pointStream);
    
                hawaiiPoint = hawaii
                    .translate([x - 0.205 * k, y + 0.212 * k])
                    .clipExtent([[x - 0.214 * k + EPSILON, y + 0.166 * k + EPSILON], [x - 0.115 * k - EPSILON, y + 0.234 * k - EPSILON]])
                    .stream(pointStream);
    
                puertoRicoPoint = puertoRico
                    .translate([x + 0.350 * k, y + 0.224 * k])
                    .clipExtent([[x + 0.320 * k, y + 0.204 * k], [x + 0.380 * k, y + 0.234 * k]])
                    .stream(pointStream).point;
    
                return reset();
            };
    
            function reset() {
                cache = cacheStream = null;
                return albersUsa;
            }
    
            return albersUsa.scale(1070);
        }
    
        function multiplex(streams) {
            const n = streams.length;
            return {
                point(x, y) { for (const s of streams) s.point(x, y); },
                sphere() { for (const s of streams) s.sphere(); },
                lineStart() { for (const s of streams) s.lineStart(); },
                lineEnd() { for (const s of streams) s.lineEnd(); },
                polygonStart() { for (const s of streams) s.polygonStart(); },
                polygonEnd() { for (const s of streams) s.polygonEnd(); }
            };
        }
        const svg = select(this.state.svgRef.current);
        if(this.props.stateData && this.props.stateData.states){
            const states = {};
            Object.keys(this.props.stateData.states).map(e => {
                states[getStateNameFromAcronym(e)] = this.props.stateData.states[e];
            });
            if (!this.compareList(Object.keys(states), Object.keys(this.state.prevStateData))) {
                
                this.setState({
                    prevStateData: this.state.states,
                    states: states,
                    isPatientFinderDefApplied: true
                });
            }
        

            //Width and height of map
            const width = 960, height = 500; /* Setting default */
    
            /* Translate map to the center of screen and scale things down so see entire US*/
            var projection = geoAlbersUsaPr().scale(width).translate([(width / 2)-50, height / 2]);
            var path = d3.geoPath().projection(projection);
    
            // US-state Highlight colors - for showing patient population density
            var colorScale = d3.scaleThreshold().domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000]).range(d3.schemeGreens[7]);
    
    
            // Creating a Tool tip for state highlighting & displaying patient population counts
            var tooltip = d3.select(".map-tooltip")
                        .style("opacity", 0)
                        .attr("position", "relative")
                        .style("padding", "5px");
    
            let mouseOver = function (event, d) {
                tooltip.style("opacity", 1).html(`${d.properties.name} \n Patient count: ${states[d.properties.name] || 0}`)
                .style("left", 0).style("top", "1px");
                d3.selectAll(".states").transition().style("opacity", 1);
                d3.select(this).transition().style("opacity", 0.5).style("cursor", "pointer");
            }
    
            /** Upon mouse leave the US-state: unhighlight/change color of the hovered US-state back to original US-state color */
            let mouseLeave = function (event, d) {
                tooltip.style("opacity", 0).style("left", event.screenX + "px").style("top", event.pageY + "px");
                d3.selectAll(".states").transition().style("opacity", 1);
                d3.select(this).transition().style("opacity", 1);
            }
    
    
            svg.append("g")
                .selectAll("path").data(mapData.features).enter().append("path").attr("fill", '#6495ED').attr("class", "states").attr("d", path)
                .attr("fill", function (d) {
                    let val = states[d.properties.name] || 0;
                    return colorScale(val * 1000000);
                }).on("click", (event, d)=>{this.props.viewPatients(d.properties.name)})
                .attr("class", "states").style("stroke", "black")
                .on("mouseover", mouseOver).on("mouseleave", mouseLeave)
        }
    }

    downloadGraph = () => {
        /* 
            TODO: Download US Map [GENERAL ALGORITHM]
            - Create a US Map using several img tags with srcset of US states
            - Create an Absolute positioned div for each img tag for a US state. This absolute position div will contain numerical figure
            - Encapsulate all state in a div tag and set id="map-fig-download"
            - Use HTML to PDF package to download the figure from #map-fig-download component
            - [OPTIONAL] You can also create a legend for indicating:
                - Population density color indication
                - Population of small state that are less than a certain width/ height. That is less than this threshold width/height will make the text inside the absolute component overflows the US state image.
        */
    }


    render(){
        return (
            <div id="map-graph" style={{position:"relative"}} className="container-fluid p-2">
                <div style={(!this.state.isPatientFinderDefApplied)?({position:"relative"}):({position:"unset"})} className="map-style col-12">
                    <div ref={this.state.wrapperRef} style={{ display: 'flex', width: "100%"}}>
                        <svg id="geoAlberMap" ref={this.state.svgRef}>
                        </svg>
                        {
                            (!this.state.isPatientFinderDefApplied)?(
                                <div id="map-blocker" key="map-show-blocker" style={{display:"flex"}} className="text-center map-blocker">
                                    <p>This Map is currently disabled. Please apply the Patient Finder definition on the right and Click on <strong><u>Update</u></strong> to see any changes</p>
                                </div>      
                            ):("")
                        }
                        <div style={{position: "absolute", backgroundColor:"white"}} className="map-tooltip"></div>
                        
                    </div>
                </div>
                <div className="col-12 text-end">
                    <Tooltip title="This feature is not available yet. Coming soon">
                        {
                            <Button id={'map-download'}
                                    onClick={()=>this.downloadGraph()}
                                    className="download-icon"
                                    color='primary'
                                    variant='contained'
                                    // disabled={true}
                                    style={{color:'white'}}>
                                    <FileDownloadIcon/>
                                    Download
                            </Button>
                        }
                    </Tooltip>
                </div>
            </div>
        );
    }
    
}

export default React.memo(GeoChart)
