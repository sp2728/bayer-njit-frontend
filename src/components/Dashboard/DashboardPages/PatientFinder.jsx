import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormLabel, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import './PatientFinder.css';

class AccordianMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: true,
            selectAll: false,
            selectedLabelData: new Set(),
            showMoreLabels: false,
        }
    }
    render(){
        return (
            <Accordion expanded={this.state.expanded} disableGutters square key={`ckd-${this.props.accordianId}`} onChange={()=>{this.setState({expanded: !this.state.expanded})}}>
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
                                            if(this.state.selectAll){
                                                this.setState({
                                                    selectedLabelData: new Set(
                                                        this.props.labels.map((e,i)=>{
                                                            return e.value
                                                        })
                                                    )
                                                });
                                            } else {
                                                this.setState({
                                                    selectedLabelData: new Set()
                                                });
                                            }
                                        })
                                    }} name='selectAll' />
                            }
                            label={<Typography variant="body2" color="textSecondary">Select All</Typography>} />

                        {
                            this.props.labels.slice(0, 5).map((labelData, i) => {
                                if (i < 4) {
                                    return (
                                        <FormControlLabel key={labelData.value}
                                            control={
                                                <Checkbox
                                                    checked={this.state.selectedLabelData.has(labelData.value)}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                                    onChange={(e) => { 
                                                        this.setState({
                                                            selectedLabelData: (
                                                                (this.state.selectedLabelData.delete(labelData.value))? this.state.selectedLabelData
                                                                : this.state.selectedLabelData.add(labelData.value)
                                                            )
                                                        }, ()=>{
                                                            this.setState({
                                                                selectAll: this.state.selectAll && this.state.selectedLabelData.has(labelData.value)
                                                            });
                                                        }) 
                                                    }}
                                                    name={labelData.name} />
                                            }
                                            label={<Typography variant="body2" color="textSecondary">{labelData.name}</Typography>} />
                                    )
                                }
                                else {
                                    return (
                                        <div className="moreButton" key={`${this.props.accordianId}-moreButton`}>
                                            <Button onClick={() => setShowMore(true)} >And More {Object.keys(this.props.labels).length - 5} </Button>
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

class SidePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            groupByType: "cohort",
            groupBy: [],
            userPreferenceList: [],
        }
        this.createGroupByOptions = this.createGroupByOptions.bind(this);
    }
    
    componentDidMount(){
        /* TODO: Call API for data/option fetch here */
    }

    createGroupByOptions(type, value){
        return (
            <div key={`ckd-${type}-${value}`}>
                <input onChange={(e)=>{ 
                    if(this.state.groupBy.includes(e.target.value)){
                        this.setState({
                            groupBy: this.state.groupBy.filter((e)=>{
                            return e!==value;
                            })
                        });
                    }else{
                        this.setState({groupBy: this.state.groupBy.concat([e.target.value])});
                    }
                }} type="checkbox" name="groupby" id={`ckd-${type}-${value}`} value={value} checked={this.state.groupBy.includes(value)} /> &nbsp;
                <label className="m-0" htmlFor={type}>{value}</label>
            </div>
        );
    }

    render(){
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 side-panel-content">

                        {/* Title */}
                        <div className="row">
                            <div className="col">
                                <h2>Patient Finder Definition</h2>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="row">
                            <div className="col">
                                <label htmlFor="user-preference">
                                    Preferences &nbsp;
                                    <Tooltip title="Select the preference that you want to be viewed in the graphs displayed on the right side.">
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    </Tooltip>
                                </label>
                                <select name="preference" id="user-preference">
                                    {/* Replace this with map element creation on this.state.userPreferenceList */}
                                    <option value="1">Preference 1</option>
                                    <option value="2">Preference 2</option>
                                    <option value="3">Preference 3</option>
                                    <option value="4">Preference 4</option>
                                </select>
                                <div className="hr-line"></div>
                            </div>
                        </div>
                    
                        {/* Group By */}
                        <div className="row">
                            <div className="col">
                                <label>Group by &nbsp;
                                    <Tooltip title="Choose one option from below. By choosing you will be classifying rest of the upcoming conditions in comparision to this choice and render it's results within the graphs.">
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
                                    <label>Cohort Type &nbsp;
                                        <Tooltip title="Choose one or more from the cohorts options below. This will highlight patient's population specific to the chosen cohort to the graphs.">
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
                                            return this.createGroupByOptions('paytype', e);
                                        })
                                    }
                                    <div className="hr-line"></div>
                                </div>
                            )}
                        </div>

                        {/* Query specific options (AND/OR) (Treatment/Medical Conditions) */}
                        <div className="row">
                            <div className="col p-0">
                                <AccordianMenu accordianId="state" name="Treatment AND" description="hello world" labels={[{
                                    name: "Treatment Label 1",
                                    value: "Treatment Value 1"
                                },{
                                    name: "Treatment Label 2",
                                    value: "Treatment Value 2"
                                }]}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class PatientFinder extends React.Component {
    constructor(props){
        super(props);

    }
    render(){
        return(
            <div className="container-fluid patient-finder">
                <div className="row">
                    <div className="col-12 p-0">

                        {/* Side Panel */}
                        <div className="side-panel animate__animated animate__fadeInLeft animate__delay-1s">
                            <SidePanel />
                        </div>

                        {/* Graph display Area */}
                        <div className="display-area">

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}