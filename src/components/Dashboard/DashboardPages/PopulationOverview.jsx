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
            populationFigures: [

            ],
            isDataFetched: true,
            ageData: {},
            raceData: {},
            insuranceData: {},
        }
    }

    componentDidMount(){
        // Call API here ...
        getPopulationOverviewData(Cookies.get("userid"), Cookies.get("authToken")).then((response)=>{
            if(response.data.success=="1"){ 
                const ageData = {}
                response.data.data.ageData.map(e=>{ageData[e.group]=e.count;})
                const raceData = {}
                response.data.data.raceData.map(e=>{raceData[e.race]=e.count;})
                const insuranceData = {}
                response.data.data.insuranceData.map(e=>{insuranceData[e.paytyp]=e.count;})

                this.setState({
                    ageData: ageData,
                    raceData: raceData,
                    insuranceData: insuranceData,
                    isDataFetched: true
                });

            }else{
                this.setState({isDataFetched: false})
            }
        }).catch((err)=>{
            this.setState({isDataFetched: false})
        });
    }

    render(){
        return (
            <div className="population-overview container-fluid">
                {
                    (this.state.isDataFetched)?
                    (
                        <div style={{marginTop:"20vh"}} className="row">
                            <div className="col-12 animate__animated animate__fadeIn animate__delay-1s">
                                <PieChart />
                            </div>
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