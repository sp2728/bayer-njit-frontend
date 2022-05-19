import { Link } from "react-router-dom";
import './Introduction.css';
import studyDesignImage from './study_design.png';
import logo from '../../Common/bayer_logo.png';

const Objective = (props)=>{
    return(
        <div id="objective" className="row">
            <div className="col-12">
                <h2>CKD Population Navigator</h2>
                <h3>Introduction</h3>
                <p>
                    The CKD Population Navigator is a data visualization and analytics tool based upon the results of a retrospective, 
                    cross-sectional analysis of the Optum Administrative claims database to describe the Chronic Kidney Disease and 
                    Type 2 Diabetes patient landscape within the database in the year 2019. The tool allows users to explore the following 
                    characteristics in the type 2 diabetes (T2D), chronic kidney disease (CKD), and CKD and T2D populations: demographic, 
                    clinical (i.e., events, comorbidities), medication use, and kidney labs.
                </p>
                <h3>Objective</h3>
                <p>
                    Understand the demographic and clinical characteristics of individuals with Type II Diabetes(T2D), Chronic Kidney Disease (CKD), and CKD w/ T2D within a commercial/medicare advantage claims database.
                </p>

                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

const PatientSelection = (props)=>{
    return(
        <div id="patient-selection" className="row">
            <div className="col-12">
                <h2>Patient Selection</h2>
                
                <ul>
                    <li><strong>Cohort</strong>: T2D without CKD</li>
                    <li><strong>Inclusion</strong>: At least 1 diagnosis code for T2D in 2019</li>
                    <li><strong>Exclusion</strong>: &lt; 18 years of age; diagnosis of CKD in 2019</li>
                </ul>

                <ul>
                    <li><strong>Cohort</strong>: CKD without T2D</li>
                    <li><strong>Inclusion</strong>: At least 1 diagnosis code for CKD in 2019</li>
                    <li><strong>Exclusion</strong>: &lt; 18 years of age; diagnosis of T2D in 2019</li>
                </ul>

                <ul>
                    <li><strong>Cohort</strong>: CKD and T2D</li>
                    <li><strong>Inclusion</strong>: At least 1 diagnosis code for CKD and 1 diagnosis code for T2D in 2019</li>
                    <li><strong>Exclusion</strong>: &lt; 18 years of age</li>
                </ul>

                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

const StudyDesign = ()=>{
    return (
        <div id="study-design" className="row">
            <div className="col-12">
                <h2>Study Design</h2>

                <p><strong>Study design</strong>: Cross-sectional analysis</p>
                <p><strong>Study period</strong>: 1 January 2019 – 31 December 2019</p>

                <div className="p-3 text-center">
                    <img className="study-design-img" alt="CKD Population Navigator - Study Design" src={studyDesignImage} />
                </div>

                <p>
                    All analyses are descriptive in nature and displayed using tables and figures. Descriptive analyses of the data were performed using summary statistics. 
                    Measures including clinical events, comorbidities, provider types, and medication use are reported as the number and percentage of patients in a cohort
                    who had a particular demographic or clinical characteristic, or had visited a provider specialty of interest.
                </p>
                
                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

const OACDB= ()=>{
    return (
        <div id="oacdb" className="row">
            <div className="col-12">
                <h2>Optum Administrative Claim Database</h2>

                <p>More information about Optum administrative claims dataset</p>

                <ul>
                    <li>Data from January 2007 to present</li>
                    <li>Health plan-based</li>
                    <li>Includes between 12.4 to 14 million unique commercial members each year</li>
                    <li>~3.5 million Medicare enrollment in 2015 with steady growth</li>
                    <li>Represents ~25% of Medicare Advantage enrollment in the United States</li>
                </ul> 
                
                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

export const Introduction = ()=>{
    return(
        <div style={{paddingTop: "20vh"}} className="container introduction">
            <div className="row">
                <div className="col-12 py-4">
                    <div style={{display:"inline-block"}} className="col-12 col-md-6">
                        <h2 id="intro-content">Content</h2>
                        <div className="ul">
                            <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('objective').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#objective">CKD Population Navigator and it's Objective</Link></li>
                            <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('patient-selection').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#patient-selection">Patient Selection</Link></li>
                            <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('study-design').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#study-design">Study Design</Link></li>
                            <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('oacdb').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#oacdb">Optum Administrative Claims Database</Link></li>
                        </div>
                    </div>
                    <div style={{display:"inline-block"}} className="col-md-5 pt-3 pt-md-0 text-center">
                        <img style={{width:"40%", height: "auto"}} src={logo} alt="Bayer Pharmaceutical's logo" />
                    </div>
                </div>
            </div>

            <Objective/>
            <PatientSelection/>
            <StudyDesign/>
            <OACDB/>

            <div className="col-12 text-center pb-5 pt-2">
                <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#intro-content">Back to Content</Link>
            </div>
        </div>
    );
}