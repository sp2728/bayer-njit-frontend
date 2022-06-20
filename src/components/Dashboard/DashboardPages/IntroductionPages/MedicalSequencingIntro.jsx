import { Link} from "react-router-dom";
import studyDesignImage from './medseq_study_period.jpg';
import logo from '../../../Common/bayer_logo.png';

import './PatientFinderIntro.css';


const Objective = (props)=>{
    return(
        <div id="medseq-objective" className="row">
            <div className="col-12">
                <h2>Medication Sequencing</h2>
                
                <p style={{textAlign:"justified"}}>
                    Medication sequencing among incident CKD Patients was constructed for the targeted medication use categories listed below. The 
                    categories were identified by NDC code from the pharmacy claims filled during the follow-up period (including the index date).
                </p>
                <ul>
                    <li>ACE-I or ARB</li>
                    <li>SGLT-2i</li>
                    <li>GLP-1RA</li>
                    <li>(ACE-I or ARB) and SGLT-2i</li>
                    <li>(ACE-I or ARB) and GLP-1RA</li>
                    <li>SGLT-2i and GLP-1RA</li>
                    <li>(ACE-I or ARB) and SGLT-2i and GLP-1RA</li>
                    <li>No treatment</li>
                </ul>

                <h3>Objective</h3>
                <p>
                    Understand the demographic and clinical characteristics of individuals with Type II Diabetes(T2D), Chronic Kidney Disease (CKD), 
                    and CKD w/ T2D within a commercial/medicare advantage claims database.
                </p>

                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#medseq-intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

const InclusionCriteria = (props)=>{
    return(
        <div id="medseq-inclusion-criteria" className="row">
            <div className="col-12">
                <h2>Inclusion Criteria</h2>
                <ul>
                    <li>Diagnosis of CKD or diagnosis of CKD in T2D defined by 1 inpatient or outpatient medical claim during the index period. The date of the first diagnosis was designated as the index date.</li>
                    <li>Presence of a second, confirmatory CKD diagnosis or CKD in T2D diagnosis defined by 1 inpatient or outpatient medical claim after the index date.</li>
                    <li>At least 18 years old at the index date.</li>
                    <li>Continuous enrollment during the 12-month baseline period.</li>
                </ul>

                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#medseq-intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

const ExclusionCriteria = ()=>{
    return (
        <div id="medseq-exclusion-criteria" className="row">
            <div className="col-12">
                <h2>Exclusion Criteria</h2>

                <ul>
                    <li>Patients with a claim indicative of dialysis (including both hemodialysis or peritoneal dialysis), end stage renal disease, or kidney transplant during the baseline period.</li>
                    <li>Patients with a claim indicative of pregnancy anytime during the study period.</li>
                    <li>Patients with a claim indicative of cancer any time during the study period.</li>
                    <li>
                        Claims indicative of Type I Diabetes (T1DM) any time during the study period, defined as meeting all the conditions below:
                        <ul>
                            <li>At least 2 inpatient or outpatient claims for T1DM on distinct service dates</li>
                            <li className="medseq-ec-and" style={{listStyle:"none", fontWeight:"bold"}}>AND</li>
                            <li>At least one claim for insulin or insulin pump</li>
                            <li className="medseq-ec-and" style={{listStyle:"none", fontWeight:"bold"}}>AND</li>
                            <li>No prescription fills for non-insulin diabetes medications except metformin</li>
                        </ul>
                    </li>
                </ul>
                    
                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#medseq-intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}

const StudyDesign= ()=>{
    return (
        <div id="medseq-study-design" className="row">
            <div className="col-12">
                <h2>Study Design</h2>

                <ul>
                    <li><strong>Study period</strong>:&nbsp;1 January 2016 – 31 December 2019</li>
                    <li><strong>Index date</strong>:&nbsp;The date of first inpatient or outpatient claim for CKD or CKD in T2DM.</li>
                    <li><strong>Index period</strong>:&nbsp;1 January 2017 – 31 December 2017 (1 year), date range of possible index dates</li>
                    <li><strong>Baseline period</strong>:&nbsp;12-months prior to index date</li>
                    <li><strong>Follow-up period</strong>:&nbsp;Follow-up period is variable and begins on the index date and ends when a patient is lost to follow-up, death, or end of study.</li>
                </ul> 

                <div className="p-3 text-center">
                    <img className="study-design-img" alt="Medication Sequencing - Study Design" src={studyDesignImage} />
                </div>
                
                <div>
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#medseq-intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
}


export const MedicalSequencingIntro = ()=>{
    return(
        <div className="row">
            <div className="col medseq-intro intro">
                <div className="row">
                    <div className="col-12 py-4">
                        <div style={{display:"inline-block"}} className="col-12 col-md-6">
                            <h2 id="medseq-intro-content">Content</h2>
                            <ul>
                                <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('objective').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#medseq-objective">Medication Sequencing and it's Objective</Link></li>
                                <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('patient-selection').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#medseq-inclusion-criteria">Inclusion Criteria</Link></li>
                                <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('study-design').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#medseq-exclusion-criteria">Exclusion Criteria</Link></li>
                                <li><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.getElementById('oacdb').offsetTop-(screen.height*20/100) })}} to="/dashboard/ckd/intro#medseq-study-design">Study Design</Link></li>
                            </ul>
                        </div>
                        <div style={{display:"inline-block"}} className="col-md-5 pt-3 pt-md-0 text-center">
                            <img style={{width:"40%", height: "auto"}} src={logo} alt="Bayer Pharmaceutical's logo" />
                        </div>
                    </div>
                </div>

                <Objective/>
                <InclusionCriteria/>
                <ExclusionCriteria/>
                <StudyDesign/>

                <div className="col-12 text-center pb-5 pt-2">
                    <span className="px-3"><i className="fa fa-chevron-up" aria-hidden="true"></i></span><Link onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0})}} to="/dashboard/ckd/intro#medseq-intro-content">Back to Content</Link>
                </div>
            </div>
        </div>
    );
    
}