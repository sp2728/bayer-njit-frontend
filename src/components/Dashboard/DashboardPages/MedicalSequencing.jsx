import { Button, FormGroup, FormLabel, Tooltip } from "@mui/material";
import React from "react";
import ReactSelect from 'react-select';
import './MedicalSequencing.css';
import "./MedicalSequencingPages/index";
import { initializeSankey } from "./MedicalSequencingPages/index";


import * as d3 from "d3";


export class MedicalSequencing extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            /* format for xxxSelections={label,value} */
            ageSelections: [],
            regionSelections: [],
            t2dmSelections: [],
            treatmentSelections: [],

            selectedTreatmentPredefinedGroup: 0, /* 0: No Treatment Only (default), 1: All Other Treatments, 2: All Treatments */
            treatmentYearRange: 1, /* Min: 1 year, Max 3 years */

            isSankeyLoaded: false,

        }
    }

    

    render(){        

        return (
            <div style={{paddingTop:"20vh", paddingBottom:"50px", minHeight: "100vh"}} className="container medical-sequencing">
                <div className="row chart-card p-4 animate__animated animate__fadeInLeft animate__delay-1s">
                    <div className="col-12">
                        <h3>Patient Filters</h3>
                    </div>
                    <div className="col-12 col-lg-8 py-2">
                        <FormGroup className="formGroup">
                            <FormLabel className="formLabel">
                                Age&nbsp;
                                <Tooltip title="Select age groups that is included in below Medical Sequencing Sankey Diagram.">
                                    <i className='fas fa-info-circle'></i>
                                </Tooltip>
                            </FormLabel>
                            <ReactSelect
                                options={[{label:"Select All", value:"all"}].concat(this.state.ageSelections)}
                                value={this.state.ageSelections}
                                onChange={(selectedOptions)=>{
                                        this.setState();
                                            (selectedOptions.filter(e=>e.value==="all").length>0)?this.state.ageSelections:selectedOptions
                                }}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                isMulti
                            />
                        </FormGroup>
                    </div>
                    <div className="col-12 col-lg-4 py-2">
                        <FormGroup className="formGroup">
                            <FormLabel className="formLabel">
                                T2DM&nbsp;
                                <Tooltip title="Select a Type-2 Diabetic Mellitus values">
                                    <i className='fas fa-info-circle'></i>
                                </Tooltip>
                            </FormLabel>
                            <ReactSelect
                                options={[{label:"Select All", value:"all"}].concat(this.state.t2dmSelections)}
                                value={this.state.t2dmSelections}
                                onChange={(selectedOptions)=>{
                                        this.setState();
                                            (selectedOptions.filter(e=>e.value==="all").length>0)?this.state.t2dmSelections:selectedOptions
                                }}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                isMulti
                            />
                        </FormGroup>
                    </div>
                    <div className="col-12 col-lg-12 py-2">
                        <FormGroup className="formGroup">
                            <FormLabel className="formLabel">
                                Region&nbsp;
                                <Tooltip title="Select US-based regions whose patients need to be included in below Medical Sequencing Sankey Diagram.">
                                    <i className='fas fa-info-circle'></i>
                                </Tooltip>
                            </FormLabel>
                            <ReactSelect
                                options={[{label:"Select All", value:"all"}].concat(this.state.regionSelections)}
                                value={this.state.regionSelections}
                                onChange={(selectedOptions)=>{
                                        this.setState();
                                            (selectedOptions.filter(e=>e.value==="all").length>0)?this.state.regionSelections:selectedOptions
                                }}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                isMulti
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row animate__animated animate__fadeIn animate__delay-1s">
                    <div className="col-12">
                        <div className="hr-line"></div>
                    </div>
                </div>
                <div className="row chart-card p-4 animate__animated animate__fadeInRight animate__delay-1s">
                    <div className="col-12">
                        <h3>Treatment Filters</h3>
                    </div>
                    <div className="col-12 col-lg-5  py-2">
                        <FormGroup className="formGroup">
                            <FormLabel className="formLabel">
                                Starting Treatment&nbsp;
                                <Tooltip title="Select patients who are started with specific treatment(s)">
                                    <i className='fas fa-info-circle'></i>
                                </Tooltip>
                            </FormLabel>
                            <ReactSelect
                                options={[{label:"Select All", value:"all"}].concat(this.state.treatmentSelections)}
                                value={this.state.treatmentSelections}
                                onChange={(selectedOptions)=>{
                                        this.setState();
                                            (selectedOptions.filter(e=>e.value==="all").length>0)?this.state.treatmentSelections:selectedOptions
                                }}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                isMulti
                            />
                        </FormGroup>
                    </div>
                    <div className="col-12 col-lg-3 px-3 py-2">
                        <div>
                            <label>Load Pre-defined Groups</label>
                        </div>
                        <div>
                            <input type="radio" 
                                name="treatmentPredefinedGroup" id="tpg-no-treatment" value="0" 
                                onChange={e=>{this.setState({selectedTreatmentPredefinedGroup:0})}} 
                                checked={this.state.selectedTreatmentPredefinedGroup==0} /> <label htmlFor="tpg-no-treatment">No Treatment</label>
                        </div>
                        <div>
                            <input type="radio" 
                                name="treatmentPredefinedGroup" id="tpg-all-other-treatments" value="1" 
                                onChange={e=>{this.setState({selectedTreatmentPredefinedGroup:0})}} 
                                checked={this.state.selectedTreatmentPredefinedGroup==1}/> <label htmlFor="tpg-all-other-treatments">All Other Treatments</label>
                        </div>
                        <div>
                            <input type="radio"
                                name="treatmentPredefinedGroup" id="tpg-all-treatments" value="2" 
                                onChange={e=>{this.setState({selectedTreatmentPredefinedGroup:0})}} 
                                checked={this.state.selectedTreatmentPredefinedGroup==2}/> <label htmlFor="tpg-all-treatments">All Treatments</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 py-2">
                        <label color="rgba(0, 0, 0, 0.6)">
                            Range of Years&nbsp;
                            <Tooltip title="Select the starting and ending years.">
                                <i className='fas fa-info-circle'></i>
                            </Tooltip>
                        </label>
                    </div>
                </div>
                <div className="row animate__animated animate__fadeIn animate__delay-1s">
                    <div className="col-12 text-center p-4">
                        <Tooltip title="Generate Sankey Diagram based on above selected figure values.">
                            <Button onClick={(e)=>{ 
                                
                                initializeSankey(()=>{ this.setState(); });
                                document.getElementsByClassName("sankey-area")[0].scrollIntoView();

                            }} sx={{width:'200px'}} variant="contained">
                                Update
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="row animate__animated animate__fadeIn animate__delay-1s">
                    <div className="col-12">
                        <div className="hr-line"></div>
                    </div>
                </div>
                <div style={{maxWidth:"100%", overflowX:"auto"}} className="row chart-card p-4 animate__animated animate__fadeIn animate__delay-1s">
                    <div  className="col-12">
                        <h3>Medical Sequencing diagram</h3>
                        <p><small>Note: This feature is currently under development. The diagram presented below is just for demonstration.</small></p>
                    </div>
                    <div  className="col-12">
                        <div className="sankey-area"></div>
                    </div>

                </div>
            </div>
        );
    }
}