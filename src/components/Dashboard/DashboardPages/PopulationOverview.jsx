import Cookies from "js-cookie";
import React from "react";
import { getPopulationOverviewData } from "../../../api/ckdAPI";
import './PopulationOverview.css';
import Histogram from "./PopulationOverviewPages/Histogram";
import PieChart from "./PopulationOverviewPages/PieChart";

export class PopulationOverview extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentSelection: 0,
            paytypChoice: 0,
            totalPopulation: "NaN",
            populationCount: "NaN",
            populationFigures: [

            ],
            isDataFetched: true,
            pieChartData: {},
            ageData: {},
            raceData: {},
            insuranceData: {},
        }
        this.callPopulationOverviewAPI = this.callPopulationOverviewAPI.bind(this);
    }

    callPopulationOverviewAPI(paytypChoice){
        getPopulationOverviewData(Cookies.get("userid"), Cookies.get("authToken"), paytypChoice).then((response)=>{
            if(response.data.success=="1"){ 
                const ageData = {}
                response.data.data.ageData.map(e=>{ageData[e.group]=e.count;})
                const raceData = {}
                response.data.data.raceData.map(e=>{raceData[e.race]=e.count;})
                const insuranceData = {}
                response.data.data.insuranceData.map(e=>{insuranceData[e.prdtyp]=e.count;})
                const pieChartData = {}
                response.data.data.pieChartData.map(e=>{pieChartData[e.pop]=e.count;})

                this.setState({
                    paytypChoice: paytypChoice,
                    ageData: ageData,
                    raceData: raceData,
                    insuranceData: insuranceData,
                    totalPopulation: response.data.data.totalPopulation,
                    populationCount: response.data.data.populationCount,
                    pieChartData: pieChartData,
                    isDataFetched: true
                });

            }else{
                this.setState({isDataFetched: false})
            }
        }).catch((err)=>{
            this.setState({isDataFetched: false})
        });
    }

    componentDidMount(){
        this.callPopulationOverviewAPI(0);
    }

    render(){
        return (
            <div className="population-overview container-fluid pb-4">
                {
                    (this.state.isDataFetched)?
                    (
                        <div style={{marginTop:"20vh"}} className="row">
                            <div className="col">
                                <div className="row">
                                    <div className="col-12 col-lg-4 animate__animated animate__fadeIn animate__delay-1s py-4" style={{
                                            display: "flex",
                                            alignItems: "center",
                                    }}>
                                        <div className="row chart-card responsive-font" style={{
                                            height: "100%",
                                            alignItems: "center"
                                        }}>
                                            <form className="col-12" action="get" onSubmit={(e)=>{this.callPopulationOverviewAPI(this.state.paytypChoice);}}>
                                                <div className="row p-4">
                                                    <h2 style={{fontWeight: "700", fontSize:"20px"}}>Population Overview Definition</h2>
                                                    <div className="col-12 p-1">
                                                        <i className="fa fa-users" aria-hidden="true"></i>&nbsp; Total Population: {this.state.totalPopulation}
                                                    </div>
                                                    <div className="col-12 p-1">
                                                        <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp; Population count: {this.state.populationCount}
                                                    </div>
                                                    <div className="col-12 p-1">
                                                        <i className="fa fa-percent" aria-hidden="true"></i>&nbsp; Insurance contribution: {(this.state.populationCount==="NaN"||this.state.totalPopulation==="NaN"||this.state.totalPopulation=="0")?"NaN":((parseFloat(this.state.populationCount)/parseFloat(this.state.totalPopulation)).toPrecision(2)*100)} % of {this.state.totalPopulation} (Total Population)
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 p-4">
                                                        <label htmlFor="population-overview-paytyp">Please select Insurance payer type from below*:</label>
                                                        <select style={{
                                                            padding: "5px 20px", height: "40px", width: "100%", textAlign: "center",
                                                            borderRadius: "10px",
                                                        }} name="paytyp" id="population-overview-paytyp" onChange={(e)=>{ this.setState({paytypChoice: e.target.value}, ()=>{
                                                            this.callPopulationOverviewAPI(this.state.paytypChoice);
                                                        }); }}>
                                                            <option value="0" selected={this.state.paytypChoice===0}>Both</option>
                                                            <option value="1" selected={this.state.paytypChoice===1}>Commercial</option>
                                                            <option value="2" selected={this.state.paytypChoice===2}>Medicare</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-8 animate__animated animate__fadeIn animate__delay-1s">
                                        <PieChart data={this.state.pieChartData} />
                                    </div>
                                </div>
                                <div className="row animate__animated animate__fadeIn animate__delay-1s">
                                    <div className="col">
                                        <div className="hr-line"></div>
                                    </div>
                                </div>
                                <div className="row animate__animated animate__fadeIn animate__delay-1s">
                                    <div className="col">
                                        <h3 style={{fontFamily:"Montserrat, sans-serif", fontWeight:"bold"}}>Charting Insights</h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-xl-4 animate__animated animate__fadeInLeft animate__delay-1s">
                                        {(this.state.ageData)?<Histogram id="1" data={this.state.ageData} title="Age"/>:""}
                                    </div>
                                    <div className="col-12 col-xl-4 animate__animated animate__fadeInUp animate__delay-1s">
                                        {(this.state.raceData)?<Histogram id="2" data={this.state.raceData} title="Race"/>:""}
                                    </div>
                                    <div className="col-12 col-xl-4 animate__animated animate__fadeInRight animate__delay-1s">
                                        {(this.state.insuranceData)?<Histogram id="3" data={this.state.insuranceData} title="Insurance"/>:""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ):(
                        <div className="row p-5">
                            <div style={{minHeight:"100vh"}} className="col">
                                <div style={{textAlign:"center", width:"70%", paddingTop:"30vh", margin: "auto"}}>
                                    <p className="h2">404 Not Found</p>
                                    <p className="pt-3">Population Overview data could not be retreived or displayed!</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}