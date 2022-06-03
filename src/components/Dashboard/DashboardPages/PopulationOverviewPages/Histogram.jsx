import React, { useEffect } from 'react'
import * as d3 from 'd3';

class Histogram extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: 0,
            height: 0,
            margin: 0,
            isDataPlaced: false
        };
    }

    componentDidMount(){
        const margin = { top: 30, right: 30, bottom: 30, left: 50 },
        width = 400 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;
        this.setState({
            width,
            height,
            margin,
        })
    }

    componentDidUpdate(){
        let sourceNames = Object.keys(this.props.data), sourceCount = Object.values(this.props.data);
        var x = d3.scaleBand().rangeRound([0, this.state.width]).padding(0.1);
        var y = d3.scaleLinear().rangeRound([this.state.height, 0]);

        x.domain(sourceNames);
        y.domain([0, d3.max(sourceCount, function (d) { return d; })]);

        try{
            document.getElementById(`histogram-${this.props.id}`).innerHTML="";
            const dataObj = this.props.data;
            const height = this.state.height, width = this.state.width;
            var svg = d3
                .select(`#histogram-${this.props.id}`)
                .append("svg")
                .attr("width", this.state.width + this.state.margin.left + this.state.margin.right)
                .attr("height", this.state.height + this.state.margin.top + this.state.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + this.state.margin.left + "," + this.state.margin.top + ")");

            svg
                .append("g")
                .attr("transform", "translate(0," + this.state.height + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y).ticks(3))

            svg.append("text")
                .attr("x", (this.state.width / 2))
                .attr("y", 0 - (this.state.margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text(`${this.props.title}`);

            // Create rectangles
            let bars = svg.selectAll('.bar')
                .data(sourceNames)
                .enter()
                .append("g");

            bars.append('rect')
                .attr('class', 'bar')
                .attr("fill", "#F7996E")
                .attr("x", function (d) { return x(d); })
                .attr("y", function (d) { return y(dataObj[d]); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(dataObj[d]); })

            bars.append("text")
                .text(function (d) {
                    return dataObj[d];
                })
                .attr("x", function (d) {
                    return x(d) + x.bandwidth() / 2;
                })
                .attr("y", function (d) {
                    return y(dataObj[d]) - 5;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black")
                .attr("text-anchor", "middle");
            if(!this.state.isDataPlaced && sourceNames.length>0){
                this.setState({
                    isDataPlaced: true
                });    
            }
        } catch(err){
            //console.log(err);
        }

    }
    render(){
        return <div id={`histogram-${this.props.id}`} className="chart-card p-2" align="center"></div>
    }
}

export default React.memo(Histogram)
