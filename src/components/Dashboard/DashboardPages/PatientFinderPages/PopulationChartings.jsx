import { FormGroup, FormLabel, Tooltip } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { getStateWisePatientData } from '../../../../api/ckdAPI';
import { getAcronymFromStateName, getStateNameFromAcronym } from '../../../Common/CommonComponent';
import GeoChart from './GeoChart';
import Graph from './Graph';
import './PopulationChartings.css';

const USMapCard = (props)=>{
    return (
        <div className="row py-0">
            <div className="col-12 col-md-7 col-lg-8 py-0 animate__animated animate__fadeInUp animate__delay-3s">
                <div className="chart-card px-3" style={{overflow: "unset"}}>
                    <div className='pt-3 pb-1'>
                        <h3 style={{display: 'inline'}} className="pt-3 pb-1">Geographical Analysis</h3> &nbsp;
                        <span>
                            <Tooltip title="This figure displays the prevalence of specific medical conditions among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medical conditions to customize the display. Display groups can be presented by cohort (default) or by payor type.">
                                <i className='fas fa-info-circle'></i>
                            </Tooltip>
                        </span>
                    </div>
                    <GeoChart stateData={props.stateData} viewPatients={(stateName)=>{
                        props.viewPatients(stateName);
                    }}/>
                </div>
            </div>
            <div className="col-12 col-md-5 col-lg-4 py-1 pb-2 animate__animated animate__fadeInRight animate__delay-3s">
                <div className="chart-card h-100 pb-1">
                    
                        {
                            (Object.keys(props.stateData).length)?(
                                <div className="container-fluid text-center" style={{height: "100%"}}>
                                    <div className="row" style={{display: "flex", height:"45%", alignItems: "center"}}>
                                        <div className="col-12">
                                            <p>Min Patient Count</p>
                                            <p className='display-1'>{props.minCount}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className='hr-line'></div>
                                        </div>
                                    </div>
                                    <div className="row" style={{display: "flex", height:"45%", alignItems: "center"}}>
                                        <div className="col-12">
                                            <p>Max Patient Count</p>
                                            <p className='display-1'>{props.maxCount}</p>
                                        </div>
                                    </div>
                                </div>
                            ):<div className="text-center" style={{display: "flex", height:"100%", alignItems: "center"}}>This statistics will appear when you click on the Update button on the left</div>
                        }
                </div>
            </div>
            <div id="patient-data-show">
                {
                    props.patientData.length>0?(
                        <div style={{overflowX:"hidden"}}className="col-12 animate__animated animate__fadeInRight animate__delay-1s p-0">
                            <div style={{position: "relative", width: "100%", overflowX:"hidden"}} className="chart-card">
                                <table style={{position:"fixed"}} className='table table-sm table-striped'>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Patient Id</th>
                                            <th>Age</th>
                                            <th>State</th>
                                            <th>Gender</th>
                                            <th>Race</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div id="table-container" className="chart-card table-responsive" style={{maxHeight: "500px", overflowY: "auto"}}>
                                    <table className="table table-sm table-striped">
                                        <tbody>
                                            {
                                                props.patientData.map((e,i)=>{
                                                    return (
                                                        <tr key={e.patid}>
                                                            <td>{e.patid}</td>
                                                            <td>{e.pat_age}</td>
                                                            <td>{getStateNameFromAcronym(e.state)}</td>
                                                            <td>{(e.sex=='M'?"Male":(e.sex=='F'?'Female':"Other"))}</td>
                                                            <td>{{"W":"White","B":"Black","H":"Hipsanic","A":"Asian","0":"Other"}[e.race]}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                        
                                    </table>
                                </div>
                            </div>
                        </div>
                    ):""
                }
            </div>
        </div>
    );
}

export class PopulationChartings extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            statewisePatientData: [],
            selectAllTreatmentLabels: false,
            selectAllMedicalLabels: false,
        }
        this.viewPatientInUSState = this.viewPatientInUSState.bind(this);
        this.compareList = this.compareList.bind(this);
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

    viewPatientInUSState(stateName){
        getStateWisePatientData(Cookies.get('userid'), Cookies.get('authToken'), this.props.formFilterObj, getAcronymFromStateName(stateName)).then((response)=>{
            if(response.data.success===1){
                this.setState({statewisePatientData: response.data.data},()=>{
                    document.getElementById("patient-data-show-link").scrollIntoView();
                });
            }else{
                this.props.setMessage(-1, `Technical issue face on fetching the patient data specific to ${stateName}`)    
            }
        }).catch(err=>{
            this.props.setMessage(-1, `Technical issue face on fetching the patient data specific to ${stateName}`)
        });
    }



    render(){
        return (
            <div className="container-fluid">
    
                {/* Treatment Charting Card */}
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 animate__animated animate__fadeInDown animate__delay-1s">
                                <div className="chart-card p-3">
                                    <div className='pb-3'>
                                        <h3 style={{display: 'inline'}}> Treatment Chart </h3> &nbsp;
                                        <span>
                                            <Tooltip title="This figure displays the prevalence of specific medical conditions among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medical conditions to customize the display. Display groups can be presented by cohort (default) or by payor type.">
                                                <i className='fas fa-info-circle'></i>
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div id="treatment-chart" className='chart-body' style={{position:"relative"}}>
                                        <Graph chartData={this.props.treatmentsChartData} name="treatment"/>
                                        {
                                            (Object.keys(this.props.treatmentsChartData).length>0)?(
                                                ""
                                                
                                            ):(
                                                <div style={{height:"100%", width:"100%", backgroundColor:"rgba(0,0,0,0.75)", position:"absolute",top:0, left:0, display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                    <p className="text-white">Chart is currently disabled! Please click <u>Update</u>! and Select the label of you want view from the select option below.</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div style={{zIndex:999}} className="col-12 animate__animated animate__fadeInRight animate__delay-1s">
                                <div style={{overflow:"unset", zIndex:999}} className="chart-card  p-3">
                                    <FormGroup className="formGroup">
                                        <FormLabel className="formLabel">Treatment Chart Labels</FormLabel>
                                        <ReactSelect
                                            options={[{label:"Select All", value:"all"}].concat(this.props.treatmentChartLabels.map(e=>({
                                                label: e.name,
                                                value: e.label_val,
                                                name: e.label,
                                                label_type: e.label_type
                                            })))}
                                            value={this.props.treatmentChartSelectedLabels.map(e=>({
                                                label: e.name,
                                                value: e.label_val,
                                                name: e.label,
                                                label_type: e.label_type
                                            }))}
                                            onChange={(selectedOptions)=>{
                                                this.props.setSelectedTreatmentLabels(
                                                    (
                                                        (selectedOptions.filter(e=>e.value==="all").length>0)?this.props.treatmentChartLabels:selectedOptions.map(e=>({
                                                            label: e.name,
                                                            name: e.label,
                                                            label_val: e.value,
                                                            label_type: e.label_type,
                                                        }))
                                                    )
                                                );
                                            }}
                                            hideSelectedOptions={false}
                                            closeMenuOnSelect={false}
                                            isMulti
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Charting Card */}
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 animate__animated animate__fadeInLeft animate__delay-2s">
                                <div className="chart-card p-3">
                                    <div className='pb-3'>
                                        <h3 style={{display: 'inline'}}> Medical Conditions Chart </h3> &nbsp;
                                        <Tooltip title="This figure displays the prevalence of specific medication use among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medication classes to customize the display. Display groups can be presented by cohort (default) or by payor type.">
                                            <i className='fas fa-info-circle'></i>
                                        </Tooltip>
                                    </div>
                                    <div id="medical-chart" className='chart-body' style={{position:"relative"}}>
                                        <Graph chartData={this.props.medicalChartData} name="medication"/>
                                        {
                                            (Object.keys(this.props.medicalChartData).length>0)?(
                                                ""
                                            ):(
                                                <div style={{height:"100%", width:"100%", backgroundColor:"rgba(0,0,0,0.75)", position:"absolute",top:0, left:0, display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                    <p className="text-white">Chart is currently disabled! Please click <u>Update</u>! and Select the label of you want view from the select option below.</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div style={{zIndex:999}} className="col-12 animate__animated animate__fadeInRight animate__delay-2s">
                                <div style={{overflow:"unset", zIndex:999}} className="chart-card  p-3">
                                    <FormGroup className="formGroup">
                                        <FormLabel className="formLabel">Medical Chart Labels</FormLabel>
                                        <ReactSelect
                                            options={[{label:"Select All", value:"all"}].concat(this.props.medicalChartLabels.map(e=>({
                                                label: e.name,
                                                value: e.label_val,
                                                name: e.label,
                                                label_type: e.label_type
                                            })))}
                                            value={this.props.medicalChartSelectedLabels.map(e=>({
                                                label: e.name,
                                                value: e.label_val,
                                                name: e.label,
                                                label_type: e.label_type
                                            }))}
                                            onChange={(selectedOptions)=>{
                                                this.props.setSelectedMedicalLabels(
                                                    (
                                                        (selectedOptions.filter(e=>e.value==="all").length>0)?this.props.medicalChartLabels:selectedOptions.map(e=>({
                                                            label: e.name,
                                                            name: e.label,
                                                            label_val: e.value,
                                                            label_type: e.label_type,
                                                        }))
                                                    )
                                                );
                                            }}
                                            hideSelectedOptions={false}
                                            closeMenuOnSelect={false}
                                            isMulti
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <USMapCard minCount={this.props.minPatientCount} maxCount={this.props.maxPatientCount} patientData={this.state.statewisePatientData} stateData={this.props.stateData} viewPatients={this.viewPatientInUSState}/>
    
            </div>
        );
    }
}