import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormLabel, IconButton, Tooltip, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { editUserPreferences, getLabels, getMedicalData, getStateLabels, getStatesData, getTreatmentsData, getUserPreferences } from "../../../api/ckdAPI";
import { getStateNameFromAcronym } from "../../Common/CommonComponent";
import './PatientFinder.css';
import { PopulationChartings } from "./PatientFinderPages/PopulationChartings";
import {UserPreferences} from "./PatientFinderPages/UserPreferences/UserPreferences"
import { NotFound } from "../../NotFound";

/** Render Accordian (Slide-dropdown boxes) part of the Side-Panel menu of Patient Finder */
export class AccordianMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: props.expanded,
            selectAll: false,
            showMoreLabels: false,
        }
    }

    render(){
        return (
            <Accordion expanded={this.state.expanded} disableGutters square key={`ckd-${this.props.accordianId}`} onChange={()=>{this.setState({expanded: !this.state.expanded, showMoreLabels: false})}}>
                <AccordionSummary expandIcon={<i className="fa fa-bars" aria-hidden="true"></i>} aria-controls={`ckd-${this.props.accordianId}`} id={`ckd-${this.props.accordianId}`}>
                    <FormLabel className="formLabel">
                        {this.props.name}&nbsp;
                        <Tooltip title={this.props.description}>
                            <IconButton sx={{fontSize: "16px", top:"-2px"}}><i className="fa fa-info-circle" aria-hidden="true"></i></IconButton>
                        </Tooltip>
                    </FormLabel>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="checkbox-grid">
                        <FormControlLabel key={`ckd-${this.props.accordianId}-all`}
                            control={
                                <Checkbox checked={this.state.selectAll} sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                    onChange={(e) => {
                                        this.setState({
                                            selectAll: !this.state.selectAll
                                        }, ()=>{
                                            this.props.updateSelectedValueSet(
                                                (this.state.selectAll)?(
                                                    new Set(
                                                        this.props.labels.map((e,i)=>{
                                                            return e.label_val
                                                        })
                                                    )
                                                ):new Set()
                                            );
                                        });
                                    }} name='selectAll' />
                            }
                            label={<Typography variant="body2" color="textSecondary">Select All</Typography>} />

                        {
                            ((this.state.showMoreLabels)?this.props.labels:this.props.labels.slice(0, 5)).map((labelData, i) => {
                                if (i < 4 || this.state.showMoreLabels) {
                                    return (
                                        <FormControlLabel className="checkbox-labels" key={labelData.label}
                                            control={
                                                <Checkbox
                                                    checked={this.props.selectedLabelData.has(labelData.label_val)}
                                                    sx={{ display: "block", '& .MuiSvgIcon-root': { fontSize: 20} }}
                                                    onChange={(e) => { 
                                                        this.props.updateSelectedValueSet(
                                                            (this.props.selectedLabelData.delete(labelData.label_val))? this.props.selectedLabelData
                                                                : this.props.selectedLabelData.add(labelData.label_val)
                                                        );

                                                        this.setState({
                                                            selectAll: (this.state.selectAll && this.props.selectedLabelData.has(labelData.label_val)) || this.props.labels.length===this.props.selectedLabelData.size
                                                        });
                                                    }}
                                                    name={labelData.label} />
                                            }
                                            label={<Typography variant="body2" color="textSecondary">{labelData.name}</Typography>} />
                                    )
                                }
                                else {
                                    return (
                                        <div className="moreButton" key={`${this.props.accordianId}-moreButton`}>
                                            <Button onClick={() => this.setState({showMoreLabels: true})} >And More {this.props.labels.length - 5} </Button>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        );
    }
}

/** Render Side Panel (Menu) part of the Patient Finder dashboard */
class SidePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isSidebarToggleActive: false, /* Mobile Responsive feature */

            userPreferenceList: [],
            defaultPreference: -1,
            selectedPreference: -1,

            /* dynamic data: on API-fetched state data */
            stateLabels: [],

            /* static data */
            groupByType: "cohort",
            groupBy: [],

            /* Accordian Data */
            selectedStateLabelData: new Set(),
            selectedMedicalConditionORLabelData: new Set(),
            selectedMedicalConditionANDLabelData: new Set(),
            selectedTreatmentORLabelData: new Set(),
            selectedTreatmentANDLabelData: new Set(),

            isPreferenceSaveButtonActive: false,

            isUpdateButtonDisabled: true,

            labelError: false, /* For notifying API related errors ... */
        }

        this.createGroupByOptions = this.createGroupByOptions.bind(this);
        this.showPreference = this.showPreference.bind(this);
        this.getUserPreferenceIndexByPreferenceId = this.getUserPreferenceIndexByPreferenceId.bind(this);
        this.updateSelectedValueSet = this.updateSelectedValueSet.bind(this);
        this.sendFilterDataToGraph = this.sendFilterDataToGraph.bind(this);
        this.refreshPreference=this.refreshPreference.bind(this);
        this.savePreferences=this.savePreferences.bind(this);
    }
    
    componentDidMount(){
        
        /* Fetching API data */
        
        /* TODO: Replace below API with userData present in the cookie */
        getStateLabels(Cookies.get('userid'), Cookies.get('authToken')).then((response)=>{
            if(response.data.success===1){/* On Success read state data */
                this.setState({
                    labelError: false,
                    stateLabels: response.data.data.map((e=>{ /* Making API-data for state suitable for Accordian component class use ... */
                        return {
                            label: e.state,
                            name: getStateNameFromAcronym(e.state),
                            label_val: e.state,
                        }
                    }))
                })
            } else {
                this.setState({
                    labelError: true
                },()=>{
                    this.props.showMessage(-1, "There seems to be a technical issue on retreiving state labels from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            }
        }).catch(err=>{
            this.setState({
                labelError: true
            },()=>{
                this.props.showMessage(-1, "There seems to be a technical issue on retreiving state labels from the server! Please hit refresh or try again later ...");
                setTimeout(()=>{this.props.showMessage(0, "")},15000);
            });
        });

        this.refreshPreference()

    }

    refreshPreference(){
        getUserPreferences(Cookies.get('userid'), Cookies.get('authToken')).then((response)=>{
            if(response.data.success===1){/* On Success read state data */
                this.setState({
                    labelError: false,
                    userPreferenceList: response.data.data.preferenceList,
                    defaultPreference: response.data.data.defaultPreferenceId,
                    selectedPreference: response.data.data.defaultPreferenceId
                }, ()=>{
                    this.showPreference(this.state.selectedPreference);
                })
            } else {
                this.setState({
                    labelError: true
                },()=>{
                    this.props.showMessage(-1, "There seems to be a technical issue on retreiving state labels from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            }
        }).catch(err=>{
            this.setState({
                labelError: true
            },()=>{
                this.props.showMessage(-1, "There seems to be a technical issue on retreiving state labels from the server! Please hit refresh or try again later ...");
                setTimeout(()=>{this.props.showMessage(0, "")},15000);
            });
        });
    }

    getUserPreferenceIndexByPreferenceId(preferenceId){
        return this.state.userPreferenceList.map(e=>{
            return e.id
        }).indexOf(preferenceId);
    }

    savePreferences(preferenceId){

        if(preferenceId>0){
            const preferenceData = this.state.userPreferenceList.filter(e=>e.id==preferenceId)[0]
            editUserPreferences(Cookies.get('userid'), Cookies.get('authToken'), preferenceId, preferenceData.saveName, {
                "group_condition": {
                    "group_by": this.state.groupByType,
                    "selection": this.state.groupBy,
                },
                "states": Array.from(this.state.selectedStateLabelData)
            }, this.state.defaultPreference==preferenceId).then((response)=>{
                if(response.data.success===1){/* On Success read state data */
                    this.setState({
                        labelError: false,
                        userPreferenceList: this.state.userPreferenceList.filter(e=>e.id!=preferenceId).concat(response.data.data),
                    })
                } else {
                    this.setState({
                        labelError: true
                    },()=>{
                        this.props.showMessage(-1, "There seems to be a technical issue on retreiving state labels from the server! Please hit refresh or try again later ...");
                        setTimeout(()=>{ this.props.showMessage(0, "")},15000);
                    });
                }
            }).catch(err=>{
                this.setState({
                    labelError: true
                },()=>{
                    this.props.showMessage(-1, "There seems to be a technical issue on retreiving state labels from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            });
        }else{
            this.props.showMessage(1, "Please create atleast one preference by '+ Create New Preferences'!");
            setTimeout(()=>{this.props.showMessage(0, "")},15000);
        }

        
    }

    showPreference(preferenceId){
        let preFilledStateLabels=new Set(), preFilledGroupByType="cohort", preFilledGroupBy=[]; 
        if(this.state.userPreferenceList.length>0){
            let currentPreferences = this.state.userPreferenceList.filter(e=>{return e.id==preferenceId});
            if(currentPreferences.length===0){
                currentPreferences = this.state.userPreferenceList;
            }
            preFilledStateLabels = new Set(currentPreferences[0].jsonData.states);
            preFilledGroupByType = currentPreferences[0].jsonData.group_condition.group_by;
            preFilledGroupBy = currentPreferences[0].jsonData.group_condition.selection;
            
        }
        this.setState({
            selectedPreference: preferenceId,
            selectedStateLabelData: preFilledStateLabels,
            groupByType: preFilledGroupByType,
            groupBy: preFilledGroupBy,
        },()=>{
            this.setState({
                isUpdateButtonDisabled: this.state.selectedStateLabelData.size < 1 || this.state.groupBy.length < 1
            })
        });
    }


    updateSelectedValueSet(labelKey, updatedSet){
        const stateObj = {};
        stateObj[labelKey] = updatedSet;
        this.setState(stateObj,()=>{
            this.setState({
                isUpdateButtonDisabled: this.state.selectedStateLabelData.size < 1 || this.state.groupBy.length < 1
            });
        });
    }

    createGroupByOptions(type, value){
        return (
            <div key={`ckd-${type}-${value}`}>
                <input onChange={(e)=>{ 
                    if(this.state.groupBy.includes(e.target.value)){
                        this.setState({
                            groupBy: this.state.groupBy.filter((e)=>{
                                return e!==value.toLowerCase();
                            })
                        }, ()=>{
                            this.setState({
                                isUpdateButtonDisabled: this.state.selectedStateLabelData.size < 1 || this.state.groupBy.length < 1
                            });
                        });
                    }else{
                        this.setState({groupBy: this.state.groupBy.concat([e.target.value])}, ()=>{
                            this.setState({
                                isUpdateButtonDisabled: this.state.selectedStateLabelData.size < 1 || this.state.groupBy.length < 1
                            });
                        });
                    }
                }} type="checkbox" name="groupby" id={`ckd-${type}-${value}`} value={value.toLowerCase()} checked={this.state.groupBy.includes(value.toLowerCase())} /> &nbsp;
                <label className="m-0" htmlFor={type}>{value}</label>
            </div>
        );
    }

    sendFilterDataToGraph(e){
        
        e.preventDefault();
        document.getElementById("dash").scrollTop=0;
        this.props.updateGraph({
            "group_condition": {
                "group_by": this.state.groupByType,
                "selection": this.state.groupBy,
            },
            "states": Array.from(this.state.selectedStateLabelData),
            "medical_conditions": {
                "labels": [], /* Getting labels from graph display side component of Patient Finde*/
                "OR": Array.from(this.state.selectedMedicalConditionORLabelData),
                "AND": Array.from(this.state.selectedMedicalConditionANDLabelData)
            },
            "treatments": {
                "labels": [], /* Getting labels from graph display side component of Patient Finde*/
                "OR": Array.from(this.state.selectedTreatmentORLabelData),
                "AND": Array.from(this.state.selectedTreatmentANDLabelData)
            }
        })
    }

    render(){
        return (
            <form onSubmit={this.sendFilterDataToGraph} action="post" className={"container-fluid pb-5 sidebar-form"}>
                <div className="row">
                    <div className={((this.state.isSidebarToggleActive)?"open":"")+" pt-5 col-12 side-panel-content"}>

                        <div className="display-lg-none button-bar row pb-5">
                            <div className="col text-right">
                                <button id="side-mobbar-btn" style={{transition: "transform 0.5s",background:"none", outline:"none", border: "none"}} onClick={(e)=>{
                                    this.setState({isSidebarToggleActive: !this.state.isSidebarToggleActive},()=>{
                                        this.props.setSidebarOpen(this.state.isSidebarToggleActive);
                                    });
                                    document.getElementById('side-mobbar-btn').style.transform = `rotate(${this.state.isSidebarToggleActive?0:180}deg)`;
                                }}>
                                    <i className="fa fa-bars" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="row">
                            <div className="col p-0">
                                <h2>Patient Finder Definition</h2>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="row">
                            <div className="col">
                                <label htmlFor="user-preference" style={{width: "100%"}}>
                                    Preferences &nbsp;
                                    <Tooltip title="Select the preference that you want to be viewed in the graphs displayed on the right side.">
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    </Tooltip> &nbsp;
                                    <div style={{display: "inline-block", float: "right"}}>
                                        <Tooltip title="Refresh Preference list if you donot see any of your recently created/updated preference name">
                                            <button style={{border: "none", fontSize:"13px"}} onClick={(e)=>{e.preventDefault(); this.refreshPreference()}}>
                                                <small>Refresh</small> <i className="fa fa-refresh" aria-hidden="true"></i>
                                            </button>
                                        </Tooltip>
                                    </div>
                                </label>
                                <select name="preference" id="user-preference" onChange={(e)=>{this.showPreference(e.target.value)}}>
                                    {
                                        this.state.userPreferenceList.map(e=>{
                                            return <option key={`${e.userid}-pref-${e.id}`} value={e.id} defaultValue={this.state.defaultPreference==e.id}>{e.saveName}</option>;
                                        })
                                    }
                                    
                                </select>
                                <div style={{fontSize:"12px"}}>
                                    <div className="py-1">
                                        <button type="button" onClick={()=>{
                                                this.savePreferences(this.state.selectedPreference);
                                            }} style={{color: "#0000dd", border:"none",background:"none"}}>
                                            <i className="fa fa-floppy-o" aria-hidden="true"></i> &nbsp; Save Preferences &nbsp;
                                            <Tooltip style={{color: "black"}} title="This will save any changes you made to the current preference. Note that this will not save the Treatment/Medical (AND/OR) condition">
                                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                            </Tooltip>
                                        </button>
                                    </div>
                                    <div className="py-1">
                                        <Link onClick={(e)=>{
                                                e.preventDefault(); window.location.href=`/dashboard/ckd/patientfinder/preferences/new`;
                                            }} style={{color: "#0000dd", border:"none",background:"none"}} to="/dashboard/ckd/patientfinder/preferences/new">
                                            <i className="fa fa-plus" aria-hidden="true"></i> &nbsp; Create New Preferences
                                        </Link>
                                    </div>
                                </div>
                                <div className="hr-line"></div>
                            </div>
                        </div>
                    
                        {/* Group By */}
                        <div className="row">
                            <div className="col">
                                <label>Group by * &nbsp;
                                    <Tooltip title="Select atleast 1. Choose one option from below. By choosing you will be classifying rest of the upcoming conditions in comparision to this choice and render it's results within the graphs.">
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    </Tooltip>
                                </label>
                                <div><input onChange={(e)=>{ this.setState({groupBy:[], groupByType: e.target.value}); }} type="radio" name="groupbyType" id="ckd-cohort" value="cohort" checked={this.state.groupByType==="cohort"} /> <label className="m-0" htmlFor="ckd-cohort">Cohort</label></div>
                                <div><input onChange={(e)=>{ this.setState({groupBy:[], groupByType: e.target.value}); }} type="radio" name="groupbyType" id="ckd-paytype" value="paytype" checked={this.state.groupByType==="paytype"} /> <label className="m-0" htmlFor="ckd-paytype">Insurance payer</label></div>
                            </div>
                        </div>

                        <div className="row">
                            {(this.state.groupByType==="cohort")?(
                                <div className="col ps-4">
                                    <label>Cohort Type * &nbsp;
                                        <Tooltip title="Select atleast 1. Choose one or more from the cohorts options below. This will highlight patient's population specific to the chosen cohort to the graphs.">
                                            <i className="fa fa-info-circle" aria-hidden="true"></i>
                                        </Tooltip>
                                    </label>
                                    {
                                        ['CKD','DIAB','BOTH'].map((e)=>{
                                            return this.createGroupByOptions('cohort', e);
                                        })
                                    }
                                    <div className="hr-line"></div>
                                </div>
                            ):(
                                <div className="col ps-4">
                                    <label>Insurance payer type &nbsp;
                                        <Tooltip title="Choose one or more from the payer type options below. This will highlight patient's population specific to the chosen insurance payer type to the graphs.">
                                            <i className="fa fa-info-circle" aria-hidden="true"></i>
                                        </Tooltip>
                                    </label>
                                    {
                                        ['MCR','COM'].map((e)=>{
                                            return this.createGroupByOptions('paytyp', e);
                                        })
                                    }
                                    <div className="hr-line"></div>
                                </div>
                            )}
                        </div>

                        {/* Query specific options State, (Treatment/Medical Conditions)(AND/OR) */}
                        <div className="row">
                            <div className="col p-1">
                                <AccordianMenu accordianId="ckd-states" expanded={true} name="States *" 
                                    description="Select atleast 1. Select the states whose patient's are counted in the population in the results." labels={this.state.stateLabels}
                                    selectedLabelData={this.state.selectedStateLabelData}
                                    updateSelectedValueSet={(updatedSet)=>this.updateSelectedValueSet('selectedStateLabelData', updatedSet)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col p-1">
                                <AccordianMenu accordianId="ckd-medical-and" expanded={false} name="Medical Condition AND" 
                                    description="Select from below if you want to count the population of patients having a group of features. This will increase specificity by displaying patient that are only meeting the criteria, i.e, showing only those patients who are having all selected features from below." 
                                    labels={this.props.medicalChartLabels} 
                                    selectedLabelData={this.state.selectedMedicalConditionANDLabelData}
                                    updateSelectedValueSet={(updatedSet)=>this.updateSelectedValueSet('selectedMedicalConditionANDLabelData', updatedSet)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col p-1">
                                <AccordianMenu accordianId="ckd-medical-or" expanded={false} name="Medical Condition OR" 
                                    description="Select from below if you want to count the population of patients having either one of the selected features from below. This means a patient is taken into account if and only if they have one or more of the selected features. Hence, discarding any patients that are showcasing none of the selected features." 
                                    labels={this.props.medicalChartLabels}
                                    selectedLabelData={this.state.selectedMedicalConditionORLabelData}
                                    updateSelectedValueSet={(updatedSet)=>this.updateSelectedValueSet('selectedMedicalConditionORLabelData', updatedSet)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col p-1">
                                <AccordianMenu accordianId="ckd-treatment-and" expanded={false} name="Treatment AND" 
                                    description="Select from below if you want to count the population of patients having a group of features. This will increase specificity by displaying patient that are only meeting the criteria, i.e, showing only those patients who are having all selected features from below." 
                                    labels={this.props.treatmentChartLabels} 
                                    selectedLabelData={this.state.selectedTreatmentANDLabelData}
                                    updateSelectedValueSet={(updatedSet)=>this.updateSelectedValueSet('selectedTreatmentANDLabelData', updatedSet)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col p-1">
                                <AccordianMenu accordianId="ckd-treatment-or" expanded={false} name="Treatment OR" 
                                    description="Select from below if you want to count the population of patients having either one of the selected features from below. This means a patient is taken into account if and only if they have one or more of the selected features. Hence, discarding any patients that are showcasing none of the selected features." 
                                    labels={this.props.treatmentChartLabels}
                                    selectedLabelData={this.state.selectedTreatmentORLabelData}
                                    updateSelectedValueSet={(updatedSet)=>this.updateSelectedValueSet('selectedTreatmentORLabelData', updatedSet)}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col text-center py-4">
                                <Button type="submit" sx={{width:'45%', margin: '5px'}} variant="contained" disabled={this.state.isUpdateButtonDisabled}>Update</Button>
                                <Button type="reset" sx={{width:'45%', margin: '5px'}} variant="outlined" color="error" onClick={(e)=>{
                                    /* Reset */
                                    this.setState({
                            
                                        /* static data */
                                        groupByType: "cohort",
                                        groupBy: [],
                            
                                        /* Accordian Data */
                                        selectedStateLabelData: new Set(),
                                        selectedMedicalConditionORLabelData: new Set(),
                                        selectedMedicalConditionANDLabelData: new Set(),
                                        selectedTreatmentORLabelData: new Set(),
                                        selectedTreatmentANDLabelData: new Set(),
                            
                                        isUpdateButtonDisabled: true,
                            
                                        labelError: false, /* For notifying API related errors ... */
                                    })
                                }}>Reset</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

/** Render Patient Finder section part of the dashboard */
export class PatientFinder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messageStatus: 0, /* Setting this will show message at the bottom (MessageType = -1:Error, 0: None/No Show, 1: Info, 2: Success) */
            messageText: "",
            sidebarOpen: false,
            
            stateData: {},
            treatmentChartData: {},
            medicalChartData: {},

            medicalChartLabels: [],
            treatmentChartLabels: [],
            
            treatmentChartSelectedLabels: [],
            medicalChartSelectedLabels: [],

            formFilters: {}
        }
        this.showMessage = this.showMessage.bind(this);
        this.updateGraph = this.updateGraph.bind(this);
        this.getChartLabels = this.getChartLabels.bind(this);
        this.createChartData = this.createChartData.bind(this);
    }

    componentDidMount(){
        this.getChartLabels();
    }

    showMessage(messageStatus, messageText){
        this.setState({
            messageStatus: messageStatus,
            messageText: messageText,
        })
    }


    getChartLabels(){
        getLabels(Cookies.get('userid'), Cookies.get('authToken')).then((response)=>{
            if(response.data.success===1){

                this.setState({
                    labelError: false,
                    medicalChartLabels: response.data.data.filter((e)=>e.label_type==="medical_condition"),
                    treatmentChartLabels: response.data.data.filter((e)=>e.label_type==="treatment")
                });

            } else {
                this.setState({
                    labelError: true
                }, ()=>{
                    this.showMessage(-1, "There seems to be a technical issue on medical/treatment labels from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            }
        }).catch(err=>{
            this.setState({
                labelError: true
            },()=>{
                this.showMessage(-1, "There seems to be a technical issue on medical/treatment labels from the server! Please hit refresh or try again later ...");
                setTimeout(()=>{this.showMessage(0, "")},15000);
            });
        });
    }

    createChartData(obj) {
        const colors = ['#23B5D3', '#F7B801', '#495F41']
        const chart = { labels: obj.labels, datasets: [] }
        obj.data.map((val, index) => {
            chart.datasets.push({
                label: val.type,
                backgroundColor: colors[index],
                data: val.data
            });
        })
        
        return chart;
    }

    getUSStateData(formFilterObj){
        getStatesData(Cookies.get('userid'),Cookies.get('authToken'), formFilterObj).then((response)=>{
            if(response.data.success===1){
                this.setState({stateData: response.data.data});
            }else{
                this.showMessage(-1, "Technical issue is faced while updating the US Map. Please refresh or try again later.");
            }
        }).catch(err=>{
            this.showMessage(-1, "Technical issue is faced while updating the US Map. Please refresh or try again later.")
        });
    }

    updateGraph(formFilterObj){

        if(Object.keys(this.state.treatmentChartSelectedLabels).length>0){
            formFilterObj.treatments.labels = this.state.treatmentChartSelectedLabels.map(e=>e.label);
        }else{
            this.showMessage(1, "Please set the Treatment Chart Labels to atleast one feature.");
            return;
        }

        if(Object.keys(this.state.medicalChartSelectedLabels).length>0){
            formFilterObj.medical_conditions.labels = this.state.medicalChartSelectedLabels.map(e=>e.label);
        }else{
            this.showMessage(1, "Please set the Medical Chart Labels to atleast one feature.");
            return;
        }
        
        this.showMessage(0, "")

        getTreatmentsData(Cookies.get('userid'),Cookies.get('authToken'), formFilterObj).then((treatmentResponse)=>{
            const res = treatmentResponse.data.data;
            if(res.match===1){
                res.treatments.labels.shift();
                res.treatments.data = res.treatments.data.map((e, i) => {
                    const ALL_DATA = e.data.shift();
                    const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
                    return { type: e.type, data: result };
                });
                const treatmentsChart = this.createChartData(res.treatments);
                this.setState({ treatmentChartData: treatmentsChart});
            }else{
                this.showMessage(1, "No match found in specific to the selected states with medical (AND/OR) and treatment (AND/OR).");
            }
        }).then(()=>{
            getMedicalData(Cookies.get('userid'),Cookies.get('authToken'), formFilterObj).then((medicalResponse)=>{
                const res = medicalResponse.data.data;
                if(res.match===1){
                    res.medical_conditions.labels.shift();
                    res.medical_conditions.data = res.medical_conditions.data.map((e, i) => {
                        const ALL_DATA = e.data.shift();
                        const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
                        return { type: e.type, data: result };
                    });
                    const medicalsChart = this.createChartData(res.medical_conditions);
                    this.setState({ medicalChartData: medicalsChart});
                }else{
                    this.showMessage(1, "No match found in specific to the selected states with medical (AND/OR) and treatment (AND/OR).");
                }
                
            }).then(()=>this.getUSStateData(formFilterObj)).catch(err=>{
                this.showMessage(-1, "Technical issue faced on retreiving Medical Chart data");
            })
        }).then(this.setState({formFilters: formFilterObj})).catch((err)=>{
            this.showMessage(-1, "Technical issue faced on retreiving Treatment Chart data");
        });
    }

    render(){
        return(
            <div className="container-fluid patient-finder">
                <div className="row">
                    <div className="col-12 p-0">

                        {/* Side Panel */}
                        <div className={"side-panel animate__animated animate__fadeInLeft animate__delay-1s "+(this.state.sidebarOpen?"open":"")}>
                            <SidePanel medicalChartLabels={this.state.medicalChartLabels} treatmentChartLabels={this.state.treatmentChartLabels} setSidebarOpen={(isOpen)=>{this.setState({sidebarOpen:isOpen})}} showMessage={this.showMessage} updateGraph={this.updateGraph} />
                        </div>

                        {/* Graph display Area */}
                        <div id="dash" className="display-area ">
                            <Router>
                                <Switch>
                                    <Route exact path="/dashboard/ckd/patientfinder/preferences/new">
                                        <UserPreferences showMessage={this.showMessage} pageType={'create'}/>
                                    </Route>
                                    <Route exact path="/dashboard/ckd/patientfinder/preferences/edit">
                                        <UserPreferences showMessage={this.showMessage} pageType={'edit'}/>
                                    </Route>
                                    <Route exact path="/dashboard/ckd/patientfinder/preferences/view">
                                        <UserPreferences showMessage={this.showMessage} pageType={'view'}/>
                                    </Route>
                                    <Route exact path="/dashboard/ckd/patientfinder/preferences">
                                        <UserPreferences showMessage={this.showMessage} pageType={'view'}/>
                                    </Route>
                                    <Route exact path="/dashboard/ckd/patientfinder">
                                        <PopulationChartings setMessage={this.showMessage} treatmentChartLabels={this.state.treatmentChartLabels} medicalChartLabels={this.state.medicalChartLabels} 
                                            setSelectedMedicalLabels={(labels)=>{
                                                this.setState({
                                                    medicalChartSelectedLabels: labels
                                                },()=>{
                                                    if(Object.keys(this.state.formFilters).length>0){
                                                        this.updateGraph(this.state.formFilters);
                                                    }
                                                })
                                            }}
                                            setSelectedTreatmentLabels={(labels)=>{
                                                this.setState({
                                                    treatmentChartSelectedLabels: labels
                                                },()=>{
                                                    if(Object.keys(this.state.formFilters).length>0){
                                                        this.updateGraph(this.state.formFilters);
                                                    }
                                                })
                                            }}
                                            formFilterObj={this.state.formFilters}
                                            medicalChartSelectedLabels={this.state.medicalChartSelectedLabels} treatmentChartSelectedLabels={this.state.treatmentChartSelectedLabels}
                                            medicalChartData={this.state.medicalChartData} treatmentsChartData={this.state.treatmentChartData} stateData={this.state.stateData} 
                                            minPatientCount={(Object.keys(this.state.stateData).length>0)?this.state.stateData.min:0} maxPatientCount={(Object.keys(this.state.stateData).length>0)?this.state.stateData.max:0}/>
                                    </Route>
                                    <Route path="*"><NotFound showNav={false} isCustomTitle={true} link="/dashboard/ckd/patientfinder" linkTitle="Patient Finder Page"/></Route>
                                </Switch>
                            </Router>
                        </div>

                        {/* Pop up Info box: Only visible on error or updates */}
                        <div style={{
                            position: "fixed", 
                            bottom: 0,
                            right: 0,
                            display: this.state.messageStatus===0 ?'none':'block',
                            width: "400px",
                            padding: "5px",
                            fontSize: "14px",
                        }}>
                            <div style={{
                                color: "white", 
                                backgroundColor: {'-1': "red", '1': "blue", '2': "green"}[(this.state.messageStatus).toString()],
                                width: "100%",
                                borderRadius: "10px",
                                padding: "10px",
                                minHeight: "50px",
                                textAlign: "center",
                            }}>
                                {
                                    {
                                        '-1': (<i className="fas fa-exclamation"></i>), 
                                        '1': (<i className="fas fa-info-circle"></i>), 
                                        '2': (<i className="fas fa-check"></i>)
                                    }[(this.state.messageStatus).toString()]
                                }&nbsp;<span>{this.state.messageText}</span>
                            </div>
                        </div>
                        

                    </div>
                </div>
            </div>
        );
    }
}