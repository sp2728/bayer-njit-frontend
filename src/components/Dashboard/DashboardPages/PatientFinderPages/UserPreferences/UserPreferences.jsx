import { Button, TextField, Tooltip } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { addUserPreferences, deleteUserPreferences, editUserPreferences, getStateLabels, getUserPreferences } from "../../../../../api/ckdAPI";
import { getStateNameFromAcronym } from "../../../../Common/CommonComponent";
import { AccordianMenu } from "../../PatientFinder";
import "./UserPreferences.css";

const PreferenceForm = (props)=>{
    const search = useLocation().search;
    let preferenceId;
    if(props.pageType==='edit'){
        preferenceId = new URLSearchParams(search).get('preferenceId');
    }
    
    function createGroupByOptions(type, value){
        return (
            <div key={`pref-${type}-${value}`}>
                <input onChange={(e)=>{ 
                    if(props.groupBy.includes(e.target.value)){
                        props.setPreferenceState({
                            groupBy: props.groupBy.filter((e)=>{
                                return e!==value.toLowerCase();
                            })
                        });
                    }else{
                        props.setPreferenceState({
                            groupBy: props.groupBy.concat([e.target.value])
                        });
                    }
                }} type="checkbox" name="groupby" id={`pref-${type}-${value}`} value={value.toLowerCase()} checked={props.groupBy.includes(value.toLowerCase())} /> &nbsp;
                <label className="m-0" htmlFor={type}>{value}</label>
            </div>
        );
    }

    return (
        <form className="container-fluid p-3" onSubmit={(e)=>{e.preventDefault(); (props.pageType==='create')?props.onSubmit():props.onSubmit(preferenceId)}} method="post">
            <div className="row">
                <div className="col-12">
                    <TextField id="preference-name" type="text" className="form-input w-100" 
                        variant="standard" label="Preference Name" value={props.preferenceName}
                        onChange={(e) => {props.setPreferenceState({preferenceName: e.target.value});}} 
                        placeholder="Enter the Preference name"
                        required
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col py-3">
                            <label>Group by * &nbsp;
                                <Tooltip title="Select atleast 1. Choose one option from below. By choosing you will be classifying rest of the upcoming conditions in comparision to this choice and render it's results within the graphs.">
                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                </Tooltip>
                            </label>
                            <div>
                                <input 
                                    onChange={(e) => {props.setPreferenceState({groupByType: e.target.value, groupBy: []});}}
                                    type="radio" name="groupbyType" id="pref-cohort" 
                                    value="cohort" checked={props.groupByType==="cohort"} 
                                /> <label className="m-0" htmlFor="pref-cohort">Cohort</label>
                            </div>
                            <div>
                                <input 
                                    onChange={(e) => {props.setPreferenceState({groupByType: e.target.value, groupBy: []});}}
                                    type="radio" name="groupbyType" id="pref-paytype" 
                                    value="paytype" checked={props.groupByType==="paytype"} 
                                /> <label className="m-0" htmlFor="pref-cohort">Insurance payer</label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {(props.groupByType==="cohort")?(
                            <div className="col ps-4  py-3">
                                <label>Cohort Type * &nbsp;
                                    <Tooltip title="Select atleast 1. Choose one or more from the cohorts options below. This will highlight patient's population specific to the chosen cohort to the graphs.">
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    </Tooltip>
                                </label>
                                {
                                    ['CKD','DIAB','BOTH'].map((e)=>{
                                        return createGroupByOptions('cohort', e);
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
                                        return createGroupByOptions('paytyp', e);
                                    })
                                }
                                <div className="hr-line"></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input type="checkbox" name="pref-default" id="pref-default" checked={props.isDefault} onChange={()=>props.setPreferenceState({isDefault: !props.isDefault})}/><label htmlFor="pref-default">Make this as your Default Preference</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col py-3 pref-check">
                        <AccordianMenu accordianId="pref-states" expanded={true} name="States *" 
                            description="Select atleast 1. Select the states whose patient's are counted in the population in the results." labels={props.stateLabels}
                            selectedLabelData={props.selectedStateLabelData}
                            updateSelectedValueSet={(updatedSet)=>props.setPreferenceState({selectedStateLabelData: updatedSet})}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Button type="submit" sx={{width:'45%', margin: '5px'}} variant="contained" disabled={props.preferenceName==="" || props.selectedStateLabelData.size < 1 || props.groupBy.length < 1}>Update</Button>
                        <Button type="reset" sx={{width:'45%', margin: '5px'}} variant="outlined" color="error" onClick={(e)=>{
                            /* Reset */
                            props.setPreferenceState({
                    
                                /* static data */
                                groupByType: "cohort",
                                groupBy: [],
                    
                                /* Accordian Data */
                                selectedStateLabelData: new Set(),
                            })
                        }}>Reset</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export class UserPreferences extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            preferenceName: "New Preference",
            groupByType: "cohort",
            groupBy: [],
            selectedStateLabelData: new Set(),
            stateLabels: [],
            isDefault: false,

            userPreferenceList: [],
            defaultPreference: -1,
            selectedPreference: -1,

            scrollingElement: document.getElementsByClassName("display-area")[0],

            labelError: false,
        }
        this.viewPreferences = this.viewPreferences.bind(this);
        this.savePreferences = this.savePreferences.bind(this);
        this.createPreferences = this.createPreferences.bind(this);
        this.removePreferences = this.removePreferences.bind(this);
        this.getPreferenceForm = this.getPreferenceForm.bind(this);
        this.scrollSettings = this.scrollSettings.bind(this);
    }

    scrollSettings(e){
        try{
            this.setState({paddingTop: (window.innerWidth>767.98 && this.state.scrollingElement.scrollTop>125)?this.state.scrollingElement.scrollTop-90:0});
        } catch(e){
            this.setState({scrollingElement: document.getElementsByClassName("display-area")[0]}, ()=>{
                this.scrollSettings(e);
            })
        }
        
    }


    componentDidMount(){
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

        this.viewPreferences();

        document.getElementsByClassName("display-area")[0].addEventListener("scroll",this.scrollSettings)
    }
    componentWillUnmount(){
        document.getElementsByClassName("display-area")[0].removeEventListener("scroll",this.scrollSettings)
    }

    viewPreferences(){
        getUserPreferences(Cookies.get('userid'), Cookies.get('authToken')).then((response)=>{
            if(response.data.success===1){/* On Success read state data */
                this.setState({
                    labelError: false,
                    userPreferenceList: response.data.data.preferenceList,
                    defaultPreference: response.data.data.defaultPreferenceId,
                    selectedPreference: response.data.data.defaultPreferenceId
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

    createPreferences(){
        addUserPreferences(Cookies.get('userid'), Cookies.get('authToken'), this.state.preferenceName, {
            "group_condition": {
                "group_by": this.state.groupByType,
                "selection": this.state.groupBy,
            },
            "states": Array.from(this.state.selectedStateLabelData)
        }, this.state.isDefault).then((response)=>{
            if(response.data.success===1){/* On Success read state data */
                this.setState({
                    labelError: false,
                    userPreferenceList: this.state.userPreferenceList.concat(response.data.data),
                })
            } else {
                this.setState({
                    labelError: true
                },()=>{
                    this.props.showMessage(-1, "There seems to be a technical issue on creating new preference from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            }
        }).catch(err=>{
            this.setState({
                labelError: true
            },()=>{
                this.props.showMessage(-1, "There seems to be a technical issue on creating new preference from the server! Please hit refresh or try again later ...");
                setTimeout(()=>{this.props.showMessage(0, "")},15000);
            });
        });
    }

    savePreferences(preferenceId){
        editUserPreferences(Cookies.get('userid'), Cookies.get('authToken'), preferenceId, this.state.preferenceName, {
            "group_condition": {
                "group_by": this.state.groupByType,
                "selection": this.state.groupBy,
            },
            "states": Array.from(this.state.selectedStateLabelData)
        }, this.state.isDefault).then((response)=>{
            if(response.data.success===1){/* On Success read state data */
                this.setState({
                    labelError: false,
                    userPreferenceList: this.state.userPreferenceList.filter(e=>e.id!=preferenceId).concat(response.data.data),
                })
            } else {
                this.setState({
                    labelError: true
                },()=>{
                    this.props.showMessage(-1, "There seems to be a technical issue on saving user preferences from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            }
        }).catch(err=>{
            this.setState({
                labelError: true
            },()=>{
                this.props.showMessage(-1, "There seems to be a technical issue on saving user preferences from the server! Please hit refresh or try again later ...");
                setTimeout(()=>{this.props.showMessage(0, "")},15000);
            });
        });
    }

    removePreferences(preferenceId){
        deleteUserPreferences(Cookies.get('userid'), Cookies.get('authToken'), preferenceId).then((response)=>{
            if(response.data.success===1){/* On Success read state data */
                this.setState({
                    labelError: false,
                    userPreferenceList: this.state.userPreferenceList.filter(e=>e.id!=preferenceId),
                })
            } else {
                this.setState({
                    labelError: true
                },()=>{
                    this.props.showMessage(-1, "There seems to be a technical issue on delete user preferences from the server! Please hit refresh or try again later ...");
                    setTimeout(()=>{this.props.showMessage(0, "")},15000);
                });
            }
        }).catch(err=>{
            this.setState({
                labelError: true
            },()=>{
                this.props.showMessage(-1, "There seems to be a technical issue on delete user preferences from the server! Please hit refresh or try again later ...");
                setTimeout(()=>{this.props.showMessage(0, "")},15000);
            });
        });
    }
    getPreferenceForm(){
        return <PreferenceForm setPreferenceState={(obj)=>{this.setState(obj);}} preferenceName={this.state.preferenceName} 
            groupByType={this.state.groupByType} groupBy={this.state.groupBy} 
            selectedStateLabelData={this.state.selectedStateLabelData} stateLabels={this.state.stateLabels}
            pageType={this.props.pageType}
            isDefault={this.state.isDefault}
            onSubmit={(this.props.pageType==='edit')?this.savePreferences:this.createPreferences}
        />
    }

    render(){
        let isCreateFirst;
        switch(this.props.pageType){
            case 'edit': 
            case 'create':
                isCreateFirst = true;break;
            case 'view':
                isCreateFirst = false;
        }
        return (
            <div className="container-fluid px-4 pb-5">
                <div className="row">
                    <div className="col-12 pb-4 animate__animated animate__fadeInLeft">
                        <Link style={{textDecoration:"none"}} to="/dashboard/ckd/patientfinder"> <i className="fas fa-chevron-left"></i> &nbsp; Go Back to Patient Finder Charting Page</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 animate__animated animate__fadeInLeft animate__delay-2s">
                        <p><small><strong>Note</strong>: <span>{(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))?"Press & Hold":"Hover over"}</span> the <Tooltip title="Congrats! You are now seeing a sample detail. You can proceed to see other tooltips to know more info."><i className="fa fa-info"></i></Tooltip> tooltip icon to display more details.</small></p>
                    </div>
                </div>
                <div className="row">
                    <div className={"col-12 col-md-5 animate__animated animate__fadeInUp animate__delay-1s order-"+((isCreateFirst)?"1":"2")}>
                        <div className="chart-card" style={{overflowX:"hidden"}}>
                            <div className="row p-3">
                                <div className="col-12">
                                    <h2 style={{fontSize: "24px"}}>{(this.props.pageType==='edit')?"Edit Preferences":"Create Preferences"}</h2>
                                </div>
                            </div>
                            {this.getPreferenceForm()}
                        </div>
                    </div>
                    <div style={{paddingTop: this.state.paddingTop}} className={"col-12 col-md-7 scrollable-card animate__animated animate__fadeInUp animate__delay-2s order-"+((isCreateFirst)?"2":"1")}>
                        <div className="chart-card">
                            <table className="table table-responsive">
                                <thead className="table-dark">
                                    <tr>
                                        <th></th>
                                        <th>Preference Name</th>
                                        <th>
                                            <Tooltip title="Click on Edit button beside the preference name to edit the preference">
                                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                            </Tooltip>
                                        </th>
                                        <th>
                                            <Tooltip title="Click on Delete button beside the preference name to remove the preference">
                                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                            </Tooltip>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.userPreferenceList.map((preference,index)=>{
                                        return (
                                            <tr key={preference.id}>
                                                <td>{index+1}</td>
                                                <td>{preference.saveName}</td>
                                                <td><Link onClick={()=>{ 
                                                    const preferenceData = this.state.userPreferenceList.filter(e=>e.id===preference.id);
                                                    if(preferenceData.length>0){
                                                        this.setState({
                                                            preferenceName: preferenceData[0].saveName,
                                                            groupByType: preferenceData[0].jsonData.group_condition.group_by,
                                                            groupBy: preferenceData[0].jsonData.group_condition.selection,
                                                            selectedStateLabelData: new Set(preferenceData[0].jsonData.states),
                                                            isDefault: preferenceData[0].id===this.state.defaultPreference,
                                                        }) 
                                                    }
                                                }} style={{border: "none", background:"none", color:"rgb(143, 143, 4)", textDecoration:"none"}} to={`/dashboard/ckd/patientfinder/preferences/edit?preferenceId=${preference.id}`}><i className="fa fa-pencil" aria-hidden="true"></i> &nbsp; Edit</Link></td>
                                                <td><button style={{border: "none", background:"none", color:"red"}} onClick={()=>this.removePreferences(preference.id)}><i className="fas fa-trash"></i>&nbsp; Delete</button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}